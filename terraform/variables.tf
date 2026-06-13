variable "aws_region" {
  description = "Region AWS"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Nom du cluster EKS"
  type        = string
  default     = "portfolio-cluster"
}

variable "node_instance_type" {
  description = "Type d instance EC2"
  type        = string
  default     = "t3.small"
}


variable "desired_nodes" {
  description = "Nombre de nodes desires"
  type        = number
  default     = 1
}