const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario'); // renombramos con mayúscula

// Middleware para verificar token JWT
exports.protegerRuta = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No estás autorizado. Token faltante' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuarioAutenticado = await Usuario.findById(decoded.id).select('-contraseña');

    if (!usuarioAutenticado) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    req.usuario = usuarioAutenticado; // Agregamos usuario al request
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
