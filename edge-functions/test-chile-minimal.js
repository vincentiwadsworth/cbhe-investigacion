module.exports = async function importChile(req) {
  return new Response(JSON.stringify({ message: 'chile test', ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};