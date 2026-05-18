import { createClient } from 'npm:@insforge/sdk';

var client = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDg3MDJ9.OVJRrr0XkJPfkP7ZU4TUJae1He6JIjCE73ixMux0VhA'
});

var PAIS = 'Chile';
var DATA_SOURCE = 'energiaabierta.cl';
var FUENTE = 'CNE';
var MONEDA = 'CLP';
var FRECUENCIA = 'mensual';
var BATCH_SIZE = 500;

var BOUNDS = {
  'Gasolina 93': { min: 0.01, max: 3.00 },
  'Gasolina 95': { min: 0.01, max: 3.00 },
  'Gasoline 97': { min: 0.01, max: 3.00 },
  'Diesel': { min: 0.001, max: 3.00 },
  'Kerosene': { min: 0.01, max: 3.00 },
};

var CLP_TO_USD_FALLBACK = 0.00105;

function validate(record) {
  if (!record.fecha) return { valid: false, reason: 'null fecha' };
  if (!record.producto) return { valid: false, reason: 'null producto' };
  if (record.precio_usd === null || record.precio_usd === undefined) {
    return { valid: false, reason: 'null precio_usd' };
  }
  var precio = Number(record.precio_usd);
  if (isNaN(precio)) return { valid: false, reason: 'non-numeric precio_usd' };
  if (precio <= 0) return { valid: false, reason: 'zero or negative price' };
  var bounds = BOUNDS[record.producto];
  if (!bounds) return { valid: false, reason: 'unknown product: ' + record.producto };
  if (precio < bounds.min || precio > bounds.max) {
    return { valid: false, reason: 'price out of range' };
  }
  var recordDate = new Date(record.fecha);
  if (isNaN(recordDate.getTime())) return { valid: false, reason: 'invalid date: ' + record.fecha };
  if (recordDate > new Date()) return { valid: false, reason: 'future date: ' + record.fecha };
  return { valid: true, reason: 'ok' };
}

function transformRecords(rawRecords, exchangeRate) {
  var valid = [];
  var rejected = [];
  for (var i = 0; i < rawRecords.length; i++) {
    var raw = rawRecords[i];
    var precioLocal = Number(raw.precio_local);
    var producto = raw.producto || '';
    if (isNaN(precioLocal) || precioLocal <= 0 || !producto) {
      rejected.push({ reason: 'invalid data', index: i });
      continue;
    }
    var precioUsd = raw.precio_usd !== undefined && raw.precio_usd !== null
      ? Number(raw.precio_usd)
      : Math.round(precioLocal * exchangeRate * 10000) / 10000;
    var record = {
      fecha: raw.fecha,
      pais: PAIS,
      producto: producto,
      precio_usd: precioUsd,
      precio_local: precioLocal,
      moneda: MONEDA,
      fuente: FUENTE,
      data_source: DATA_SOURCE,
      frecuencia: FRECUENCIA,
      quality_score: raw.quality_score !== undefined ? Number(raw.quality_score) : 1.0,
    };
    var result = validate(record);
    if (result.valid) valid.push(record);
    else rejected.push({ reason: result.reason, index: i });
  }
  return { records: valid, rejected: rejected, validCount: valid.length, rejectedCount: rejected.length };
}

async function batchUpsert(records) {
  var totalInserted = 0;
  var allErrors = [];
  for (var i = 0; i < records.length; i += BATCH_SIZE) {
    var batch = records.slice(i, i + BATCH_SIZE);
    try {
      var result = await client.database
        .from('fuel_prices_regional')
        .upsert(batch, { onConflict: 'fecha,pais,producto' });
      if (result.error) {
        allErrors.push({
          error: result.error.message || String(result.error),
          batch_start: i,
          batch_size: batch.length,
        });
      } else {
        totalInserted += batch.length;
      }
    } catch (err) {
      allErrors.push({
        error: err.message || String(err),
        batch_start: i,
        batch_size: batch.length,
      });
    }
  }
  return { inserted: totalInserted, errors: allErrors };
}

async function writeIngestionLog(stats) {
  try {
    var totalAccepted = (stats.records_inserted || 0);
    var quality = stats.records_total > 0
      ? parseFloat((totalAccepted / stats.records_total).toFixed(2))
      : 1.0;
    var logEntry = {
      source: 'Chile ' + DATA_SOURCE,
      run_type: stats.run_type || 'import',
      start_date: stats.start_date || null,
      end_date: stats.end_date || null,
      records_fetched: stats.records_total || 0,
      records_inserted: stats.records_inserted || 0,
      records_updated: stats.records_updated || 0,
      records_rejected: stats.records_rejected || 0,
      error_count: stats.error_count || 0,
      errors: stats.errors && stats.errors.length > 0 ? stats.errors : null,
      duration_seconds: stats.duration_seconds || 0,
      quality_score: Math.min(quality, 1.0),
    };
    await client.database.from('_etl_runs').insert([logEntry]);
  } catch (err) {
    // swallow log errors
  }
}

export default async function importChile(req) {
  var startTime = Date.now();
  var url = new URL(req.url);
  var mode = url.searchParams.get('mode') || 'import';

  var stats = {
    source: DATA_SOURCE,
    run_type: mode,
    records_total: 0,
    records_inserted: 0,
    records_updated: 0,
    records_rejected: 0,
    error_count: 0,
    errors: [],
    duration_seconds: 0,
  };

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST with JSON body.' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    var body = await req.json();
    var rawRecords = Array.isArray(body) ? body : (body.records || []);
    stats.records_total = rawRecords.length;

    if (rawRecords.length === 0) {
      stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
      return new Response(
        JSON.stringify({ message: 'No records provided', stats: stats }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    var exchangeRate = body.exchangeRate || CLP_TO_USD_FALLBACK;
    var transformed = transformRecords(rawRecords, exchangeRate);
    stats.records_rejected = transformed.rejectedCount;

    if (transformed.records.length === 0) {
      stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
      await writeIngestionLog(stats);
      return new Response(
        JSON.stringify({ message: 'No valid records', rejected_count: transformed.rejectedCount, stats: stats }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (mode === 'dry-run') {
      stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
      return new Response(
        JSON.stringify({ message: 'Dry run complete', records_valid: transformed.validCount, stats: stats }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    var upsertResult = await batchUpsert(transformed.records);
    stats.records_inserted = upsertResult.inserted;
    stats.error_count = upsertResult.errors.length;
    stats.errors = stats.errors.concat(upsertResult.errors);

    stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    await writeIngestionLog(stats);

    return new Response(
      JSON.stringify({
        message: mode + ' complete',
        records_total: stats.records_total,
        records_valid: transformed.validCount,
        records_inserted: stats.records_inserted,
        records_rejected: stats.records_rejected,
        errors: stats.error_count,
        duration_seconds: stats.duration_seconds,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    stats.error_count++;
    stats.errors.push({ phase: 'global', error: err.message });
    stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    await writeIngestionLog(stats);
    return new Response(
      JSON.stringify({ error: 'Internal error', details: err.message, stats: stats }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}