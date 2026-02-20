let numeroOrden = parseInt(localStorage.getItem('numeroOrden')) || 1;
verificarNuevoDia();

let carrito = [];
let total = 0;

function renderCarrito() {
  const contenedor = document.getElementById('carrito-items');
  const totalEl = document.getElementById('total');

  if (!contenedor || !totalEl) return;

  contenedor.innerHTML = '';
  total = 0;

  carrito.forEach(item => {
    const li = document.createElement('li');
    li.textContent =
      `${item.tipo} ${item.nombre || ''}${item.detalle ? ' (' + item.detalle + ')' : ''} — $${item.precio}`;
    contenedor.appendChild(li);
    total += item.precio;
  });

  totalEl.textContent = total;
}


function agregarAlCarrito(item) {
  carrito.push(item);
  renderCarrito();
}

async function inicializarNumeroOrden() {
  const res = await fetch('/api/comandas');
  const data = await res.json();

  // iniciar el contador con la última orden + 1
  numeroOrden = (data.ultimaOrden || 0) + 1;
  localStorage.setItem('numeroOrden', numeroOrden);
}

inicializarNumeroOrden();


let cafeTemp = null;

function seleccionarCafeTemp(temp) {
  cafeTemp = temp;
}

function agregarCafe(nombre, precio) {
  if (!cafeTemp) {
    alert('Selecciona si tu café es frío o caliente');
    return;
  }

  agregarAlCarrito({
    tipo: 'Café',
    nombre: nombre,
    detalle: cafeTemp,
    precio: precio
  });

  cafeTemp = null;
}

function agregarCroissant(nombre, precio, ingredientes) {
  agregarAlCarrito({
    nombre,
    precio,
    ingredientes,
    categoria: 'Croissants'
  });
}

function mostrarSandwichTipo(id) {
  document.getElementById('sandwich-salados').style.display = 'none';
  document.getElementById('sandwich-dulces').style.display = 'none';

  document.getElementById(id).style.display = 'block';
}



let teavanaTemp = null;
function seleccionarTeavanaTemp(temp) {
  teavanaTemp = temp;
}

function agregarTeavana(nombre, precio) {
  if (!teavanaTemp) {
    alert('Selecciona si tu bebida es fría o caliente');
    return;
  }

  agregarAlCarrito({
    tipo: 'Teavana',
    nombre: nombre,
    detalle: teavanaTemp,
    precio: precio
  });

  teavanaTemp = null;
}


let endulzanteSeleccionado = null;
function seleccionarEndulzante(tipo) {
  endulzanteSeleccionado = tipo;
}

function agregarSmoothie(nombre, precio) {
  if (!endulzanteSeleccionado) {
    alert('Selecciona un endulzante');
    return;
  }

  agregarAlCarrito({
    tipo: 'Smoothie',
    nombre: nombre,
    detalle: endulzanteSeleccionado,
    precio: precio
  });

  endulzanteSeleccionado = null;
}

let aguaAzucar = null;

function seleccionarAzucarAgua(tipo) {
  aguaAzucar = tipo;
}

function agregarAgua(nombre, precio) {
  if (!aguaAzucar) {
    alert('Selecciona si tu agua es con o sin azúcar');
    return;
  }

  agregarAlCarrito({
    tipo: 'Agua',
    nombre: nombre,
    detalle: aguaAzucar,
    precio: precio
  });

  aguaAzucar = null;
}

function agregarRefresco(nombre, precio) {

  agregarAlCarrito({
    tipo: 'Refresco',
    nombre: nombre,
    precio: precio
  });

}


async function enviarComanda() {
  const nombre = document.getElementById('nombre-cliente').value.trim();
  const telefono = document.getElementById('telefono-cliente').value.trim();
  const hora = document.getElementById('hora-pedido').value;

  if (!nombre || !telefono || !hora) {
    alert('Por favor completa Nombre, Celular y Hora del pedido');
    return;
  }

  if (!/^\d{10}$/.test(telefono)) {
    alert('Ingresa un número de celular válido (10 dígitos)');
    return;
  }

  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

const comentario = document.getElementById('comentario')?.value.trim() || null;

const nuevaComanda = {
  nombre,
  telefono,
  hora,
  fecha: new Date().toLocaleString(),
  items: carrito,
  total,
  comentario // ← ESTA LÍNEA ES LA CLAVE
};

  const res = await fetch('/api/comandas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaComanda)
  });

  const data = await res.json();

  if (!data.numero) {
    alert('Error al generar el ticket');
    return;
  }

  // limpiar UI
  carrito = [];
  renderCarrito();

  document.getElementById('nombre-cliente').value = '';
  document.getElementById('telefono-cliente').value = '';
  document.getElementById('hora-pedido').value = '';

  // 👉 REDIRECCIÓN CORRECTA
  window.location.href = `/ticket.html?orden=${data.numero}`;
}

// 🔗 Link de pago (pendiente)
const LINK_PAGO = ''; // ← aquí va el link cuando lo manden

function pagarPedido() {
  if (!LINK_PAGO) {
    alert('El pago se realiza en efectivo al recoger tu pedido 💵');
    return;
  }

  window.open(LINK_PAGO, '_blank');
}

async function enviarComentarioLibre() {

  const comentario = document.getElementById('comentario')?.value.trim();

  if (!comentario) {
    alert('Escribe un comentario primero 🙂');
    return;
  }

  const feedback = {
    tipo: 'feedback',
    comentario: comentario,
    fecha: new Date().toLocaleString(),
    total: 0,
    items: []
  };

  try {

    const res = await fetch('/api/comandas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedback)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      alert('Error al enviar comentario');
      return;
    }

    document.getElementById('comentario').value = '';

    alert('¡Gracias por tu comentario! 💙');

  } catch (error) {

    console.error(error);
    alert('Error de conexión');

  }

}


// mostrar menu
  function mostrarMenu(restaurante) {
    const ventanita = document.getElementById('menu-ventanita');
    const rengodeli = document.getElementById('menu-rengodeli');

    if (!ventanita || !rengodeli) {
      console.error('No se encontraron los menús');
      return;
    }

    ventanita.style.display = 'none';
    rengodeli.style.display = 'none';

    if (restaurante === 'ventanita') {
      ventanita.style.display = 'block';
    }

    if (restaurante === 'rengodeli') {
      rengodeli.style.display = 'block';
    }
  }

function abrirRestaurante(nombre, boton) {
  // quitar estado activo de todos
  document.querySelectorAll('.boton-restaurante')
    .forEach(b => b.classList.remove('activo'));

  // activar el actual (con animación)
  boton.classList.add('activo');

  // cambiar tema
  document.body.setAttribute('data-theme', nombre);

  // ocultar pantallas
  document.getElementById('inicio').style.display = 'none';
  document.getElementById('menu-ventanita').style.display = 'none';
  document.getElementById('menu-rengodeli').style.display = 'none';

  // mostrar el menú correspondiente
  document.getElementById('menu-' + nombre).style.display = 'block';
}


//Rengo Deli
function toggleSeccionRengodeli(id) {
  const seccion = document.getElementById(id);
  const estaAbierta = seccion.style.display === 'block';

  // Alternar sección principal
  seccion.style.display = estaAbierta ? 'none' : 'block';

  // 👇 SI se cierra "antojo", cerrar todo lo interno
  if (id === 'antojo' && estaAbierta) {
    const opciones = ['yakimeshi','tacos','empanadas','chilaquiles','salbutes'];
    opciones.forEach(o => {
      const el = document.getElementById(o);
      if (el) el.style.display = 'none';
    });

    // también cerrar guisos
    ['guisos-clasicos','guisos-tradicionales','guisos-premium'].forEach(g => {
      const el = document.getElementById(g);
      if (el) el.style.display = 'none';
    });
  }
}

  function toggleExtra(nombre, precio, checkbox) {
  if (checkbox.checked) {
    agregarAlCarrito({
      tipo: 'extra',
      nombre: nombre,
      precio: precio
    });
  } else {
  carrito = carrito.filter(
    item => !(item.tipo === 'extra' && item.nombre === nombre)
  );
  renderCarrito();
  }
}

function mostrarAntojo(tipo) {
  const opciones = ['yakimeshi','tacos','empanadas','chilaquiles','salbutes'];
  opciones.forEach(o => {
    document.getElementById(o).style.display = 'none';
  });
  document.getElementById(tipo).style.display = 'block';
}

function activarPromoTacos(activar) {
  document.getElementById('promo-tacos').style.display = activar ? 'block' : 'none';
}

function seleccionarCategoriaAntojo(antojo, categoria, precio) {
  // CASO NATURAL → se agrega directo
  if (categoria === 'natural') {
    agregarAlCarrito({
      tipo: antojo,
      nombre: 'Natural',
      detalle: 'Natural',
      precio: precio
    });
    return;
  }

  // CASO NORMAL (con guiso)
  seleccionActual.antojo = antojo;
  seleccionActual.categoria = categoria;
  seleccionActual.precio = precio;
  seleccionActual.guiso = null;

  seleccionarCategoria(categoria);
}

  // cerrar guisos después de elegir
  ['guisos-clasicos','guisos-tradicionales','guisos-premium'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });



  // 👉 CASO NORMAL
function seleccionarGuiso(nombre) {
  seleccionActual.guiso = nombre;
}

function agregarSeleccionActualAlCarrito() {
  agregarAlCarrito({
    tipo: seleccionActual.antojo,
    categoria: seleccionActual.categoria,
    guiso: seleccionActual.guiso,
    precio: seleccionActual.precio
  });
}

  seleccionActual = {
    antojo: null,
    categoria: null,
    guiso: null,
    precio: 0
  };

      function toggleAgua(nombre,precio, checkbox) {
    if (checkbox.checked) {
      agregarAlCarrito({
        tipo: 'agua',
        nombre: nombre,
        precio: precio
      });
    } else {
      carrito = carrito.filter(
        item => !(item.tipo === 'agua' && item.nombre === nombre)
      );
      renderCarrito();
    }
  }

  function seleccionarCategoria(categoria) {
  const bloques = [
    'guisos-clasicos',
    'guisos-tradicionales',
    'guisos-premium'
  ];

  bloques.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  if (categoria !== 'natural') {
    document.getElementById('guisos-' + categoria).style.display = 'block';
  }
}

let promoTacos = {
  activa: false,
  tipo: null,
  precio: 0
};

function seleccionarGuisoFinal(nombre) {
  agregarAlCarrito({
    tipo: seleccionActual.antojo,
    nombre: nombre,
    detalle: seleccionActual.categoria,
    precio: seleccionActual.precio
  });

  // reset
  seleccionActual = {
    antojo: null,
    categoria: null,
    guiso: null,
    precio: 0
  };

  // cerrar guisos
  ['guisos-clasicos','guisos-tradicionales','guisos-premium'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}


function aplicarPromoTacos(tipo) {
  promoTacos.activa = true;

  if (tipo === 'clasicos') {
    promoTacos.tipo = 'Clásicos';
    promoTacos.precio = 50;
    seleccionarCategoria('clasicos');
  }

  if (tipo === 'tradicionales') {
    promoTacos.tipo = 'Tradicionales';
    promoTacos.precio = 60;
    seleccionarCategoria('tradicionales');
  }

  if (tipo === 'clasicos') {
    precioPromo = 50;
    descripcion = 'Promo 3 Tacos Clásicos';
  }

  if (tipo === 'tradicionales') {
    precioPromo = 60;
    descripcion = 'Promo 3 Tacos Tradicionales';
  }

  carrito.push({
    tipo: 'Tacos',
    detalle: descripcion,
    precio: precioPromo
  });
  renderCarrito();
}

function noPromoTacos() {
  // aquí el flujo normal de tacos individuales sigue igual
  alert('Selecciona tus tacos individuales');
}
/*
function toggleExtra(nombre, precio, checkbox) {
  if (checkbox.checked) {
    agregarAlCarrito({
      tipo: 'Extra',
      nombre,
      precio
    });
  } else {
    carrito = carrito.filter(
      item => !(item.tipo === 'Extra' && item.nombre === nombre)
    );
    renderCarrito();
  }
}
*/

//Ventanita deli
function toggleSeccionVentanita(id) {
  const secciones = document.querySelectorAll(
    '#menu-ventanita > div'
  );

  secciones.forEach(sec => {
    if (sec.id === id) {
      sec.style.display = 
        sec.style.display === 'none' ? 'block' : 'none';
    } else {
      sec.style.display = 'none';
    }
  });
}

function toggleExtra(nombre, precio, checkbox) {
  if (checkbox.checked) {
    agregarAlCarrito({
      tipo: 'Extra',
      nombre: nombre,
      precio: precio
    });
  } else {
    carrito = carrito.filter(
      item => !(item.tipo === 'Extra' && item.nombre === nombre)
    );
    renderCarrito();
  }
}

function fechaHoy() {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0]; // YYYY-MM-DD
}

function verificarNuevoDia() {
  const hoy = fechaHoy();
  const fechaGuardada = localStorage.getItem('fechaComandas');

  if (fechaGuardada !== hoy) {
    // Nuevo día → reset
    localStorage.setItem('fechaComandas', hoy);
    localStorage.setItem('comandas', JSON.stringify([]));
    localStorage.setItem('numeroOrden', '1');
  }
}


function volverInicio() {
  const confirmar = carrito.length === 0 || confirm(
    '¿Quieres cambiar de restaurante? El carrito actual se vaciará.'
  );

  if (!confirmar) return;

  carrito = [];
  total = 0;
  renderCarrito()

  document.querySelectorAll('.boton-restaurante')
    .forEach(b => b.classList.remove('activo'));

  document.getElementById('menu-ventanita').style.display = 'none';
  document.getElementById('menu-rengodeli').style.display = 'none';
  document.getElementById('inicio').style.display = 'block';
}



