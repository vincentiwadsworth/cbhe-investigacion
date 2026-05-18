module.exports = async function importChile(req) {
  var body = await req.json();
  var records = Array.isArray(body) ? body : (body.records || []);
  return new Response(JSON.stringify({ message: 'ok', count: records.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};