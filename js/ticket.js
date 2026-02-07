function cargarTicket() {
  const data = JSON.parse(sessionStorage.getItem('ticket'));

  if (!data) {
    document.getElementById('ticket').innerHTML =
      '<p>No hay información del pedido.</p>';
    return;
  }

  const contenedor = document.getElementById('ticket');

  contenedor.innerHTML = `
    <h1>🧾 Pedido confirmado</h1>

    <p><strong>Nombre:</strong> ${data.nombre}</p>
    <p><strong>Celular:</strong> ${data.telefono}</p>
    <p><strong>Hora:</strong> ${data.hora}</p>
    <p><strong>Fecha:</strong> ${data.fecha}</p>

    <hr>

    <ul>
      ${data.items.map(item => `
        <li>
          ${item.tipo} ${item.nombre || ''} 
          ${item.detalle ? '(' + item.detalle + ')' : ''}
          — $${item.precio}
        </li>
      `).join('')}
    </ul>

    <div class="total">Total: $${data.total}</div>

    <button onclick="volverMenu()">
      Volver al menú
    </button>
  `;
}

function volverMenu() {
  sessionStorage.removeItem('ticket');
  window.location.href = 'index.html';
}

cargarTicket();
