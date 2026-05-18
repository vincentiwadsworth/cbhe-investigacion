import { createClient } from 'npm:@insforge/sdk';

const client = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDg3MDJ9.OVJRrr0XkJPfkP7ZU4TUJae1He6JIjCE73ixMux0VhA'
});

const MXN_TO_USD = 0.059; // Tipo de cambio

export default async function fetchMexicoAPI(req) {
  try {
    // Simulación de API - en producción reemplazar con endpoint real
    const mockData = [
      { producto: 'Magna', precio: 22.5 },
      { producto: 'Premium', precio: 25.8 },
      { producto: 'Diésel', precio: 23.2 }
    ];

    const prices = mockData.map((item) => ({
      fecha: new Date().toISOString().split('T')[0],
      pais: 'México',
      producto: item.producto,
      precio_local: parseFloat(item.precio),
      precio_usd: parseFloat(item.precio) * MXN_TO_USD,
      moneda: 'MXN',
      fuente: 'PetroIntelligence'
    }));

    const { error } = await client.database
      .from('fuel_prices_regional')
      .upsert(prices, { onConflict: 'fecha,pais,producto' });

    if (error) throw error;

    return new Response(
      JSON.stringify({ inserted: prices.length, prices: prices }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching Mexico API:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}