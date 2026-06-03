const mongoose = require('mongoose');

/**
 * Module de connexion à MongoDB via Mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`📦 Base de données : ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1); // Arrêt du processus en cas d'échec critique
  }
};

// Événements de connexion Mongoose
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB déconnecté.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnecté.');
});

module.exports = connectDB;
