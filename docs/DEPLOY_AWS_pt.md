# Guia de Deploy na AWS

Este guia explica como implantar a aplicação LinkStack na Amazon Web Services (AWS).

## Pré-requisitos

Conta na AWS
AWS CLI configurado
Docker instalado (para criar a imagem)
Repositório no Amazon ECR criado

## Preparação da Aplicação

1. Certifique-se de que o Dockerfile.flask esteja configurado corretamente
2. Construa a imagem Docker:
```bash
docker build -f Dockerfile.flask -t linkstack-app .
```

## Deploy no Amazon ECS

1. Faça login no Amazon ECR:
```bash
aws ecr get-login-password --region sua-regiao | docker login --username AWS --password-stdin seu-id-conta.dkr.ecr.sua-regiao.amazonaws.com
```
2. Marque a imagem Docker para o ECR:
```bash
docker tag linkstack-app:latest seu-id-conta.dkr.ecr.sua-regiao.amazonaws.com/linkstack-app:latest
```
3. Envie a imagem para o ECR:
```bash
docker push seu-id-conta.dkr.ecr.sua-regiao.amazonaws.com/linkstack-app:latest
```
4. Crie um cluster ECS (se ainda não tiver um):
```bash
aws ecs create-cluster --cluster-name linkstack-cluster
```
5. Crie uma definição de tarefa para o serviço:
```bash
# Crie um arquivo de definição de tarefa (task-definition.json)
aws ecs register-task-definition --cli-input-json file://task-definition.json
```
6. Crie um serviço ECS para executar a tarefa:
```bash
aws ecs create-service --cluster linkstack-cluster --service-name linkstack-service --task-definition linkstack-task --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678],securityGroups=[sg-12345678],assignPublicIp=ENABLED}"
```

## Configuração do Banco de Dados

1. Crie uma instância RDS PostgreSQL:
```bash
aws rds create-db-instance --db-instance-identifier linkstack-db --db-instance-class db.t3.micro --engine postgres --master-username postgres --master-user-password sua_senha_segura --allocated-storage 20
```
2. Atualize as variáveis de ambiente no serviço ECS para apontar para o RDS.

## Configuração de Load Balancer

1. Crie um Application Load Balancer (ALB):
```bash
aws elbv2 create-load-balancer --name linkstack-lb --subnets subnet-12345678 subnet-87654321 --security-groups sg-12345678
```
2. Crie um grupo de destino:
```bash
aws elbv2 create-target-group --name linkstack-tg --protocol HTTP --port 5000 --vpc-id vpc-12345678 --target-type ip --health-check-path / --health-check-interval-seconds 30
```
3. Crie um listener:
```bash
aws elbv2 create-listener --load-balancer-arn arn:aws:elasticloadbalancing:sua-regiao:seu-id-conta:loadbalancer/app/linkstack-lb/1234567890abcdef --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:sua-regiao:seu-id-conta:targetgroup/linkstack-tg/1234567890abcdef
```
4. Atualize o serviço ECS para usar o load balancer.

