# ─────────────────────────────────────────────
# Outputs — URLs d'accès après terraform apply
# ─────────────────────────────────────────────

output "frontend_url" {
  description = "URL d'accès au frontend"
  value       = "http://localhost:30080"
}

output "backend_url" {
  description = "URL d'accès au backend API"
  value       = "http://localhost:30500/api/projects"
}

output "backend_replicas" {
  description = "Nombre de pods backend"
  value       = kubernetes_deployment.backend.spec[0].replicas
}

output "frontend_replicas" {
  description = "Nombre de pods frontend"
  value       = kubernetes_deployment.frontend.spec[0].replicas
}
