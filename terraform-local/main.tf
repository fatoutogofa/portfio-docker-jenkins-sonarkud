terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
  required_version = ">= 1.0"
}

# Connexion au cluster Kubernetes local (Docker Desktop)
provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "docker-desktop"
}
