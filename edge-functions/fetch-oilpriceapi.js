import { createClient } from 'npm:@insforge/sdk';

const client = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDg3MDJ9.OVJRrr0XkJPfkP7ZU4TUJae1He6JIjCE73ixMux0VhA'
});

export default async function fetchOilPriceAPI(req) {
  try {
    // Fetch from demo API (no authentication required)
    const response = await fetch('https://api.oilpriceapi.com/v1/demo/prices');
    const data = await response.json();

    // Transformar a formato unificado
    const prices = [];

    // Extract WTI and Brent from the demo API
    if (data && data.data && data.data.prices) {
      for (const price of data.data.prices) {
        if (price.code === 'WTI_USD') {
          prices.push({
            fecha: new Date(price.updated_at).toISOString().split('T')[0],
            tipo: 'WTI',
            precio_usd: parseFloat(price.price),
            fuente: 'OilPriceAPI'
          });
        } else if (price.code === 'BRENT_CRUDE_USD') {
          prices.push({
            fecha: new Date(price.updated_at).toISOString().split('T')[0],
            tipo: 'BRENT_CRUDE',
            precio_usd: parseFloat(price.price),
            fuente: 'OilPriceAPI'
          });
        }
      }
    }

    if (prices.length === 0) {
      throw new Error('No prices found in API response');
    }

    // Upsert a PostgreSQL
    const { error } = await client.database
      .from('crude_benchmarks')
      .upsert(prices, { onConflict: 'fecha,tipo' });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ inserted: prices.length, prices: prices }),
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