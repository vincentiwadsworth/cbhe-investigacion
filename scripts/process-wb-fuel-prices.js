/**
 * Process World Bank Global Fuel Prices Database Excel file.
 * Extracts monthly fuel prices for 9 target Latin American countries.
 * Outputs JSON ready for InsForge bulk-upsert into fuel_prices_regional.
 *
 * Usage: node scripts/process-wb-fuel-prices.js
 * Output: tmp/wb_fuel_prices_regional.json (array of records)
 *
 * World Bank Data License: Open Database License (ODbL)
 * Dataset URL: https://datacatalog.worldbank.org/search/dataset/0066829
 */

var XLSX = require('xlsx');
var fs = require('fs');
var path = require('path');

// ── Configuration ────────────────────────────────────────────────────────────
var INPUT_FILE = path.join(__dirname, '..', 'tmp', 'wb_global_fuel_prices.xlsx');
var OUTPUT_FILE = path.join(__dirname, '..', 'tmp', 'wb_fuel_prices_regional.json');

// Target countries (WB name → Dashboard name)
var TARGET_COUNTRIES = {
  'Mexico': 'México',
  'Colombia': 'Colombia',
  'Ecuador': 'Ecuador',
  'Peru': 'Perú',
  'Chile': 'Chile',
  'Paraguay': 'Paraguay',
  'Argentina': 'Argentina',
  'Brazil': 'Brasil',
  'Venezuela, RB': 'Venezuela',
};

// Product sheet → Dashboard product name
var PRODUCT_SHEET_MAP = {
  'Reg Gasoline (below RON 95) USD': 'Gasolina Regular',
  'Premium Gasoline RON95or ab USD': 'Gasolina Premium',
  'Diesel USD': 'Diésel',
  'Kerosene USD': 'Kerosene',
};

// LCU sheets for local prices
var LCU_SHEET_MAP = {
  'Reg Gasoline (below RON 95) USD': 'Regular Gasoline (below RON 95)',
  'Premium Gasoline RON95or ab USD': 'Premium Gasoline RON95 or above',
  'Diesel USD': 'Diesel',
  'Kerosene USD': 'Kerosene',
};

// Row name patterns for selecting the best representative row per country+product
// Priority: "Country Average" > capital city > first match
var ROW_PREFERENCE = {
  // ── Argentina ──
  'Argentina|Gasolina Regular': 'Nafta (common)',
  'Argentina|Gasolina Premium': 'Nafta (premium)',
  'Argentina|Diésel': 'Diesel - Gas Oil Grade 2',
  'Argentina|Kerosene': 'Kerosene',
  // ── Brazil ──
  'Brazil|Gasolina Regular': 'Country Average',
  'Brazil|Gasolina Premium': 'additiva - premium.*Country Average',
  'Brazil|Diésel': 'Diesel 10 ultra-low.*Country Average',
  'Brazil|Kerosene': '', // Not expected
  // ── Chile ──
  'Chile|Gasolina Regular': 'Gasoline 93',
  'Chile|Gasolina Premium': 'Gasoline 95',
  'Chile|Diésel': 'Metropolitan',
  'Chile|Kerosene': 'Metropolitan',
  // ── Colombia ──
  'Colombia|Gasolina Premium': 'MC Gasoline.*Bogota',
  'Colombia|Diésel': 'diesel ACPM.*Bogota',
  // ── Ecuador ──
  'Ecuador|Gasolina Regular': 'Extra Gasoline',
  'Ecuador|Gasolina Premium': 'Super Gasoline',
  'Ecuador|Diésel': 'Diesel',
  // ── Mexico ──
  'Mexico|Gasolina Regular': 'Mexico Average',
  'Mexico|Gasolina Premium': 'Mexico Average',
  'Mexico|Diésel': 'Mexico Average',
  // ── Peru ──
  'Peru|Gasolina Regular': '84 Plus',
  'Peru|Gasolina Premium': '95 Plus',
  'Peru|Diésel': 'DIESEL B5 UV',
  // ── Venezuela ──
  'Venezuela|Gasolina Regular': 'subsidized',
  'Venezuela|Gasolina Premium': 'unsubsidized',
  'Venezuela|Diésel': 'Diesel',
};

// Validation bounds (USD/liter)
var VALIDATION_BOUNDS = {
  'Gasolina Regular': { min: 0.01, max: 3.00 },
  'Gasolina Premium': { min: 0.01, max: 3.00 },
  'Diésel': { min: 0.001, max: 3.00 },
  'Kerosene': { min: 0.01, max: 3.00 },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert Excel serial date number to ISO date string (YYYY-MM-DD).
 * Excel epoch: Jan 1, 1900 = 1 (with the Feb 29, 1900 leap year bug for dates >= 60).
 */
function excelDateToISO(serial) {
  // Excel's epoch is Dec 30, 1899 (serial 0 = Dec 30, 1899, serial 1 = Dec 31, 1899)
  // Actually serial 1 = Jan 1, 1900. But Excel has a bug: it thinks Feb 29, 1900 exists.
  // For serial >= 61, we need to subtract 1 to account for the non-existent leap day.
  var epoch = new Date(1899, 11, 30);
  var adjustedSerial = serial;
  if (serial >= 61) {
    adjustedSerial = serial - 1; // Compensate for Feb 29, 1900 bug
  }
  var msSinceEpoch = Math.round(adjustedSerial * 86400000);
  var d = new Date(epoch.getTime() + msSinceEpoch);
  
  var yyyy = d.getFullYear();
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd;
}

/**
 * Validate a record against business rules.
 * Special case: Venezuela subsidized prices are legitimate (very low).
 */
function validateRecord(record) {
  if (!record.fecha) return { valid: false, reason: 'null_fecha' };
  if (record.precio_usd === null || record.precio_usd === undefined) return { valid: false, reason: 'null_precio_usd' };
  if (isNaN(record.precio_usd)) return { valid: false, reason: 'nan_precio_usd' };

  var price = Number(record.precio_usd);
  var bounds = VALIDATION_BOUNDS[record.producto] || { min: 0.001, max: 3.00 };

  // Venezuela special case: very low subsidized prices are legitimate
  if (record.pais === 'Venezuela') {
    // Venezuela diesel can go as low as $0.001/L, gasoline ~$0.01/L
    if (price < 0.0001) return { valid: false, reason: 'venezuela_too_low' };
  } else {
    if (price < bounds.min || price > bounds.max) {
      return { valid: false, reason: 'out_of_bounds_' + price };
    }
  }

  // No future dates
  var recordDate = new Date(record.fecha);
  if (isNaN(recordDate.getTime())) return { valid: false, reason: 'invalid_date' };
  if (recordDate > new Date()) return { valid: false, reason: 'future_date' };

  return { valid: true };
}

/**
 * Select the best rows for a country+product combination.
 */
function selectBestRows(rows, country, producto) {
  if (rows.length === 0) return [];
  if (rows.length === 1) return rows;

  var key = country + '|' + producto;
  var preference = ROW_PREFERENCE[key] || '';

  // First priority: "Country Average" or "Mexico Average"
  for (var i = 0; i < rows.length; i++) {
    var name = rows[i][0].toString();
    if (name.indexOf('Country Average') !== -1 || name.indexOf('Mexico Average') !== -1) {
      return [rows[i]];
    }
  }

  // Second priority: match preference pattern
  if (preference) {
    for (var j = 0; j < rows.length; j++) {
      var name2 = rows[j][0].toString();
      if (preference.startsWith('additiva') || preference.startsWith('Diesel') || preference.startsWith('diesel') || preference.startsWith('MC')) {
        // Regex match
        var regex = new RegExp(preference, 'i');
        if (regex.test(name2)) return [rows[j]];
      } else if (name2.indexOf(preference) !== -1) {
        return [rows[j]];
      }
    }
  }

  // Third: prefer capital city indicators
  for (var k = 0; k < rows.length; k++) {
    var name3 = rows[k][0].toString();
    if (name3.indexOf('Bogota') !== -1 || name3.indexOf('Lima') !== -1 || 
        name3.indexOf('Metropolitan') !== -1 || name3.indexOf('Mexico City') !== -1 ||
        name3.indexOf('Distrito Federal') !== -1) {
      return [rows[k]];
    }
  }

  // Fallback: return first row
  return [rows[0]];
}

/**
 * Extract records from a USD product sheet.
 */
function extractRecords(usdSheetName, producto) {
  var wb = XLSX.readFile(INPUT_FILE);
  var usdSheet = wb.Sheets[usdSheetName];
  if (!usdSheet) {
    console.log('[SKIP] Sheet not found: ' + usdSheetName);
    return [];
  }

  var data = XLSX.utils.sheet_to_json(usdSheet, { header: 1, defval: null });
  var header = data[0];

  // Build date column index → ISO date mapping
  var dateColumns = {};
  for (var c = 6; c < header.length; c++) {
    if (typeof header[c] === 'number') {
      dateColumns[c] = excelDateToISO(header[c]);
    }
  }

  // Build currency unit column index
  var lcuSheetName = LCU_SHEET_MAP[usdSheetName];
  if (!lcuSheetName) return [];
  var lcuSheet = wb.Sheets[lcuSheetName];
  if (!lcuSheet) {
    console.log('[WARN] LCU sheet not found: ' + lcuSheetName);
  }
  var lcuData = lcuSheet ? XLSX.utils.sheet_to_json(lcuSheet, { header: 1, defval: null }) : null;
  var lcuHeader = lcuData ? lcuData[0] : null;

  // Group rows by country for the current sheet
  var countryRows = {};
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    if (!row || !row[1]) continue;
    var countryName = row[1].toString().trim();
    
    // Also check Venezuela variations
    var mappedCountry = countryName;
    if (countryName.indexOf('Venezuela') !== -1) {
      mappedCountry = 'Venezuela, RB';
    }

    if (!TARGET_COUNTRIES[mappedCountry]) continue;

    if (!countryRows[mappedCountry]) {
      countryRows[mappedCountry] = [];
    }
    countryRows[mappedCountry].push(row);
  }

  var records = [];

  // For each target country, select best rows and extract values
  var countryKeys = Object.keys(countryRows);
  for (var ck = 0; ck < countryKeys.length; ck++) {
    var country = countryKeys[ck];
    var rows = countryRows[country];
    var bestRows = selectBestRows(rows, country, producto);
    
    for (var br = 0; br < bestRows.length; br++) {
      var bestRow = bestRows[br];
      var dashboardCountry = TARGET_COUNTRIES[country] || country;

      // Find matching LCU row for local price
      var lcuRow = null;
      if (lcuData) {
        for (var lr = 1; lr < lcuData.length; lr++) {
          var lRow = lcuData[lr];
          if (lRow && lRow[1] && lRow[1].toString().trim() === country && 
              lRow[0].toString() === bestRow[0].toString()) {
            lcuRow = lRow;
            break;
          }
        }
      }

      // Extract currency unit from bestRow
      var currencyUnit = 'USD';
      var originalUnits = bestRow[3]; // e.g., "ARS/litre", "MXN/liter"
      if (originalUnits && typeof originalUnits === 'string') {
        var parts = originalUnits.split('/');
        currencyUnit = parts[0] || 'USD';
      }

      // Also check LCU row for unit
      if (lcuRow && lcuRow[3] && typeof lcuRow[3] === 'string') {
        var lcuParts = lcuRow[3].split('/');
        currencyUnit = lcuParts[0] || currencyUnit;
      }

      // Extract values for each date column
      var dateColKeys = Object.keys(dateColumns);
      for (var dc = 0; dc < dateColKeys.length; dc++) {
        var colIdx = parseInt(dateColKeys[dc]);
        var fecha = dateColumns[colIdx];
        var precio_usd = bestRow[colIdx];

        // Skip null/empty values
        if (precio_usd === null || precio_usd === undefined || precio_usd === '') continue;
        if (typeof precio_usd === 'string') {
          if (precio_usd.trim() === '' || precio_usd.trim() === '..') continue;
          precio_usd = parseFloat(precio_usd);
          if (isNaN(precio_usd)) continue;
        } else {
          precio_usd = Number(precio_usd);
          if (isNaN(precio_usd)) continue;
        }

        // Get local currency price
        var precio_local = null;
        if (lcuRow && lcuRow[colIdx] !== null && lcuRow[colIdx] !== undefined && lcuRow[colIdx] !== '') {
          var lcuVal = lcuRow[colIdx];
          if (typeof lcuVal === 'string') {
            if (lcuVal.trim() === '' || lcuVal.trim() === '..') {
              lcuVal = null;
            } else {
              lcuVal = parseFloat(lcuVal);
              if (isNaN(lcuVal)) lcuVal = null;
            }
          } else {
            lcuVal = Number(lcuVal);
            if (isNaN(lcuVal)) lcuVal = null;
          }
          precio_local = lcuVal;
        }

        // If no local price, approximate: precio_usd * exchange_rate
        // For now, set to 0 or approximate from USD
        if (precio_local === null) {
          // For countries using USD (Ecuador), local = USD
          if (currencyUnit === 'USD' || currencyUnit === 'US$') {
            precio_local = precio_usd;
          } else {
            precio_local = 0; // Will be approximate later if needed
          }
        }

        var record = {
          fecha: fecha,
          pais: dashboardCountry,
          producto: producto,
          precio_usd: parseFloat(precio_usd.toFixed(4)),
          precio_local: parseFloat(Number(precio_local).toFixed(4)),
          moneda: currencyUnit,
          fuente: 'World Bank',
          data_source: 'WB Global Fuel Prices DB',
          quality_score: 1.0,
          last_fetched_at: new Date().toISOString(),
          frecuencia: 'mensual',
        };

        // Validate
        var validation = validateRecord(record);
        if (!validation.valid) {
          continue;
        }

        records.push(record);
      }
    }
  }

  return records;
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════════╗');
console.log('║  World Bank Global Fuel Prices DB - Processor   ║');
console.log('╚══════════════════════════════════════════════════╝');
console.log('');
console.log('Input: ' + INPUT_FILE);

var allRecords = [];
var stats = {
  'Gasolina Regular': 0,
  'Gasolina Premium': 0,
  'Diésel': 0,
  'Kerosene': 0,
};

var sheetKeys = Object.keys(PRODUCT_SHEET_MAP);
for (var si = 0; si < sheetKeys.length; si++) {
  var sheetName = sheetKeys[si];
  var producto = PRODUCT_SHEET_MAP[sheetName];
  console.log('\nProcessing: ' + producto + ' (' + sheetName + ')');
  
  var records = extractRecords(sheetName, producto);
  allRecords = allRecords.concat(records);
  stats[producto] = records.length;
  console.log('  → Extracted ' + records.length + ' valid records');
}

console.log('\n═══════════════════════════════════════════');
console.log('  Summary');
console.log('═══════════════════════════════════════════');
console.log('  Gasolina Regular: ' + stats['Gasolina Regular']);
console.log('  Gasolina Premium: ' + stats['Gasolina Premium']);
console.log('  Diésel:           ' + stats['Diésel']);
console.log('  Kerosene:         ' + stats['Kerosene']);
console.log('  ──────────────────────────────');
console.log('  TOTAL:            ' + allRecords.length);
console.log('');

// Country breakdown
var countryCount = {};
for (var ri = 0; ri < allRecords.length; ri++) {
  var rec = allRecords[ri];
  if (!countryCount[rec.pais]) countryCount[rec.pais] = { count: 0, products: {} };
  countryCount[rec.pais].count++;
  if (!countryCount[rec.pais].products[rec.producto]) countryCount[rec.pais].products[rec.producto] = 0;
  countryCount[rec.pais].products[rec.producto]++;
}

console.log('  Country breakdown:');
var countryKeys2 = Object.keys(countryCount).sort();
for (var ci = 0; ci < countryKeys2.length; ci++) {
  var c = countryKeys2[ci];
  var cc = countryCount[c];
  var prodList = Object.keys(cc.products).sort().map(function(p) { return p + ': ' + cc.products[p]; }).join(', ');
  console.log('    ' + c + ': ' + cc.count + ' records (' + prodList + ')');
}

// Track missing countries
var presentCountries = new Set();
for (var ri2 = 0; ri2 < allRecords.length; ri2++) {
  presentCountries.add(allRecords[ri2].pais);
}
var expectedCountries = Object.values(TARGET_COUNTRIES);
console.log('\n  Country coverage:');
for (var ei = 0; ei < expectedCountries.length; ei++) {
  var ec = expectedCountries[ei];
  var status = presentCountries.has(ec) ? '✓' : '✗ MISSING';
  console.log('    ' + status + ' ' + ec);
}

// Save output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allRecords, null, 2));
console.log('\nOutput saved to: ' + OUTPUT_FILE);
console.log('Ready for bulk-upsert into fuel_prices_regional');
