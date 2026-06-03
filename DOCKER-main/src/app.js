require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/connectdb');
const projectRoutes = require('./routes/project.routes');

// ─────────────────────────────────────────────
// Connexion à MongoDB
// ─────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────
// Initialisation de l'application Express
// ─────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────
// Middlewares globaux
// ─────────────────────────────────────────────
app.use(helmet());                          // Sécurisation des headers HTTP
app.use(cors());                            // Autorisation des requêtes cross-origin
app.use(express.json());                    // Parsing du body JSON
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded

// Logging des requêtes HTTP (uniquement hors production)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─────────────────────────────────────────────
// Route de santé (health check)
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Portfolio API — Serveur opérationnel',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
    },
  });
});

// ─────────────────────────────────────────────
// Montage des routes
// ─────────────────────────────────────────────
app.use('/api/projects', projectRoutes);

// ─────────────────────────────────────────────
// Middleware de gestion des routes introuvables
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  });
});

// ─────────────────────────────────────────────
// Middleware de gestion globale des erreurs
// ─────────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('💥 Erreur globale :', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
  });
});

// ─────────────────────────────────────────────
// Démarrage du serveur
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🌐 Serveur démarré en mode ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Écoute sur : http://localhost:${PORT}`);
  console.log(`📋 API disponible sur : http://localhost:${PORT}/api/projects\n`);
});

module.exports = app;
