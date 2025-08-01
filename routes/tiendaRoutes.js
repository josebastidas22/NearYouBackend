const express = require('express');
const router = express.Router();
const tiendaController = require('../controllers/tiendaController');
const { protegerRuta } = require('../middleware/authMiddleware'); // ✅ Protege rutas privadas
const Tienda = require('../models/Tienda'); // Opcional, solo si se usa directamente

// ✅ GET /api/tiendas - Listar tiendas con filtros por categoría y/o dirección
router.get('/', tiendaController.filtrarTiendas);

// ✅ GET /api/tiendas/:id - Obtener una tienda por su ID
router.get('/:id', tiendaController.obtenerTiendaPorId);

// ✅ POST /api/tiendas - Registrar una nueva tienda (protegido)
router.post('/', protegerRuta, tiendaController.crearTienda);

// ✅ PUT /api/tiendas/:id/disponibilidad - Cambiar disponibilidad de una tienda
router.put('/:id/disponibilidad', protegerRuta, async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;

    const tienda = await Tienda.findByIdAndUpdate(
      id,
      { disponible },
      { new: true }
    );

    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    res.json({
      mensaje: 'Disponibilidad actualizada correctamente',
      tienda
    });
  } catch (error) {
    console.error('❌ Error actualizando tienda:', error.message);
    res.status(500).json({ error: 'Error al actualizar la disponibilidad' });
  }
});

module.exports = router;
