# 🍽️ Sistema de Pedidos y Comandas – Restaurante

Sistema web ligero para toma de pedidos y gestión de comandas en restaurante, diseñado para funcionar **sin backend**, utilizando únicamente **HTML, CSS y JavaScript** con almacenamiento local (`localStorage`).

El proyecto está pensado para uso real en punto de venta y cocina, con actualización en tiempo real entre pestañas/dispositivos del mismo navegador.

---

## ✨ Características principales

- 📋 **Menú interactivo** para clientes
- 🛒 **Carrito de pedidos**
- 🍽️ **Generación automática de comandas**
- 🔢 **Número de orden incremental**
- 📅 **Reinicio automático de órdenes cada día**
- 🔄 **Actualización en tiempo real** en la página de comandas
- 📥 **Descarga de ventas del día** en formato JSON
- 🎨 **Soporte de temas por restaurante**
- ⚡ 100% **frontend** (sin servidores, sin bases de datos)
- 🔐 **JavaScript ofuscado** para proteger la lógica

---

## 🗂️ Estructura del proyecto

```txt
/
├── menu.html            # Menú y toma de pedidos
├── comandas.html        # Vista de cocina (comandas)
│
├── css/
│   ├── base.css         # Variables globales
│   ├── menu.css         # Estilos del menú
│   ├── comandas.css    # Estilos de comandas
│   └── theme.css        # Temas por restaurante
│
├── js/
│   ├── menu.js          # Lógica del menú y pedidos 
│   └── comandas.js      # Lógica de comandas 
│
├── assets/
│   └── notify.wav       # Sonido de nueva comanda
│
└── README.md
