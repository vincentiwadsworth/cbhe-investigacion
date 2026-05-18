// edge-functions/fetch-brazil-api.ts
import { createClient } from 'npm:@insforge/sdk';

const client = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDkxODV9.Aqj8349qhCh9XTO-vx8qFwkYPVcvJRBAZaOgr7zPqXM'
});

const BRL_TO_USD = 0.19; // Tipo de cambio

export default async function fetchBrazilAPI(req: Request) {
  try {
    // Simulación de API - en producción reemplazar con endpoint real
    const mockData = [
      { producto: 'Gasolina Comum', precio: 5.85 },
      { producto: 'Gasolina Aditivada', precio: 6.25 },
      { producto: 'Diésel S10', precio: 5.92 }
    ];

    const prices = mockData.map((item: any) => ({
      fecha: new Date().toISOString().split('T')[0],
      pais: 'Brasil',
      producto: item.producto,
      precio_local: parseFloat(item.precio),
      precio_usd: parseFloat(item.precio) * BRL_TO_USD,
      moneda: 'BRL',
      fuente: 'Argus'
    }));

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