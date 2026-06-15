# ─────────────────────────────────────────────
# Deployment Frontend — React / Nginx
# ─────────────────────────────────────────────
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "portfolio-frontend"
    namespace = "default"
    labels = {
      app = "portfolio-frontend"
    }
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = "portfolio-frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "portfolio-frontend"
        }
      }

      spec {
        container {
          name              = "frontend"
          image             = var.frontend_image
          image_pull_policy = "Always"

          port {
            container_port = 80
          }

          resources {
            requests = {
              cpu    = "50m"
              memory = "64Mi"
            }
            limits = {
              cpu    = "200m"
              memory = "128Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 10
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 5
            period_seconds        = 5
          }
        }
      }
    }
  }

  wait_for_rollout = true
}

# ─────────────────────────────────────────────
# Service Frontend NodePort
# Accessible sur http://localhost:30080
# ─────────────────────────────────────────────
resource "kubernetes_service" "frontend_service" {
  metadata {
    name      = "portfolio-frontend-service"
    namespace = "default"
  }

  spec {
    selector = {
      app = "portfolio-frontend"
    }

    port {
      port        = 80
      target_port = 80
      node_port   = 30080
    }

    type = "NodePort"
  }
}
