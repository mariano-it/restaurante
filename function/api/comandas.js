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

    await env.DB.prepare(`
      INSERT INTO comandas (numero, fecha, items, total)
      VALUES (?, ?, ?, ?)
    `).bind(
      data.numero,
      data.fecha,
      JSON.stringify(data.items),
      data.total
    ).run();

    return new Response(
      JSON.stringify({ ok: true }),
      { headers }
    );
  }

  // GET → leer comandas
  if (request.method === 'GET') {
    const { results } = await env.DB
      .prepare(`SELECT * FROM comandas ORDER BY id DESC`)
      .all();

    return new Response(
      JSON.stringify(results),
      { headers }
    );
  }

  return new Response('Method not allowed', { status: 405, headers });
}
