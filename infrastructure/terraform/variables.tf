variable "aws_region" {
  type        = string
  description = "AWS Target Deployment Region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Environment identifier (staging, production)"
  default     = "production"
}

variable "project_name" {
  type        = string
  description = "Project name prefix for resources"
  default     = "medflow"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC classless inter-domain routing CIDR block"
  default     = "10.0.0.0/16"
}

variable "db_instance_class" {
  type        = string
  description = "PostgreSQL RDS instance type class"
  default     = "db.r6g.xlarge" # Multi-AZ production class memory-optimized
}

variable "redis_node_type" {
  type        = string
  description = "AWS ElastiCache Redis node type"
  default     = "cache.r6g.large"
}

variable "eks_node_instance_type" {
  type        = string
  description = "EKS node group host machine instance type"
  default     = "m6i.xlarge"
}
