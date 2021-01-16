
data "aws_ami" "ubuntu" {
  most_recent = true

  # Replace dae with * to get last ubuntu
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-20200923"]
  }


  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_security_group" "securitization_sg" {
  name   = "securitization_sg"
  # vpc_id = var.vpc_id

  # SSH access from the VPC
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
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
}

data "template_file" "user_data" {
  template = file("${path.cwd}/scripts/add-ssh-web-app.yaml")
  vars = {
    ssh_key = file("${path.cwd}/keys/tf-cloud-init.pub")
    install_docker = base64encode(file("${path.cwd}/scripts/install-docker.sh"))
    docker_compose = base64encode(file("${path.cwd}/scripts/docker-compose.yaml"))
  }
}
resource "aws_instance" "web" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.securitization_instance_type
  # subnet_id                   = var.public_subnet_id
  vpc_security_group_ids      = [aws_security_group.securitization_sg.id]
  associate_public_ip_address = true
  user_data                   = data.template_file.user_data.rendered

  root_block_device {
    # volume_size = "100"
    delete_on_termination = true
  }

  tags = {
    Name = "API"
  }
}
