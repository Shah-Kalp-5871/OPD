terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # In production, configure an S3 / DynamoDB Backend for state-locking
  # backend "s3" {
  #   bucket         = "medflow-tfstate-vault"
  #   key            = "production/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "medflow-tfstate-lock"
  # }
}

provider "aws" {
  region = var.aws_region
}

# ── Generate passwords securely ─────────────────────────────────────────────
resource "random_password" "db_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "redis_token" {
  length           = 32
  special          = false # ElastiCache tokens cannot contain special chars
}

# ── Module orchestrations ────────────────────────────────────────────────────
module "vpc" {
  source       = "./modules/vpc"
  vpc_cidr     = var.vpc_cidr
  project_name = var.project_name
  environment  = var.environment
}

module "eks" {
  source             = "./modules/eks"
  project_name       = var.project_name
  environment        = var.environment
  subnet_ids         = module.vpc.private_subnets
  node_instance_type = var.eks_node_instance_type
  desired_capacity   = 3
  max_capacity       = 6
  min_capacity       = 2
}

module "rds" {
  source                = "./modules/rds"
  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.private_subnets
  eks_security_group_id = module.eks.cluster_security_group_id
  db_instance_class     = var.db_instance_class
  db_password           = random_password.db_password.result
  allocated_storage     = 100
}

module "redis" {
  source                = "./modules/redis"
  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.private_subnets
  eks_security_group_id = module.eks.cluster_security_group_id
  redis_node_type       = var.redis_node_type
  num_cache_clusters    = 3
  redis_auth_token      = random_password.redis_token.result
}
