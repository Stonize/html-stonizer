# Access Keys

In order to access to the EC2 instantiated by terraform we used cloud init we injected SSH credential in the machine.

In order to to produce the SSH keys you need to execute:

```
ssh-keygen -t rsa -C "your_email@example.com" -f keys/tf-cloud-init
```