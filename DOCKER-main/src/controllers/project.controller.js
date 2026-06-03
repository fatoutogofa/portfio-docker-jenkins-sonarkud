const Project = require('../models/project.model');

/**
 * Contrôleur pour la gestion des projets du portfolio
 * Contient toute la logique métier (CRUD)
 */

// ─────────────────────────────────────────────
// @desc    Ajouter un nouveau projet
// @route   POST /api/projects
// @access  Public
// ─────────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();

    res.status(201).json({
      success: true,
      message: 'Projet créé avec succès',
      data: savedProject,
    });
  } catch (error) {
    // Gestion des erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du projet',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Retourner tous les projets
// @route   GET /api/projects
// @access  Public
// ─────────────────────────────────────────────
const getAllProjects = async (req, res) => {
  try {
    // Filtres optionnels via query params : ?category=web&status=terminé&featured=true
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.featured) filter.featured  = req.query.featured === 'true';

    // Tri (défaut : plus récents en premier)
    const sort = req.query.sort || '-createdAt';

    const projects = await Project.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des projets',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Retourner toutes les informations d'un projet donné
// @route   GET /api/projects/:id
// @access  Public
// ─────────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'identifiant : ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    // ID MongoDB mal formé
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Identifiant de projet invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du projet',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Modifier les informations d'un projet donné
// @route   PUT /api/projects/:id
// @access  Public
// ─────────────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Retourne le document mis à jour
        runValidators: true, // Valide les nouvelles données
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'identifiant : ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Projet mis à jour avec succès',
      data: project,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Identifiant de projet invalide',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du projet',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Supprimer un projet
// @route   DELETE /api/projects/:id
// @access  Public
// ─────────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'identifiant : ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Projet supprimé avec succès',
      data: { id: req.params.id },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Identifiant de projet invalide',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du projet',
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
