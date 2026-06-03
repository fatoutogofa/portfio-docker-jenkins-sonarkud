const mongoose = require('mongoose');

/**
 * Schéma de données pour un projet du portfolio
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre du projet est obligatoire'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },

    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    },

    technologies: {
      type: [String],
      required: [true, 'Au moins une technologie est requise'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'La liste de technologies ne peut pas être vide',
      },
    },

    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },

    projectUrl: {
      type: String,
      trim: true,
      default: null,
    },

    githubUrl: {
      type: String,
      trim: true,
      default: null,
    },

    category: {
      type: String,
      enum: ['web', 'mobile', 'desktop', 'api', 'data', 'autre'],
      default: 'web',
    },

    status: {
      type: String,
      enum: ['en cours', 'terminé', 'archivé'],
      default: 'terminé',
    },

    featured: {
      type: Boolean,
      default: false,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    versionKey: false,
  }
);

// Index pour améliorer les recherches fréquentes
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ category: 1, status: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
