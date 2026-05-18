// edge-functions/fetch-argentina-api.ts
import { createClient } from 'npm:@insforge/sdk';

const client = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDkxODV9.Aqj8349qhCh9XTO-vx8qFwkYPVcvJRBAZaOgr7zPqXM'
});

const ARS_TO_USD = 0.0011; // Tipo de cambio

export default async function fetchArgentinaAPI(req: Request) {
  try {
    // Simulación de CSV parsing - en producción reemplazar con descarga real
    const mockCSV = `producto,precio
Gasolina,980
Diésel,920
Premium,1050`;

    const lines = mockCSV.split('\n');
    const prices = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < 2) continue;

      const precioARS = parseFloat(values[1]);
      const producto = values[0];

      prices.push({
        fecha: new Date().toISOString().split('T')[0],
        pais: 'Argentina',
        producto: producto,
        precio_local: precioARS,
        precio_usd: precioARS * ARS_TO_USD,
        moneda: 'ARS',
        fuente: 'GobEnergy'
      });
    }

    const { error } = await client
      .database
      .from('fuel_prices_regional')
      .upsert(prices, { onConflict: 'fecha,pais,producto' });

    if (error) throw error;

    return new Response(
      JSON.stringify({ inserted: prices.length }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}