export async function onRequest({ request, env }) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // POST → guardar comanda
if (request.method === 'POST') {
  const data = await request.json();

  // Obtener el último número de orden registrado
  const { results } = await env.DB
    .prepare(`SELECT MAX(numero) as ultimo FROM comandas`)
    .all();

  const ultimoNumero = results[0]?.ultimo || 0;
  const nuevoNumero = ultimoNumero + 1; // nuevo número consecutivo

  await env.DB.prepare(`
    INSERT INTO comandas (numero, fecha, items, total)
    VALUES (?, ?, ?, ?)
  `).bind(
    nuevoNumero,
    data.fecha,
    JSON.stringify(data.items),
    data.total
  ).run();

  return new Response(
    JSON.stringify({ ok: true, numero: nuevoNumero }),
    { headers }
  );
}

  // GET → leer comandas
if (request.method === 'GET') {
  const { results } = await env.DB
    .prepare(`SELECT * FROM comandas ORDER BY numero DESC`)
    .all();

  return new Response(
    JSON.stringify(results),
    { headers }
  );
}}
