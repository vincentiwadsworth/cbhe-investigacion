// edge-functions/fetch-oilpriceapi.ts
import { createClient } from 'npm:@insforge/sdk';

const client = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDkxODV9.Aqj8349qhCh9XTO-vx8qFwkYPVcvJRBAZaOgr7zPqXM'
});

export default async function fetchOilPriceAPI(req: Request) {
  try {
    // Fetch WTI
    const wtiResponse = await fetch(
      'https://api.oilpriceapi.com/v1/prices/historical?by_code=WTI_USD&interval=monthly'
    );
    const wtiData = await wtiResponse.json();

    // Fetch Brent
    const brentResponse = await fetch(
      'https://api.oilpriceapi.com/v1/prices/historical?by_code=BRN&interval=monthly'
    );
    const brentData = await brentResponse.json();

    // Transformar a formato unificado
    const prices = [];

    for (const wti of wtiData.data) {
      prices.push({
        fecha: new Date(wti.date).toISOString().split('T')[0],
        tipo: 'WTI',
        precio_usd: parseFloat(wti.close),
        fuente: 'OilPriceAPI'
      });
    }

    for (const brent of brentData.data) {
      prices.push({
        fecha: new Date(brent.date).toISOString().split('T')[0],
        tipo: 'BRENT_CRUDE',
        precio_usd: parseFloat(brent.close),
        fuente: 'OilPriceAPI'
      });
    }

    // Upsert a PostgreSQL
    const { error } = await client
      .database
      .from('crude_benchmarks')
      .upsert(prices, { onConflict: 'fecha,tipo' });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ inserted: prices.length }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching OilPriceAPI:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}