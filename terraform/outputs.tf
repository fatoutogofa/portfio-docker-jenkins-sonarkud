# ─────────────────────────────────────────────
# Outputs Terraform
# ─────────────────────────────────────────────

output "vpc_id" {
  description = "ID du VPC"
  value       = aws_vpc.portfolio_vpc.id
}

output "public_subnet_ids" {
  description = "IDs des subnets publics"
  value       = aws_subnet.public[*].id
}

output "eks_cluster_name" {
  description = "Nom du cluster EKS"
  value       = aws_eks_cluster.portfolio.name
}

output "eks_cluster_endpoint" {
  description = "Endpoint du cluster EKS"
  value       = aws_eks_cluster.portfolio.endpoint
}

output "eks_kubeconfig_command" {
  description = "Commande pour configurer kubectl"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${var.cluster_name}"
}
