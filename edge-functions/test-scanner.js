module.exports = async function(req) {
  return new Response(JSON.stringify({ message: 'test', ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};