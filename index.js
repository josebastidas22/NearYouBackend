const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan'); // 👈 Logging útil para desarrollo

// 1. Cargar variables de entorno
dotenv.config({ path: './config.env' });

// 2. Crear la app
const app = express();

// 3. Middlewares globales
app.use(cors());                  // Permitir peticiones desde frontend (móvil/web)
app.use(express.json());         // Habilitar lectura de JSON en peticiones
app.use(morgan('dev'));          // 👈 Log de rutas usadas (opcional pero útil)

// 4. Ruta de prueba (inicio)
app.get('/', (req, res) => {
  res.send('🚀 ¡Bienvenido al backend de NearYou!');
});

// 5. Importar y registrar rutas
const tiendaRoutes = require('./routes/tiendaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/tiendas', tiendaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);

// 6. Middleware de manejo de errores generales
app.use((err, req, res, next) => {
  console.error('❌ Error interno:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 7. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('🟢 Conexión a MongoDB exitosa');

  // 8. Levantar el servidor solo si la DB está conectada
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ NearYou backend corriendo en puerto ${PORT}`);
  });
}).catch((err) => {
  console.error('🔴 Error conectando a MongoDB:', err.message);
});
