# TauOS Email Server Infrastructure
# AWS Terraform Configuration for TauMail SMTP/IMAP Server

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC for Email Server
resource "aws_vpc" "tauos_email_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "tauos-email-vpc"
    Project = "TauOS"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "tauos_igw" {
  vpc_id = aws_vpc.tauos_email_vpc.id

  tags = {
    Name = "tauos-email-igw"
    Project = "TauOS"
  }
}

# Public Subnet
resource "aws_subnet" "tauos_public_subnet" {
  vpc_id                  = aws_vpc.tauos_email_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "tauos-email-public-subnet"
    Project = "TauOS"
  }
}

# Route Table
resource "aws_route_table" "tauos_public_rt" {
  vpc_id = aws_vpc.tauos_email_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.tauos_igw.id
  }

  tags = {
    Name = "tauos-email-public-rt"
    Project = "TauOS"
  }
}

# Route Table Association
resource "aws_route_table_association" "tauos_public_rta" {
  subnet_id      = aws_subnet.tauos_public_subnet.id
  route_table_id = aws_route_table.tauos_public_rt.id
}

# Security Group for Email Server
resource "aws_security_group" "tauos_email_sg" {
  name        = "tauos-email-security-group"
  description = "Security group for TauOS email server"
  vpc_id      = aws_vpc.tauos_email_vpc.id

  # SSH Access
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SMTP (Port 25)
  ingress {
    description = "SMTP"
    from_port   = 25
    to_port     = 25
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SMTP with TLS (Port 587)
  ingress {
    description = "SMTP with TLS"
    from_port   = 587
    to_port     = 587
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # IMAP (Port 143)
  ingress {
    description = "IMAP"
    from_port   = 143
    to_port     = 143
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # IMAP with TLS (Port 993)
  ingress {
    description = "IMAP with TLS"
    from_port   = 993
    to_port     = 993
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # POP3 (Port 110)
  ingress {
    description = "POP3"
    from_port   = 110
    to_port     = 110
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # POP3 with TLS (Port 995)
  ingress {
    description = "POP3 with TLS"
    from_port   = 995
    to_port     = 995
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP (Port 80)
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS (Port 443)
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "tauos-email-sg"
    Project = "TauOS"
  }
}

# Key Pair for SSH Access
resource "aws_key_pair" "tauos_email_key" {
  key_name   = "tauos-email-key"
  public_key = file("${path.module}/ssh/tauos-email-key.pub")
}

# EC2 Instance for Email Server
resource "aws_instance" "tauos_email_server" {
  ami                    = "ami-0c02fb55956c7d316" # Ubuntu 22.04 LTS
  instance_type          = "t3.medium"
  key_name               = aws_key_pair.tauos_email_key.key_name
  vpc_security_group_ids = [aws_security_group.tauos_email_sg.id]
  subnet_id              = aws_subnet.tauos_public_subnet.id

  root_block_device {
    volume_size = 50
    volume_type = "gp3"
  }

  user_data = file("${path.module}/scripts/email-server-setup.sh")

  tags = {
    Name = "tauos-email-server"
    Project = "TauOS"
  }
}

# Elastic IP for Email Server
resource "aws_eip" "tauos_email_eip" {
  instance = aws_instance.tauos_email_server.id
  domain   = "vpc"

  tags = {
    Name = "tauos-email-eip"
    Project = "TauOS"
  }
}

# Outputs
output "email_server_public_ip" {
  description = "Public IP of the email server"
  value       = aws_eip.tauos_email_eip.public_ip
}

output "email_server_instance_id" {
  description = "Instance ID of the email server"
  value       = aws_instance.tauos_email_server.id
}

output "email_server_dns_name" {
  description = "DNS name for the email server"
  value       = "smtp.tauos.org"
} 