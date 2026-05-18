terraform {
  required_version = ">= 1.5.0"
}

resource "aws_elasticache_subnet_group" "this" {
  name       = "${var.project_name}-${var.environment}-redis-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.project_name}-${var.environment}-redis-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "redis" {
  name        = "${var.project_name}-${var.environment}-redis-sg"
  description = "Access rule security group for MedFlow Redis cluster"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow inbound Redis traffic from EKS worker node group"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-redis-sg"
    Environment = var.environment
  }
}

resource "aws_elasticache_replication_group" "this" {
  replication_group_id          = "${var.project_name}-${var.environment}-redis"
  replication_group_description = "MedFlow Clustered Redis Replication Group"
  node_type                     = var.redis_node_type
  num_cache_clusters            = var.num_cache_clusters
  port                          = 6379
  parameter_group_name          = "default.redis7"
  subnet_group_name             = aws_elasticache_subnet_group.this.name
  security_group_ids            = [aws_security_group.redis.id]
  automatic_failover_enabled    = true # High availability replica promotion
  multi_az_enabled              = true
  at_rest_encryption_enabled    = true # Secure transit/at-rest storage encryption
  transit_encryption_enabled   = true
  auth_token                    = var.redis_auth_token # Password check

  tags = {
    Name        = "${var.project_name}-${var.environment}-redis-cluster"
    Environment = var.environment
  }
}

# ── Variables definition locally ──────────────────────────────────────────────
variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "eks_security_group_id" { type = string }
variable "redis_node_type" { type = string }
variable "num_cache_clusters" { type = number; default = 3 }
variable "redis_auth_token" { type = string; sensitive = true }

# ── Outputs definition locally ────────────────────────────────────────────────
output "primary_endpoint" { value = aws_elasticache_replication_group.this.primary_endpoint_address }
output "configuration_endpoint" { value = aws_elasticache_replication_group.this.configuration_endpoint_address }
