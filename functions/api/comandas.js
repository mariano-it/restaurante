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

  try {
    // =====================
    // POST → guardar comanda
    // =====================
    if (request.method === 'POST') {
      const data = await request.json();

      const { results } = await env.DB
        .prepare(`SELECT MAX(numero) as ultimo FROM comandas`)
        .all();

      const ultimoNumero = results[0]?.ultimo || 0;
      const nuevoNumero = ultimoNumero + 1;

      await env.DB.prepare(`
      INSERT INTO comandas (numero, nombre, telefono, hora, fecha, items, total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        nuevoNumero,
        data.nombre,
        data.telefono,
        data.hora,
        data.fecha,
      JSON.stringify(data.items),
        data.total
      ).run();


      return new Response(
        JSON.stringify({
          success: true,
          numero: nuevoNumero
        }),
        { headers }
      );
    }

    // =====================
    // GET → leer comandas
    // =====================
    if (request.method === 'GET') {
      const { results } = await env.DB
        .prepare(`SELECT * FROM comandas ORDER BY numero DESC`)
        .all();

      return new Response(JSON.stringify(results), { headers });
    }

    return new Response(
      JSON.stringify({ error: 'Método no permitido' }),
      { status: 405, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
}

