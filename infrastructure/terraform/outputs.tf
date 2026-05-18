output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "Provisioned VPC ID reference"
}

output "eks_cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "Endpoint address of EKS Kubernetes api-server"
}

output "eks_cluster_security_group_id" {
  value       = module.eks.cluster_security_group_id
  description = "Security Group assigned to the EKS cluster control plane"
}

output "postgres_rds_endpoint" {
  value       = module.rds.rds_endpoint
  description = "PostgreSQL primary host address and connection endpoint"
}

output "redis_primary_endpoint" {
  value       = module.redis.primary_endpoint
  description = "ElastiCache Redis clustered primary server endpoint"
}
