const mongoose = require('mongoose');

const tiendaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la tienda es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener mínimo 3 caracteres']
  },
  direccion: {
    type: String,
    required: [true, 'La dirección de la tienda es obligatoria'],
    trim: true
  },
  categoria: {
    type: String,
    enum: {
      values: ['comida', 'ropa', 'tecnologia', 'hogar', 'otros', 'abarrotes'],
      message: '{VALUE} no es una categoría válida'
    },
    required: [true, 'La categoría es obligatoria']
  },
  celular: {
    type: String,
    required: [true, 'El número de celular es obligatorio'],
    match: [/^\d{10}$/, 'El número debe tener exactamente 10 dígitos']
  },
  disponible: {
    type: Boolean,
    default: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuario',
    required: true
  }
});

// 🔁 Normaliza la categoría a minúsculas automáticamente
tiendaSchema.pre('save', function (next) {
  if (this.categoria) {
    this.categoria = this.categoria.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Tienda', tiendaSchema);
