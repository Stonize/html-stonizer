# Create a new load balancer
resource "aws_elb" "html_stonizer" {

  name               = "html-stonizer-elb"
  availability_zones = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]

  # access_logs {
  #  bucket        = "stonize-website-logs"
  #  bucket_prefix = "stonize"
  #  interval      = 60
  #}

  /*
  listener {
    instance_port     = 80
    instance_protocol = "http"
    lb_port           = 80
    lb_protocol       = "http"
  }
  */

  listener {
    instance_port      = 80
    instance_protocol  = "http"
    lb_port            = 443
    lb_protocol        = "https"
    ssl_certificate_id = "arn:aws:acm:eu-central-1:101180582726:certificate/66ffb003-36b8-47ca-acfc-428de838828d"
  }

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    target              = "HTTP:80/health "
    interval            = 30
  }

  instances                   = [aws_instance.web.id]
  cross_zone_load_balancing   = true
  idle_timeout                = 400
  connection_draining         = true
  connection_draining_timeout = 400
  security_groups             = [aws_security_group.securitization_sg.id]
  # subnets                     = [var.public_subnet_id]

  tags = {
    Name = "html-stonizer-elb"
  }
}
