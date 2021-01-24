output "api_ip" {
  description = "API ip"
  value = aws_instance.web.public_ip
}
output "api_dns" {
  description = "API dns"
  value = aws_instance.web.public_dns
}
