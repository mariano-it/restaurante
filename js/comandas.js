const contenedor = document.getElementById('lista-comandas');

/* ========= FETCH ========= */
async function obtenerComandas() {
  const res = await fetch('/api/comandas');

  if (!res.ok) {
    throw new Error('Error al cargar comandas');
  }

  return await res.json();
}

/* ========= RENDER ========= */
async function renderComandas() {
  let comandas;

  try {
    comandas = await obtenerComandas();
  } catch (e) {
    contenedor.innerHTML = '<p>Error al cargar comandas</p>';
    return;
  }

  contenedor.innerHTML = '';

  if (comandas.length === 0) {
    contenedor.innerHTML = '<p>No hay comandas registradas</p>';
    return;
  }

  // 🔽 ORDENAR: la más nueva arriba
  comandas.sort((a, b) => b.numero - a.numero);

  comandas.forEach(comanda => {
    const div = document.createElement('div');
    div.className = 'comanda';

    div.innerHTML = `
      <h2>🍽️ ${comanda.nombre || 'Sin nombre'}</h2>
      <small>
        📞 ${comanda.telefono || 'N/A'} <br>
        ⏰ Para las ${comanda.hora || 'N/A'} <br>
        📅 ${comanda.fecha}
      </small>

      <ul>
        ${JSON.parse(comanda.items).map(item => `
          <li>
            ${item.tipo} ${item.nombre || ''}
            ${item.detalle ? `(${item.detalle})` : ''}
            — $${item.precio}
          </li>
        `).join('')}
      </ul>

      <strong>Total: $${comanda.total}</strong>

      ${comanda.comentario 
        ? `<p><strong>📝 Comentario:</strong> ${comanda.comentario}</p>` 
        : ''}
    `;

    contenedor.appendChild(div);
  });
}

/* ========= AUTO-REFRESH ========= */
setInterval(renderComandas, 5000);

/* ========= INIT ========= */
renderComandas();
