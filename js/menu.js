let numeroOrden = parseInt(localStorage.getItem('numeroOrden')) || 1;
verificarNuevoDia();
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


function renderCarrito() {
  const contenedor = document.getElementById('carrito');
  const totalSpan = document.getElementById('total');

  contenedor.innerHTML = '';
  total = 0;

  carrito.forEach(item => {
    const div = document.createElement('div');
    div.textContent =
      `${item.tipo} ${item.nombre || ''}${item.detalle ? ' (' + item.detalle + ')' : ''} — $${item.precio}`;
    contenedor.appendChild(div);
    total += item.precio;
  });

  totalSpan.textContent = total;
}

async function enviarComanda() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  const nuevaComanda = {
    fecha: new Date().toLocaleString(),
    items: carrito,
    total: total
  };

  const res = await fetch('/api/comandas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaComanda)
  });

  const { numero } = await res.json(); // <-- número asignado por backend

  carrito = [];
  renderCarrito();

  alert(`Pedido enviado. Orden #${numero}`);
}


/*  alert(`🍽️ Tu número de orden es ${orden.numero}. 
Ten listo tu método de pago cuando lo llamen.`);*/

let carrito = [];
let total = 0;

let seleccionActual = {
  antojo: null,
  categoria: null,
  guiso: null,
  precio: 0
};

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
  renderCarrito();

  // quitar estado activo → vuelve a negro con transición
  document.querySelectorAll('.boton-restaurante')
    .forEach(b => b.classList.remove('activo'));

  // ocultar menús
  document.getElementById('menu-ventanita').style.display = 'none';
  document.getElementById('menu-rengodeli').style.display = 'none';

  // mostrar inicio
  document.getElementById('inicio').style.display = 'block';
}



