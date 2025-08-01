const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Correo electrónico inválido'],
    },
    contraseña: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    rol: {
      type: String,
      enum: ['oferente', 'demandante'],
      default: 'oferente',
    },
  },
  { timestamps: true }
);

// 🔐 Hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔐 Método para comparar contraseñas (login)
usuarioSchema.methods.compararContraseña = async function (entrada) {
  return bcrypt.compare(entrada, this.contraseña);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
