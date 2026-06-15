variable "mongodb_uri" {
  description = "URI de connexion MongoDB Atlas"
  type        = string
  sensitive   = true
  default     = "mongodb+srv://babijou8_db_user:D9iwsRZ5tckatyEo@mongodb.aio8c4i.mongodb.net/?appName=mongodb"
}

variable "backend_image" {
  description = "Image Docker du backend"
  type        = string
  default     = "fatoutogo/portfolio-backend:latest"
}

variable "frontend_image" {
  description = "Image Docker du frontend"
  type        = string
  default     = "fatoutogo/portfolio-frontend:latest"
}

variable "replicas" {
  description = "Nombre de replicas pour chaque service"
  type        = number
  default     = 2
}
