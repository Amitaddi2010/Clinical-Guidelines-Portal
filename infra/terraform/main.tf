provider "aws" {
  region = "ap-south-1" # Mumbai Region
}

# VPC Configuration
resource "aws_vpc" "icmr_cgp_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "icmr-cgp-vpc"
    Environment = "Production"
    Project = "ICMR-CGP"
  }
}

# S3 Bucket for File Uploads
resource "aws_s3_bucket" "cgp_files" {
  bucket = "icmr-cgp-files-prod-apsouth1"
  
  tags = {
    Name = "ICMR CGP Content"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cgp_files_enc" {
  bucket = aws_s3_bucket.cgp_files.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ECS Cluster for Next.js and NestJS Fargate tasks
resource "aws_ecs_cluster" "cgp_cluster" {
  name = "icmr-cgp-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS PostgreSQL Database (Multi-AZ)
resource "aws_db_instance" "cgp_postgres" {
  identifier           = "icmr-cgp-db"
  allocated_storage    = 50
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = "db.r6g.large"
  username             = "cgpadm"
  password             = var.db_password
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = false
  multi_az             = true
  storage_encrypted    = true
  
  tags = {
    Name = "ICMR CGP Database"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "cgp_redis" {
  cluster_id           = "cgp-redis-cluster"
  engine               = "redis"
  node_type            = "cache.t4g.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
}

# CloudFront Distribution for Next.js Frontend
resource "aws_cloudfront_distribution" "cgp_cdn" {
  origin {
    domain_name = aws_lb.cgp_alb.dns_name
    origin_id   = "cgp-alb-origin"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "cgp-alb-origin"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
