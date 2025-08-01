const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

// 🔐 Función para generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET || 'clave_predeterminada_insegura',
    { expiresIn: '7d' }
  );
};

// ✅ POST /api/auth/registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    // Validar existencia
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const nuevoUsuario = new Usuario({ nombre, correo, contraseña, rol });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario);

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
  } catch (err) {
    console.error('❌ Error en registro:', err.message);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

// ✅ POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const contraseñaValida = await usuario.compararContraseña(contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = generarToken(usuario);

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({ error: 'Error en el login' });
  }
});

module.exports = router;
