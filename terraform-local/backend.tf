# ─────────────────────────────────────────────
# Deployment Backend — Node.js / Express
# Un Deployment = comment lancer les pods
# ─────────────────────────────────────────────
resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "portfolio-backend"
    namespace = "default"
    labels = {
      app = "portfolio-backend"
    }
  }

  spec {
    # Nombre de copies (pods) à maintenir en vie
    replicas = var.replicas

    # Sélecteur — quels pods ce deployment gère
    selector {
      match_labels = {
        app = "portfolio-backend"
      }
    }

    # Template — modèle pour créer chaque pod
    template {
      metadata {
        labels = {
          app = "portfolio-backend"
        }
      }

      spec {
        container {
          name  = "backend"
          image = var.backend_image
          # Always = re-télécharge l'image à chaque redémarrage
          image_pull_policy = "Always"

          port {
            container_port = 5000
          }

          # Variables d'environnement depuis le Secret
          env {
            name  = "PORT"
            value = "5000"
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }

          env {
            name = "MONGODB_URI"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.portfolio_secrets.metadata[0].name
                key  = "mongodb-uri"
              }
            }
          }

          # Limites de ressources — protège le node
          resources {
            requests = {
              cpu    = "100m"  # 0.1 CPU
              memory = "128Mi" # 128 MB RAM
            }
            limits = {
              cpu    = "500m"  # 0.5 CPU max
              memory = "256Mi" # 256 MB RAM max
            }
          }

          # Health check — Kubernetes redémarre si ça répond pas
          liveness_probe {
            http_get {
              path = "/"
              port = 5000
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 5000
            }
            initial_delay_seconds = 10
            period_seconds        = 5
          }
        }
      }
    }
  }

  # Attend que le déploiement soit terminé
  wait_for_rollout = true
}

# ─────────────────────────────────────────────
# Service Backend ClusterIP
# Accessible uniquement depuis le cluster
# Les autres pods l'appellent par son nom DNS
# ─────────────────────────────────────────────
resource "kubernetes_service" "backend_service" {
  metadata {
    name      = "portfolio-backend-service"
    namespace = "default"
  }

  spec {
    selector = {
      app = "portfolio-backend"
    }

    port {
      port        = 5000
      target_port = 5000
    }

    # ClusterIP = accessible uniquement depuis le cluster
    type = "ClusterIP"
  }
}

# ─────────────────────────────────────────────
# Service Backend NodePort
# Accessible depuis l'extérieur via localhost:30500
# ─────────────────────────────────────────────
resource "kubernetes_service" "backend_nodeport" {
  metadata {
    name      = "portfolio-backend-nodeport"
    namespace = "default"
  }

  spec {
    selector = {
      app = "portfolio-backend"
    }

    port {
      port        = 5000
      target_port = 5000
      node_port   = 30500
    }

    # NodePort = ouvert sur le node (localhost)
    type = "NodePort"
  }
}
