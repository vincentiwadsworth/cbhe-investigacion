// ── InsForge REST API (direct fetch) ─────────────────────────────────────────
// SDK auth fails from Deno edge runtime, so we use raw PostgREST calls.

var BASE_URL = 'https://vmi3hxr8.us-east.insforge.app';
var API_KEY = 'ik_4fc93d0a0d063779e29e45bdda9a3470';

// ── Constants ────────────────────────────────────────────────────────────────
var MAX_RETRIES = 3;
var INITIAL_DELAY_MS = 1000;

var BCB_OFICIAL_URL = 'https://bcb.cucu.bo/api/v1/tc/oficial';
var BCB_REFERENCIAL_URL = 'https://bcb.cucu.bo/api/v1/tc/usd';
var DOLARAPI_URL = 'https://bo.dolarapi.com/v1/dolares';

// ── Date Helper ──────────────────────────────────────────────────────────────

function todayStr() {
  var d = new Date();
  var yyyy = d.getFullYear();
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd;
}

// ── Generic Fetch with Retry ─────────────────────────────────────────────────

async function fetchWithRetry(url, label) {
  var lastError = null;
  var delayMs = INITIAL_DELAY_MS;

  for (var attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log('[' + label + '] Attempt ' + (attempt + 1) + ': GET ' + url);
      var response = await fetch(url);

      if (response.ok) {
        var json = await response.json();
        console.log('[' + label + '] Success');
        return json;
      }

      if (response.status === 429 || response.status >= 500) {
        lastError = new Error('HTTP ' + response.status);
        console.warn('[' + label + '] HTTP ' + response.status + ' — will retry');
      } else {
        var errorText = 'N/A';
        try { errorText = (await response.text()).slice(0, 200); } catch (e) {}
        throw new Error('HTTP ' + response.status + ': ' + errorText);
      }
    } catch (err) {
      lastError = err;
      if (attempt === MAX_RETRIES) throw lastError;
    }

    if (attempt < MAX_RETRIES) {
      console.warn('[' + label + '] Retry ' + (attempt + 1) + '/' + MAX_RETRIES + ' after ' + delayMs + 'ms');
      var start = Date.now();
      for (; Date.now() - start < delayMs;) { /* busy-wait */ }
      delayMs = Math.min(delayMs * 2, 16000);
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// ── InsForge REST API Helpers ────────────────────────────────────────────────
// Edge functions can't use PostgREST (JWT-only). Use admin raw SQL instead.

function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + API_KEY,
  };
}

/**
 * Execute raw SQL via admin endpoint.
 */
async function dbRawSql(sql, params) {
  var url = BASE_URL + '/api/database/advance/rawsql';
  var body = { query: sql };
  if (params) body.params = params;

  var response = await fetch(url, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(body),
  });

  var text = await response.text();
  var data = null;
  try { data = JSON.parse(text); } catch (e) {}

  if (!response.ok) {
    return { error: { message: text, status: response.status }, data: null };
  }
  return { error: null, data: data };
}

/**
 * Escape a SQL value (simple quoting for strings/numbers).
 */
function sqlVal(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  // String — escape single quotes
  return "'" + String(v).replace(/'/g, "''") + "'";
}

/**
 * Upsert into exchange_rates via raw SQL.
 */
async function upsertExchangeRates(record) {
  var sql = 'INSERT INTO exchange_rates (fecha, pais, moneda, tasa_oficial, tasa_paralelo, fuente, data_source, frecuencia) ' +
    'VALUES (' + sqlVal(record.fecha) + ', ' + sqlVal(record.pais) + ', ' + sqlVal(record.moneda) + ', ' +
    sqlVal(record.tasa_oficial) + ', ' + sqlVal(record.tasa_paralelo) + ', ' + sqlVal(record.fuente) + ', ' +
    sqlVal(record.data_source) + ', ' + sqlVal(record.frecuencia) + ') ' +
    'ON CONFLICT (fecha, pais) DO UPDATE SET ' +
    'tasa_oficial = EXCLUDED.tasa_oficial, ' +
    'tasa_paralelo = EXCLUDED.tasa_paralelo, ' +
    'fuente = EXCLUDED.fuente, ' +
    'data_source = EXCLUDED.data_source, ' +
    'frecuencia = EXCLUDED.frecuencia';

  return await dbRawSql(sql);
}

/**
 * Insert into _etl_runs via raw SQL.
 */
async function insertEtlRun(logEntry) {
  var sql = 'INSERT INTO _etl_runs (source, run_type, start_date, end_date, records_fetched, records_inserted, records_updated, records_rejected, error_count, errors, duration_seconds, quality_score) ' +
    'VALUES (' + sqlVal(logEntry.source) + ', ' + sqlVal(logEntry.run_type) + ', ' + sqlVal(logEntry.start_date) + ', ' + sqlVal(logEntry.end_date) + ', ' +
    sqlVal(logEntry.records_fetched) + ', ' + sqlVal(logEntry.records_inserted) + ', ' + sqlVal(logEntry.records_updated) + ', ' + sqlVal(logEntry.records_rejected) + ', ' +
    sqlVal(logEntry.error_count) + ', ' + (logEntry.errors ? "'" + JSON.stringify(logEntry.errors).replace(/'/g, "''") + "'" : 'NULL') + '::jsonb, ' +
    sqlVal(logEntry.duration_seconds) + ', ' + sqlVal(logEntry.quality_score) + ')';

  return await dbRawSql(sql);
}

// ── BCB API Fetchers ─────────────────────────────────────────────────────────

async function fetchBcbOficial() {
  try {
    var data = await fetchWithRetry(BCB_OFICIAL_URL, 'BCB-OFICIAL');
    if (data && data.tc_oficial && typeof data.tc_oficial.valor === 'number') {
      return { valor: data.tc_oficial.valor, fecha: data.tc_oficial.fecha };
    }
    console.warn('[BCB-OFICIAL] Unexpected response structure');
    return null;
  } catch (err) {
    console.error('[BCB-OFICIAL] Failed: ' + err.message);
    return null;
  }
}

async function fetchBcbReferencial() {
  try {
    var data = await fetchWithRetry(BCB_REFERENCIAL_URL, 'BCB-REFERENCIAL');
    if (data && data.tc_referencial_usd && typeof data.tc_referencial_usd.venta === 'number') {
      return {
        compra: data.tc_referencial_usd.compra,
        venta: data.tc_referencial_usd.venta,
        fecha: data.tc_referencial_usd.fecha,
      };
    }
    console.warn('[BCB-REFERENCIAL] Unexpected response structure');
    return null;
  } catch (err) {
    console.error('[BCB-REFERENCIAL] Failed: ' + err.message);
    return null;
  }
}

// ── DolarApi Fetcher ─────────────────────────────────────────────────────────

async function fetchDolarApi() {
  try {
    var data = await fetchWithRetry(DOLARAPI_URL, 'DOLARAPI');
    if (!Array.isArray(data)) {
      console.warn('[DOLARAPI] Unexpected response — expected array');
      return null;
    }

    var result = {};
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if (item.casa === 'oficial') {
        result.oficial = { compra: item.compra, venta: item.venta };
      } else if (item.casa === 'binance') {
        result.binance = { compra: item.compra, venta: item.venta };
      }
    }

    if (!result.binance && !result.oficial) {
      console.warn('[DOLARAPI] No oficial or binance rates found');
      return null;
    }
    return result;
  } catch (err) {
    console.error('[DOLARAPI] Failed: ' + err.message);
    return null;
  }
}

// ── ETL Runs Logger ──────────────────────────────────────────────────────────

async function writeEtlLog(stats) {
  try {
    var totalAccepted = stats.records_inserted + (stats.records_updated || 0);
    var quality = stats.records_fetched > 0
      ? parseFloat((totalAccepted / stats.records_fetched).toFixed(2))
      : 1.0;

    var logEntry = [{
      source: 'ExchangeRates',
      run_type: stats.run_type,
      start_date: stats.fecha,
      end_date: stats.fecha,
      records_fetched: stats.records_fetched,
      records_inserted: stats.records_inserted,
      records_updated: stats.records_updated || 0,
      records_rejected: stats.records_rejected || 0,
      error_count: stats.error_count,
      errors: stats.errors.length > 0 ? stats.errors : null,
      duration_seconds: stats.duration_seconds,
      quality_score: Math.min(quality, 1.0),
    }];

    var result = await insertEtlRun(logEntry[0]);
    if (result.error) {
      console.error('[DB] Failed to write _etl_runs: ' + JSON.stringify(result.error));
    } else {
      console.log('[DB] ETL log written');
    }
  } catch (err) {
    console.error('[DB] Exception writing _etl_runs: ' + err.message);
  }
}

// ── Main Handler ─────────────────────────────────────────────────────────────

/**
 * Edge function: fetch-exchange-rates
 *
 * Fetches Bolivia exchange rates from multiple free APIs, combines them into
 * a single record, and upserts into the exchange_rates table.
 *
 * Sources:
 *   - BCB oficial (bcb.cucu.bo) → tasa_oficial
 *   - DolarApi Binance P2P (bo.dolarapi.com) → tasa_paralelo
 *   - BCB referencial (bcb.cucu.bo) → fallback for tasa_paralelo
 */
export default async function fetchExchangeRates(req) {
  var startTime = Date.now();

  var stats = {
    run_type: 'daily',
    fecha: todayStr(),
    records_fetched: 3,
    records_inserted: 0,
    records_updated: 0,
    records_rejected: 0,
    error_count: 0,
    errors: [],
    duration_seconds: 0,
  };

  try {
    // Step 1: Fetch all sources in parallel
    console.log('[EXCHANGE] Starting daily fetch for ' + stats.fecha);

    var results = await Promise.allSettled([
      fetchBcbOficial(),
      fetchBcbReferencial(),
      fetchDolarApi(),
    ]);

    var bcbOficial = results[0].status === 'fulfilled' ? results[0].value : null;
    var bcbReferencial = results[1].status === 'fulfilled' ? results[1].value : null;
    var dolarApi = results[2].status === 'fulfilled' ? results[2].value : null;

    console.log('[EXCHANGE] BCB Oficial: ' + (bcbOficial ? 'OK (' + bcbOficial.valor + ')' : 'FAILED'));
    console.log('[EXCHANGE] BCB Referencial: ' + (bcbReferencial ? 'OK (venta: ' + bcbReferencial.venta + ')' : 'FAILED'));
    console.log('[EXCHANGE] DolarApi: ' + (dolarApi ? 'OK (binance venta: ' + (dolarApi.binance ? dolarApi.binance.venta : 'N/A') + ')' : 'FAILED'));

    // Step 2: Resolve tasa_oficial (BCB oficial → DolarApi oficial)
    var tasaOficial = null;
    var oficialSource = null;

    if (bcbOficial && bcbOficial.valor) {
      tasaOficial = bcbOficial.valor;
      oficialSource = 'bcb.cucu.bo/oficial';
    } else if (dolarApi && dolarApi.oficial && dolarApi.oficial.venta) {
      tasaOficial = dolarApi.oficial.venta;
      oficialSource = 'bo.dolarapi.com/oficial';
    }

    if (!tasaOficial) {
      stats.error_count++;
      stats.errors.push({
        phase: 'resolve_oficial',
        error: 'No oficial rate available from any source',
        timestamp: new Date().toISOString(),
      });
    }

    // Step 3: Resolve tasa_paralelo (DolarApi Binance → BCB referencial)
    var tasaParalelo = null;
    var paraleloSource = null;

    if (dolarApi && dolarApi.binance && dolarApi.binance.venta) {
      tasaParalelo = dolarApi.binance.venta;
      paraleloSource = 'bo.dolarapi.com/binance';
    } else if (bcbReferencial && bcbReferencial.venta) {
      tasaParalelo = bcbReferencial.venta;
      paraleloSource = 'bcb.cucu.bo/referencial';
    }

    if (!tasaParalelo) {
      stats.error_count++;
      stats.errors.push({
        phase: 'resolve_paralelo',
        error: 'No paralelo rate available from any source',
        timestamp: new Date().toISOString(),
      });
    }

    // Step 4: Bail if both rates are missing
    if (!tasaOficial && !tasaParalelo) {
      stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
      stats.records_rejected = 1;
      await writeEtlLog(stats);

      return new Response(
        JSON.stringify({
          error: 'No exchange rates available from any source',
          sources_checked: ['bcb.cucu.bo', 'bo.dolarapi.com'],
          stats: stats,
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 5: Build record and upsert
    var record = [{
      fecha: stats.fecha,
      pais: 'Bolivia',
      moneda: 'BOB',
      tasa_oficial: tasaOficial,
      tasa_paralelo: tasaParalelo,
      fuente: 'BCB + DolarApi',
      data_source: [oficialSource, paraleloSource].filter(Boolean).join(' + '),
      frecuencia: 'diaria',
    }];

    console.log('[EXCHANGE] Upserting: oficial=' + tasaOficial + ' paralelo=' + tasaParalelo);

    var upsertResult = await upsertExchangeRates(record[0]);

    if (upsertResult.error) {
      stats.error_count++;
      stats.errors.push({
        phase: 'upsert',
        error: JSON.stringify(upsertResult.error),
        timestamp: new Date().toISOString(),
      });
      console.error('[DB] Upsert error: ' + JSON.stringify(upsertResult.error));
    } else {
      stats.records_inserted = 1;
      console.log('[DB] Upsert successful');
    }

    // Step 6: Write ETL log
    stats.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    await writeEtlLog(stats);

    // Step 7: Return success
    return new Response(
      JSON.stringify({
        message: 'Exchange rates fetched and upserted',
        fecha: stats.fecha,
        rates: { oficial: tasaOficial, paralelo: tasaParalelo },
        sources: { oficial: oficialSource, paralelo: paraleloSource },
        upsert: upsertResult.error ? 'failed' : 'ok',
        duration_seconds: stats.duration_seconds,
        error_count: stats.error_count,
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

    console.error('[EXCHANGE] Catastrophic failure: ' + err.message);
    await writeEtlLog(stats);

    return new Response(
      JSON.stringify({ error: 'Internal error', details: err.message, stats: stats }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
