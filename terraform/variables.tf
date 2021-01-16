variable "region" {
  description = "The region Terraform deploys your instance"
  default = "eu-central-1"
}

variable "securitization_instance_type" {
  description = "Securitization Instance Type"
  default = "t3.xlarge"
}
