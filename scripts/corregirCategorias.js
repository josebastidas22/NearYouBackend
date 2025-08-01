const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tienda = require('../models/Tienda');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🛠 Conectado a MongoDB, corrigiendo categorías...');

    const resultado = await Tienda.updateMany(
      { categoria: "Abarrotes" },
      { $set: { categoria: "abarrotes" } }
    );

    console.log(`✅ Categorías corregidas: ${resultado.modifiedCount} documentos actualizados`);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('🔴 Error conectando a MongoDB:', err);
  });
