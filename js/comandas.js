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

  if (!Array.isArray(comandas) || comandas.length === 0) {
    contenedor.innerHTML = '<p>No hay comandas registradas</p>';
    return;
  }

  // 👉 las más recientes arriba
  comandas.reverse();

  comandas.forEach(comanda => {
    const div = document.createElement('div');
    div.className = 'comanda';

    const items = comanda.items
      ? JSON.parse(comanda.items)
      : [];

    div.innerHTML = `
      <h2>🍽️ ${comanda.nombre}</h2>
      <small>
        📞 ${comanda.telefono}<br>
        ⏰ Para las ${comanda.hora}<br>
        📅 ${comanda.fecha}
      </small>

      ${
        items.length
          ? `<ul>
              ${items.map(item => `
                <li>
                  ${item.tipo} ${item.nombre || ''}
                  ${item.detalle ? `(${item.detalle})` : ''}
                  — $${item.precio}
                </li>
              `).join('')}
            </ul>`
          : '<p><em>Sin productos</em></p>'
      }

      <strong>Total: $${comanda.total || 0}</strong>

      ${
        comanda.comentario
          ? `<p><strong>📝 Comentario:</strong> ${comanda.comentario}</p>`
          : ''
      }
    `;

    contenedor.appendChild(div);
  });
}

/* ========= AUTO-REFRESH ========= */
setInterval(renderComandas, 5000);

/* ========= INIT ========= */
renderComandas();
