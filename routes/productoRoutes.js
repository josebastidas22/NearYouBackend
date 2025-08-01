const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// 🧾 GET /api/productos — Obtener todos los productos
router.get('/', productoController.obtenerTodos);

// 🧾 GET /api/productos/tienda/:tiendaId — Obtener productos por tienda
router.get('/tienda/:tiendaId', productoController.obtenerPorTienda);

// 🧾 GET /api/productos/buscar?nombre=... — Buscar productos por nombre
router.get('/buscar', productoController.buscarPorNombre);

// 🧾 POST /api/productos — Crear nuevo producto
router.post('/', productoController.crearProducto);

module.exports = router;
