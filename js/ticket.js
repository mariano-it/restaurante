async function cargarTicket() {

  const params = new URLSearchParams(window.location.search);
  const orden = params.get('orden');

  const res = await fetch('/api/comandas');
  const comandas = await res.json();

  const comanda = comandas.find(c => c.numero == orden);

  if (!comanda) return;

  const contenedor = document.getElementById('ticket');

  contenedor.innerHTML = `
    <h1>🧾 Pedido confirmado</h1>

    <p><strong>Orden:</strong> #${comanda.numero}</p>
    <p><strong>Nombre:</strong> ${comanda.nombre}</p>
    <p><strong>Celular:</strong> ${comanda.telefono}</p>
    <p><strong>Hora:</strong> ${comanda.hora}</p>

    <hr>

    <ul>
      ${JSON.parse(comanda.items).map(item => `
        <li>
          ${item.tipo} ${item.nombre || ''} 
          ${item.detalle ? '(' + item.detalle + ')' : ''}
          — $${item.precio}
        </li>
      `).join('')}
    </ul>

<div class="total">Total: $${ticket.total}</div>

<div style="margin-top:20px; padding:12px; background:#fff3cd; border-radius:8px;">
  <p style="margin:0; font-weight:bold;">
    📸 Toma screenshot de tu comanda
  </p>

  <p style="margin:5px 0 0 0;">
    📍 Puedes pasar recogiendo tu pedido en Rengo Deli
  </p>
</div>

<button onclick="window.location.href='index.html'">
  Volver al menú
</button>
  `;
}

cargarTicket();
