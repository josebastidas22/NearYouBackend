const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// POST /api/usuarios/registro - Registrar nuevo usuario
router.post('/registro', usuarioController.registrar);

// POST /api/usuarios/login - Login de usuario
router.post('/login', usuarioController.login);

module.exports = router;
