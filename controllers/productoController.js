const Producto = require('../models/Producto');

// ✅ Obtener todos los productos
exports.obtenerTodos = async (req, res) => {
  try {
    const productos = await Producto.find()
      .sort({ creadoEn: -1 })
      .populate('tienda', 'nombre direccion');

    res.json({ productos });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// ✅ Obtener productos por tienda
exports.obtenerPorTienda = async (req, res) => {
  try {
    const { tiendaId } = req.params;

    if (!tiendaId) {
      return res.status(400).json({ error: 'ID de tienda requerido' });
    }

    const productos = await Producto.find({ tienda: tiendaId })
      .sort({ creadoEn: -1 })
      .populate('tienda', 'nombre direccion');

    res.json({ productos });
  } catch (error) {
    console.error('❌ Error al obtener productos por tienda:', error.message);
    res.status(500).json({ error: 'Error al obtener productos por tienda' });
  }
};

// ✅ Crear un nuevo producto
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion, tienda } = req.body;

    if (!nombre || !precio || !tienda) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevoProducto = new Producto({
      nombre,
      precio,
      descripcion,
      tienda,
    });

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      producto: productoGuardado,
    });
  } catch (error) {
    console.error('❌ Error al crear producto:', error.message);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// ✅ Buscar productos por nombre
exports.buscarPorNombre = async (req, res) => {
  const { nombre } = req.query;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'Término de búsqueda requerido' });
  }

  try {
    const productos = await Producto.find({
      nombre: { $regex: nombre, $options: 'i' },
    }).populate('tienda', 'nombre direccion');

    res.json({ productos });
  } catch (error) {
    console.error('❌ Error al buscar productos por nombre:', error.message);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
};
