# ─────────────────────────────────────────────
# Secret MongoDB — stocke les credentials
# de façon sécurisée dans Kubernetes
# ─────────────────────────────────────────────
resource "kubernetes_secret" "portfolio_secrets" {
  metadata {
    name      = "portfolio-secrets"
    namespace = "default"
  }

  # Les valeurs sont encodées en base64 automatiquement
  data = {
    "mongodb-uri" = var.mongodb_uri
  }

  type = "Opaque"
}
