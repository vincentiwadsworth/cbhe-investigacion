import { createClient } from 'npm:@insforge/sdk';

// ── InsForge Client ──────────────────────────────────────────────────────────
var client = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDg3MDJ9.OVJRrr0XkJPfkP7ZU4TUJae1He6JIjCE73ixMux0VhA'
});

// ── Constants ────────────────────────────────────────────────────────────────
var DATA_SOURCE = 'WB Global Fuel Prices DB';
var FUENTE = 'World Bank';
var FRECUENCIA = 'mensual';
var BATCH_SIZE = 500;

// Country name mapping: WB → Dashboard
var COUNTRY_MAP = {
  'Mexico': 'México',
  'Colombia': 'Colombia',
  'Ecuador': 'Ecuador',
  'Peru': 'Perú',
  'Venezuela, RB': 'Venezuela',
  'Venezuela': 'Venezuela',
  'Chile': 'Chile',
  'Paraguay': 'Paraguay',
  'Argentina': 'Argentina',
  'Brazil': 'Brasil',
};

// Product name mapping
var PRODUCT_MAP = {
  'Regular gasoline (RON<95)': 'Gasolina Regular',
  'Premium gasoline (RON≥95)': 'Gasolina Premium',
  'Diesel': 'Diésel',
  'Kerosene': 'Kerosene',
  'Gasolina Regular': 'Gasolina Regular',
  'Gasolina Premium': 'Gasolina Premium',
  'Diésel': 'Diésel',
};

// Price bounds (USD/liter) — Venezuela diesel ~$0.004/L is legitimate
var BOUNDS = {
  'Gasolina Regular': { min: 0.01, max: 3.00 },
  'Gasolina Premium': { min: 0.01, max: 3.00 },
  'Diésel': { min: 0.001, max: 3.00 },
  'Kerosene': { min: 0.01, max: 3.00 },
};

// ── Validation ───────────────────────────────────────────────────────────────

function validate(record) {
  if (!record.fecha) return { valid: false, reason: 'null fecha' };
  if (!record.pais) return { valid: false, reason: 'null pais' };
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
    // Venezuela special case: subsidized prices are real
    if (record.pais === 'Venezuela') {
      // Accept Venezuelan subsidized prices
    } else {
      return { valid: false, reason: 'price ' + precio.toFixed(4) + ' out of range [' + bounds.min + ', ' + bounds.max + ']' };
    }
  }

  var recordDate = new Date(record.fecha);
  if (isNaN(recordDate.getTime())) return { valid: false, reason: 'invalid date: ' + record.fecha };
  if (recordDate > new Date()) return { valid: false, reason: 'future date: ' + record.fecha };

  return { valid: true, reason: 'ok' };
}

// ── Mapping ──────────────────────────────────────────────────────────────────

function mapCountry(wbName) {
  if (COUNTRY_MAP[wbName]) return COUNTRY_MAP[wbName];
  var keys = Object.keys(COUNTRY_MAP);
  for (var i = 0; i < keys.length; i++) {
    if (wbName.indexOf(keys[i]) !== -1 || keys[i].indexOf(wbName) !== -1) {
      return COUNTRY_MAP[keys[i]];
    }
  }
  return wbName;
}

function mapProduct(wbProduct) {
  if (PRODUCT_MAP[wbProduct]) return PRODUCT_MAP[wbProduct];
  var keys = Object.keys(PRODUCT_MAP);
  for (var i = 0; i < keys.length; i++) {
    if (wbProduct.toLowerCase().indexOf(keys[i].toLowerCase()) !== -1 ||
        keys[i].toLowerCase().indexOf(wbProduct.toLowerCase()) !== -1) {
      return PRODUCT_MAP[keys[i]];
    }
  }
  return wbProduct;
}

// ── Record Transformation ────────────────────────────────────────────────────

function transformRecords(rawRecords) {
  var valid = [];
  var rejected = [];

  for (var i = 0; i < rawRecords.length; i++) {
    var raw = rawRecords[i];

    var record = {
      fecha: raw.fecha || raw.date || null,
      pais: mapCountry(raw.pais || raw.country || ''),
      producto: mapProduct(raw.producto || raw.product || ''),
      precio_usd: raw.precio_usd !== undefined ? Number(raw.precio_usd) : null,
      precio_local: raw.precio_local !== undefined ? Number(raw.precio_local) : 0,
      moneda: raw.moneda || 'USD',
      fuente: FUENTE,
      data_source: DATA_SOURCE,
      frecuencia: FRECUENCIA,
      quality_score: raw.quality_score !== undefined ? Number(raw.quality_score) : 1.0,
    };

    var result = validate(record);
    if (result.valid) {
      valid.push(record);
    } else {
      rejected.push({ reason: result.reason, index: i });
    }
  }

  return { records: valid, rejected: rejected, validCount: valid.length, rejectedCount: rejected.length };
}

// ── Batch Upsert ─────────────────────────────────────────────────────────────

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
        console.error('[WB] Upsert error at offset ' + i + ': ' + JSON.stringify(result.error));
        allErrors.push({
          error: result.error.message || String(result.error),
          batch_start: i,
          batch_size: batch.length,
          timestamp: new Date().toISOString(),
        });
      } else {
        totalInserted += batch.length;
      }
    } catch (err) {
      console.error('[WB] Upsert exception at offset ' + i + ': ' + err.message);
      allErrors.push({
        error: err.message || String(err),
        batch_start: i,
        batch_size: batch.length,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return { inserted: totalInserted, errors: allErrors };
}

// ── Ingestion Log ────────────────────────────────────────────────────────────

async function writeIngestionLog(stats) {
  try {
    var totalAccepted = (stats.records_inserted || 0);
    var quality = stats.records_total > 0
      ? parseFloat((totalAccepted / stats.records_total).toFixed(2))
      : 1.0;

    var logEntry = {
      source: stats.source || DATA_SOURCE,
      run_type: stats.run_type || 'manual',
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

    var result = await client.database
      .from('_etl_runs')
      .insert([logEntry]);

    if (result.error) {
      console.error('[WB] Failed to write _etl_runs: ' + JSON.stringify(result.error));
    } else {
      console.log('[WB] Ingestion log written');
    }
  } catch (err) {
    console.error('[WB] Log exception: ' + err.message);
  }
}

// ── Main Handler ─────────────────────────────────────────────────────────────

export default async function importWbData(req) {
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
      { status: 405, headers: { 'Content-Type': 'application/json', 'Allow': 'POST' } }
    );
  }

  try {
    var body;
    try {
      body = await req.json();
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body', details: err.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    var rawRecords = Array.isArray(body) ? body : (body.records || []);
    stats.records_total = rawRecords.length;

    if (rawRecords.length === 0) {
      stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
      return new Response(
        JSON.stringify({ message: 'No records provided', stats: stats }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[WB] Processing ' + rawRecords.length + ' records in ' + mode + ' mode');

    // Step 1: Transform and validate
    var transformed = transformRecords(rawRecords);
    stats.records_rejected = transformed.rejectedCount;
    console.log('[WB] Valid: ' + transformed.validCount + ', Rejected: ' + transformed.rejectedCount);

    if (transformed.records.length === 0) {
      stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
      stats.quality_score = 0;
      await writeIngestionLog(stats);
      return new Response(
        JSON.stringify({
          message: 'No valid records after validation',
          rejected_count: transformed.rejectedCount,
          rejected_samples: transformed.rejected.slice(0, 5),
          stats: stats,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Dry-run mode
    if (mode === 'dry-run') {
      stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
      stats.quality_score = parseFloat((transformed.validCount / stats.records_total).toFixed(2));
      return new Response(
        JSON.stringify({
          message: 'Dry run complete — no data written',
          records_valid: transformed.validCount,
          records_rejected: stats.records_rejected,
          sample: transformed.records.slice(0, 3),
          rejected_samples: transformed.rejected.slice(0, 3),
          stats: stats,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 3: Batch upsert
    try {
      var upsertResult = await batchUpsert(transformed.records);
      stats.records_inserted = upsertResult.inserted;
      stats.error_count = upsertResult.errors.length;
      stats.errors = stats.errors.concat(upsertResult.errors);
    } catch (err) {
      stats.error_count++;
      stats.errors.push({
        phase: 'upsert',
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      console.error('[WB] Upsert failed: ' + err.message);
    }

    // Step 4: Write ingestion log
    var totalAccepted = stats.records_inserted;
    stats.quality_score = stats.records_total > 0
      ? parseFloat((totalAccepted / stats.records_total).toFixed(2))
      : 0;
    stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    await writeIngestionLog(stats);

    // Step 5: Return success
    return new Response(
      JSON.stringify({
        message: mode + ' complete',
        mode: mode,
        records_total: stats.records_total,
        records_valid: transformed.validCount,
        records_inserted: stats.records_inserted,
        records_rejected: stats.records_rejected,
        errors: stats.error_count,
        quality_score: stats.quality_score,
        duration_seconds: stats.duration_seconds,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    stats.error_count++;
    stats.errors.push({
      phase: 'global',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
    stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);

    console.error('[WB] Catastrophic failure: ' + err.message);

    await writeIngestionLog(stats);

    return new Response(
      JSON.stringify({ error: 'Internal error', details: err.message, stats: stats }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
