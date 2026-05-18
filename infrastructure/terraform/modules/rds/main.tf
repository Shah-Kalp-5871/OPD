terraform {
  required_version = ">= 1.5.0"
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.project_name}-${var.environment}-rds-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.project_name}-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Access rule security group for MedFlow RDS PostgreSQL cluster"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow inbound traffic from EKS worker node group"
    from_port       = 5432
    to_port         = 5432
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
    Name        = "${var.project_name}-${var.environment}-rds-sg"
    Environment = var.environment
  }
}

resource "aws_db_instance" "this" {
  identifier             = "${var.project_name}-${var.environment}-db"
  allocated_storage      = var.allocated_storage
  max_allocated_storage  = 1000 # Autoscaling capability up to 1TB
  engine                 = "postgres"
  engine_version         = "16.1"
  instance_class         = var.db_instance_class
  db_name                = "medflow"
  username               = "medflow_admin"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  multi_az               = true # High availability setup
  storage_encrypted      = true # HIPAA constraint
  skip_final_snapshot    = var.environment == "production" ? false : true
  final_snapshot_identifier = "${var.project_name}-${var.environment}-db-final-snapshot"

  tags = {
    Name        = "${var.project_name}-${var.environment}-postgres"
    Environment = var.environment
  }
}

# ── Variables definition locally ──────────────────────────────────────────────
variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "eks_security_group_id" { type = string }
variable "db_instance_class" { type = string }
variable "db_password" { type = string; sensitive = true }
variable "allocated_storage" { type = number; default = 100 }

# ── Outputs definition locally ────────────────────────────────────────────────
output "rds_endpoint" { value = aws_db_instance.this.endpoint }
output "rds_address" { value = aws_db_instance.this.address }
output "rds_port" { value = aws_db_instance.this.port }
