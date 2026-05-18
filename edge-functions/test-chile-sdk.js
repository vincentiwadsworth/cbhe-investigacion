import { createClient } from 'npm:@insforge/sdk';

var client = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDg3MDJ9.OVJRrr0XkJPfkP7ZU4TUJae1He6JIjCE73ixMux0VhA'
});

function validate(record) {
  if (!record.fecha) return { valid: false, reason: 'null fecha' };
  if (!record.producto) return { valid: false, reason: 'null producto' };
  return { valid: true, reason: 'ok' };
}

export default async function importChile(req) {
  return new Response(JSON.stringify({ message: 'chile with sdk', ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}