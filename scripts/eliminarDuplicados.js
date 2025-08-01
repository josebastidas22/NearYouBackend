const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno si las tienes
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ✅ Ajusta esto si tu conexión está en otro archivo o URL
mongoose.connect('mongodb://127.0.0.1:27017/nearyou', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const tiendaSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  categoria: String,
  disponible: Boolean,
});

const Tienda = mongoose.model('Tienda', tiendaSchema);

mongoose.connection.once('open', async () => {
  console.log('✅ Conectado a MongoDB');

  try {
    const tiendas = await Tienda.find();
    const clavesUnicas = new Set();
    const idsAEliminar = [];

    for (const tienda of tiendas) {
      const clave = `${tienda.nombre}-${tienda.direccion}-${tienda.categoria}`;
      if (clavesUnicas.has(clave)) {
        idsAEliminar.push(tienda._id);
      } else {
        clavesUnicas.add(clave);
      }
    }

    if (idsAEliminar.length > 0) {
      const resultado = await Tienda.deleteMany({ _id: { $in: idsAEliminar } });
      console.log(`🗑️ Eliminados ${resultado.deletedCount} duplicados`);
    } else {
      console.log('✅ No se encontraron duplicados');
    }
  } catch (error) {
    console.error('❌ Error eliminando duplicados:', error);
  } finally {
    mongoose.connection.close();
  }
});
