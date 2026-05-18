module.exports = async function importChile(req) {
  var baseUrl = 'https://vmi3hxr8.us-east.insforge.app';
  var anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDg3MDJ9.OVJRrr0XkJPfkP7ZU4TUJae1He6JIjCE73ixMux0VhA';
  var client = (await import('npm:@insforge/sdk')).createClient({ baseUrl: baseUrl, anonKey: anonKey });
  var body = await req.json();
  var records = Array.isArray(body) ? body : (body.records || []);
  return new Response(JSON.stringify({ message: 'ok', count: records.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};