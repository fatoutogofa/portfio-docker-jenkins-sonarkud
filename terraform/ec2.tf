# ─────────────────────────────────────────────
# EC2 — Pratique / Bastion Host
# ─────────────────────────────────────────────

# Security Group pour EC2
resource "aws_security_group" "ec2_sg" {
  name        = "portfolio-ec2-sg"
  description = "Security group pour EC2 bastion"
  vpc_id      = aws_vpc.portfolio_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "portfolio-ec2-sg" }
}

# Dernière AMI Amazon Linux 2023
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Instance EC2
resource "aws_instance" "portfolio_ec2" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    echo "EC2 portfolio instance ready"
  EOF

  tags = { Name = "portfolio-ec2" }
}

# Output EC2
output "ec2_public_ip" {
  description = "IP publique de l instance EC2"
  value       = aws_instance.portfolio_ec2.public_ip
}
