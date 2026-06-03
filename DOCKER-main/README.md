# 📁 Portfolio API

API REST de gestion de portfolio construite avec **Express.js** et **MongoDB (Mongoose)**.

---

## 🚀 Technologies utilisées

- **Node.js** — Environnement d'exécution JavaScript
- **Express.js** — Framework web minimaliste
- **MongoDB** — Base de données NoSQL
- **Mongoose** — ODM pour MongoDB
- **dotenv** — Gestion des variables d'environnement
- **cors** — Cross-Origin Resource Sharing
- **helmet** — Sécurisation des headers HTTP
- **morgan** — Logger HTTP

---

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/<votre-username>/portfolio-api.git
cd portfolio-api

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos propres valeurs
```

---

## ⚙️ Configuration (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio_db
```

---

## ▶️ Démarrage

```bash
# Mode production
npm start

# Mode développement (rechargement automatique)
npm run dev
```

---

## 🗂️ Structure du projet

```
portfolio-api/
├── src/
│   ├── config/
│   │   └── connectdb.js       # Connexion à MongoDB
│   ├── models/
│   │   └── project.model.js   # Modèle de données Mongoose
│   ├── controllers/
│   │   └── project.controller.js  # Logique métier (CRUD)
│   ├── routes/
│   │   └── project.routes.js  # Définition des routes
│   └── app.js                 # Point d'entrée de l'application
├── .env                       # Variables d'environnement (non versionné)
├── .env.example               # Modèle de configuration
├── .gitignore
└── package.json
```

---

## 📡 Endpoints de l'API

| Méthode | Route                  | Description                        |
|---------|------------------------|------------------------------------|
| `GET`   | `/`                    | Health check — statut du serveur   |
| `POST`  | `/api/projects`        | Ajouter un nouveau projet          |
| `GET`   | `/api/projects`        | Retourner tous les projets         |
| `GET`   | `/api/projects/:id`    | Retourner un projet par ID         |
| `PUT`   | `/api/projects/:id`    | Modifier un projet                 |
| `DELETE`| `/api/projects/:id`    | Supprimer un projet                |

### Filtres disponibles (GET /api/projects)

```
?category=web|mobile|desktop|api|data|autre
?status=en cours|terminé|archivé
?featured=true|false
?sort=-createdAt  (défaut : plus récents d'abord)
```

---

## 📋 Exemple de payload (POST / PUT)

```json
{
  "title": "Portfolio Personnel",
  "description": "Site web de présentation de mes projets et compétences.",
  "technologies": ["React", "Node.js", "MongoDB"],
  "imageUrl": "https://example.com/image.png",
  "projectUrl": "https://monportfolio.com",
  "githubUrl": "https://github.com/user/portfolio",
  "category": "web",
  "status": "terminé",
  "featured": true,
  "startDate": "2024-01-01",
  "endDate": "2024-03-15"
}
```

---

## 📝 Exemple de réponse (GET /api/projects)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "664abc123def456789012345",
      "title": "Portfolio Personnel",
      "description": "Site web de présentation...",
      "technologies": ["React", "Node.js", "MongoDB"],
      "category": "web",
      "status": "terminé",
      "featured": true,
      "createdAt": "2024-04-28T10:00:00.000Z",
      "updatedAt": "2024-04-28T10:00:00.000Z"
    }
  ]
}
```

---

## 🔄 Versioning Git

Chaque module a été commité séparément :

1. `init: initialisation du projet Node.js`
2. `feat: ajout du fichier .env et .env.example`
3. `feat: module connectdb — connexion MongoDB`
4. `feat: module model — schéma Mongoose Project`
5. `feat: module controller — logique CRUD`
6. `feat: module routes — définition des routes REST`
7. `feat: app.js — point d'entrée de l'application`
