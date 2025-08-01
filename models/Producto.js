const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  // 🛒 Nombre del producto
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
  },

  // 💰 Precio en pesos
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },

  // 📝 Descripción corta
  descripcion: {
    type: String,
    trim: true,
  },

  // 🏪 Referencia a la tienda que lo vende
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
    required: [true, 'Debe asociarse a una tienda'],
  },

  // 🕒 Fecha de creación
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Producto', productoSchema);
