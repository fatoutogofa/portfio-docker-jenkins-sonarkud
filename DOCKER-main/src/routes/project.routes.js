const express = require('express');
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');

/**
 * Routes pour la gestion des projets du portfolio
 * Base URL : /api/projects
 */

// ─────────────────────────────────────────────
// Route  : POST   /api/projects
// Action : Ajouter un nouveau projet
// ─────────────────────────────────────────────
router.post('/', createProject);

// ─────────────────────────────────────────────
// Route  : GET    /api/projects
// Action : Retourner tous les projets
// Query params optionnels :
//   ?category=web|mobile|desktop|api|data|autre
//   ?status=en cours|terminé|archivé
//   ?featured=true|false
//   ?sort=-createdAt (défaut)
// ─────────────────────────────────────────────
router.get('/', getAllProjects);

// ─────────────────────────────────────────────
// Route  : GET    /api/projects/:id
// Action : Retourner les infos d'un projet donné
// ─────────────────────────────────────────────
router.get('/:id', getProjectById);

// ─────────────────────────────────────────────
// Route  : PUT    /api/projects/:id
// Action : Modifier les informations d'un projet
// ─────────────────────────────────────────────
router.put('/:id', updateProject);

// ─────────────────────────────────────────────
// Route  : DELETE /api/projects/:id
// Action : Supprimer un projet
// ─────────────────────────────────────────────
router.delete('/:id', deleteProject);

module.exports = router;
