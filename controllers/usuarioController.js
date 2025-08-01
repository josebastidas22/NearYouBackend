const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

// ✅ Generar token JWT
const crearToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET || 'clave_predeterminada_insegura', // 🔒 Configurar en producción
    {
      expiresIn: '7d',
    }
  );
};

// ✅ Registro de usuario
exports.registrar = async (req, res) => {
  try {
    const { correo, contraseña, nombre, rol } = req.body;

    // Verifica si ya existe un usuario con ese correo
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ error: 'Correo ya registrado' });
    }

    // Crea nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, correo, contraseña, rol });
    await nuevoUsuario.save();

    const token = crearToken(nuevoUsuario);

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error('❌ Error en registro:', error.message);
    res.status(500).json({ error: 'Error al registrar' });
  }
};

// ✅ Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const valido = await usuario.compararContraseña(contraseña);
    if (!valido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = crearToken(usuario);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
