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

    /* ===============================
       GET → LEER COMANDAS
    =============================== */

    if (request.method === 'GET') {

      const { results } = await env.DB
        .prepare(`
          SELECT * FROM comandas
          ORDER BY numero DESC, creado_en DESC
        `)
        .all();

      return new Response(JSON.stringify(results), { headers });

    }


    /* ===============================
       POST → GUARDAR
    =============================== */

    if (request.method === 'POST') {

      const data = await request.json();


      /* ===== FEEDBACK ===== */

if (data.tipo === 'feedback') {

  const { results } = await env.DB
    .prepare(`SELECT MAX(numero) as ultimo FROM comandas`)
    .all();

  const nuevoNumero = (results[0]?.ultimo || 0) + 1;

  await env.DB.prepare(`
    INSERT INTO comandas (
      numero,
      fecha,
      items,
      total,
      comentario,
      nombre,
      telefono,
      hora
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    nuevoNumero,        // ✅ YA NO ES NULL
    data.fecha,
    '[]',
    0,
    data.comentario,
    'Comentario',
    '',
    ''
  ).run();

  return new Response(JSON.stringify({
    success: true,
    numero: nuevoNumero
  }), { headers });

}



      /* ===== PEDIDO NORMAL ===== */

      const { results } = await env.DB
        .prepare(`SELECT MAX(numero) as ultimo FROM comandas`)
        .all();

      const nuevoNumero = (results[0]?.ultimo || 0) + 1;

      await env.DB.prepare(`
        INSERT INTO comandas (
          numero,
          fecha,
          items,
          total,
          comentario,
          nombre,
          telefono,
          hora
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        nuevoNumero,
        data.fecha,
        JSON.stringify(data.items),
        data.total,
        data.comentario || null,
        data.nombre,
        data.telefono,
        data.hora
      ).run();

      return new Response(JSON.stringify({
        success: true,
        numero: nuevoNumero
      }), { headers });

    }


  } catch (error) {

    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers
    });

  }

}

