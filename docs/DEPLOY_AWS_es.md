# AWS Despliegue Guía

Esta guía explica cómo desplegar the LinkStack application on Amazon Web Services (AWS).

## Requisitos previos

AWS account
Configurado AWS CLI
Docker installed (to build the image)
Created repository in Amazon ECR

## Aplicación Preparation

1. Asegúrate Dockerfile.flask is correctly configured
2. Build the Docker image:
```bash
docker build -f Dockerfile.flask -t linkstack-app .
```

## Despliegue on Amazon ECS

1. Log in to Amazon ECR:
```bash
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
```
2. Tag the Docker image for ECR:
```bash
docker tag linkstack-app:latest your-account-id.dkr.ecr.your-region.amazonaws.com/linkstack-app:latest
```
3. Push the image to ECR:
```bash
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/linkstack-app:latest
```
4. Create an ECS cluster (if you don't have one):
```bash
aws ecs create-cluster --cluster-name linkstack-cluster
```
5. Create a task definition for the service:
```bash
# Create a task definition file (task-definition.json)
aws ecs register-task-definition --cli-input-json file://task-definition.json
```
6. Create an ECS service to run the task:
```bash
aws ecs create-service --cluster linkstack-cluster --service-name linkstack-service --task-definition linkstack-task --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678],securityGroups=[sg-12345678],assignPublicIp=ENABLED}"
```

## Base de datos Configuración

1. Create an RDS PostgreSQL instance:
```bash
aws rds create-db-instance --db-instance-identifier linkstack-db --db-instance-class db.t3.micro --engine postgres --master-username postgres --master-user-password your_secure_password --allocated-storage 20
```
2. Update the environment variables in the ECS service to point to the RDS.

## Load Balancer Configuración

1. Create an Aplicación Load Balancer (ALB):
```bash
aws elbv2 create-load-balancer --name linkstack-lb --subnets subnet-12345678 subnet-87654321 --security-groups sg-12345678
```
2. Create a target group:
```bash
aws elbv2 create-target-group --name linkstack-tg --protocol HTTP --port 5000 --vpc-id vpc-12345678 --target-type ip --health-check-path / --health-check-interval-seconds 30
```
3. Create a listener:
```bash
aws elbv2 create-listener --load-balancer-arn arn:aws:elasticloadbalancing:your-region:your-account-id:loadbalancer/app/linkstack-lb/1234567890abcdef --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:your-region:your-account-id:targetgroup/linkstack-tg/1234567890abcdef
```
4. Update the ECS service to use the load balancer.

