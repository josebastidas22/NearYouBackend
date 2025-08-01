const Tienda = require('../models/Tienda');

// ✅ Crear nueva tienda (requiere autenticación)
exports.crearTienda = async (req, res) => {
  try {
    const { nombre, direccion, categoria, celular } = req.body;

    if (!nombre || !direccion || !categoria || !celular) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevaTienda = new Tienda({
      nombre,
      direccion,
      categoria,
      celular,
      creador: req.usuario._id, // 🔐 Asegúrate que authMiddleware asigna `req.usuario`
    });

    const tiendaGuardada = await nuevaTienda.save();

    res.status(201).json({
      mensaje: 'Tienda registrada exitosamente',
      tienda: tiendaGuardada,
    });
  } catch (error) {
    console.error('❌ Error al crear tienda:', error.message);
    res.status(500).json({ error: 'Error al registrar tienda' });
  }
};

// ✅ Obtener todas las tiendas con filtros opcionales
exports.filtrarTiendas = async (req, res) => {
  try {
    const { categoria, direccion } = req.query;
    const filtro = {};

    if (categoria) filtro.categoria = categoria.toLowerCase();
    if (direccion) filtro.direccion = { $regex: direccion, $options: 'i' };

    const tiendas = await Tienda.find(filtro).sort({ creadoEn: -1 });
    res.json({ tiendas });
  } catch (error) {
    console.error('❌ Error al filtrar tiendas:', error.message);
    res.status(500).json({ error: 'Error al obtener tiendas' });
  }
};

// ✅ Obtener una tienda por ID
exports.obtenerTiendaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tienda = await Tienda.findById(id);

    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    res.json(tienda);
  } catch (error) {
    console.error('❌ Error al obtener tienda:', error.message);
    res.status(500).json({ error: 'Error al buscar la tienda' });
  }
};
