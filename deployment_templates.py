"""
Templates de documentação para diferentes plataformas e idiomas.
Este arquivo contém os templates que serão usados pelo gerador de documentação.
"""

# Templates para Heroku
HEROKU_TEMPLATES = {
    "pt": {
        "title": "Guia de Deploy no Heroku",
        "intro": "Este guia explica como implantar a aplicação LinkStack no Heroku.",
        "sections": [
            {
                "title": "Pré-requisitos",
                "content": [
                    "Conta no Heroku",
                    "Heroku CLI instalado",
                    "Git instalado",
                    "Repositório Git com o código da aplicação"
                ]
            },
            {
                "title": "Configuração do Deploy",
                "content": [
                    "1. Crie um arquivo `runtime.txt` na raiz do projeto com o seguinte conteúdo:",
                    "```",
                    "python-3.11.0",
                    "```",
                    "2. Renomeie o arquivo `REQUISITOS.txt` para `requirements.txt`:",
                    "```bash",
                    "git mv REQUISITOS.txt requirements.txt",
                    "```",
                    "3. Certifique-se de que o arquivo `Procfile` tenha o seguinte conteúdo:",
                    "```",
                    "web: gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 main:app",
                    "```",
                    "4. Faça login no Heroku CLI:",
                    "```bash",
                    "heroku login",
                    "```",
                    "5. Crie um novo aplicativo Heroku:",
                    "```bash",
                    "heroku create seu-app-linkstack",
                    "```",
                    "6. Provisione um banco de dados PostgreSQL:",
                    "```bash",
                    "heroku addons:create heroku-postgresql:mini",
                    "```",
                    "7. Configure as variáveis de ambiente:",
                    "```bash",
                    "heroku config:set SESSION_SECRET=sua_chave_secreta_aqui",
                    "```",
                    "8. Faça o deploy do aplicativo:",
                    "```bash",
                    "git add .",
                    "git commit -m \"Preparado para deploy no Heroku\"",
                    "git push heroku main",
                    "```"
                ]
            },
            {
                "title": "Verificação",
                "content": [
                    "1. Abra o aplicativo em seu navegador:",
                    "```bash",
                    "heroku open",
                    "```",
                    "2. Verifique os logs para depuração:",
                    "```bash",
                    "heroku logs --tail",
                    "```"
                ]
            }
        ]
    },
    "en": {
        "title": "Heroku Deployment Guide",
        "intro": "This guide explains how to deploy the LinkStack application on Heroku.",
        "sections": [
            {
                "title": "Prerequisites",
                "content": [
                    "Heroku account",
                    "Heroku CLI installed",
                    "Git installed",
                    "Git repository with the application code"
                ]
            },
            {
                "title": "Deployment Configuration",
                "content": [
                    "1. Create a `runtime.txt` file in the project root with the following content:",
                    "```",
                    "python-3.11.0",
                    "```",
                    "2. Rename the `REQUISITOS.txt` file to `requirements.txt`:",
                    "```bash",
                    "git mv REQUISITOS.txt requirements.txt",
                    "```",
                    "3. Make sure the `Procfile` has the following content:",
                    "```",
                    "web: gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 main:app",
                    "```",
                    "4. Login to the Heroku CLI:",
                    "```bash",
                    "heroku login",
                    "```",
                    "5. Create a new Heroku application:",
                    "```bash",
                    "heroku create your-linkstack-app",
                    "```",
                    "6. Provision a PostgreSQL database:",
                    "```bash",
                    "heroku addons:create heroku-postgresql:mini",
                    "```",
                    "7. Configure environment variables:",
                    "```bash",
                    "heroku config:set SESSION_SECRET=your_secret_key_here",
                    "```",
                    "8. Deploy the application:",
                    "```bash",
                    "git add .",
                    "git commit -m \"Prepared for Heroku deployment\"",
                    "git push heroku main",
                    "```"
                ]
            },
            {
                "title": "Verification",
                "content": [
                    "1. Open the application in your browser:",
                    "```bash",
                    "heroku open",
                    "```",
                    "2. Check logs for debugging:",
                    "```bash",
                    "heroku logs --tail",
                    "```"
                ]
            }
        ]
    }
}

# Templates para Docker
DOCKER_TEMPLATES = {
    "pt": {
        "title": "Guia de Deploy com Docker",
        "intro": "Este guia explica como implantar a aplicação LinkStack usando Docker.",
        "sections": [
            {
                "title": "Pré-requisitos",
                "content": [
                    "Docker instalado",
                    "Docker Compose instalado (opcional, mas recomendado)",
                    "Repositório Git com o código da aplicação"
                ]
            },
            {
                "title": "Configuração do Deploy",
                "content": [
                    "1. Certifique-se de que o Dockerfile está configurado corretamente:",
                    "```bash",
                    "# Verifique se está usando o Dockerfile.flask como base",
                    "cat Dockerfile.flask",
                    "```",
                    "2. Crie um arquivo `docker-compose.yml` na raiz do projeto:",
                    "```yaml",
                    "version: '3'",
                    "",
                    "services:",
                    "  app:",
                    "    build: .",
                    "    ports:",
                    "      - \"5000:5000\"",
                    "    depends_on:",
                    "      - db",
                    "    environment:",
                    "      - DATABASE_URL=postgresql://postgres:senha@db:5432/postgres",
                    "      - PGHOST=db",
                    "      - PGPORT=5432",
                    "      - PGUSER=postgres",
                    "      - PGPASSWORD=senha",
                    "      - PGDATABASE=postgres",
                    "      - SESSION_SECRET=sua_chave_secreta_aqui",
                    "",
                    "  db:",
                    "    image: postgres:13",
                    "    volumes:",
                    "      - postgres_data:/var/lib/postgresql/data",
                    "    environment:",
                    "      - POSTGRES_PASSWORD=senha",
                    "      - POSTGRES_USER=postgres",
                    "      - POSTGRES_DB=postgres",
                    "",
                    "volumes:",
                    "  postgres_data:",
                    "```",
                    "3. Construa e inicie os contêineres:",
                    "```bash",
                    "docker-compose up -d",
                    "```"
                ]
            },
            {
                "title": "Verificação",
                "content": [
                    "1. Verifique se os contêineres estão em execução:",
                    "```bash",
                    "docker-compose ps",
                    "```",
                    "2. Acesse a aplicação em seu navegador:",
                    "```",
                    "http://localhost:5000",
                    "```",
                    "3. Verifique os logs para depuração:",
                    "```bash",
                    "docker-compose logs -f app",
                    "```"
                ]
            },
            {
                "title": "Deploy em Produção",
                "content": [
                    "Para um ambiente de produção, é recomendável usar um proxy reverso como Nginx ou Traefik para lidar com o tráfego HTTPS.",
                    "1. Adicione um serviço Nginx ao seu `docker-compose.yml`:",
                    "```yaml",
                    "  nginx:",
                    "    image: nginx:alpine",
                    "    ports:",
                    "      - \"80:80\"",
                    "      - \"443:443\"",
                    "    volumes:",
                    "      - ./nginx.conf:/etc/nginx/conf.d/default.conf",
                    "      - ./certbot/conf:/etc/letsencrypt",
                    "      - ./certbot/www:/var/www/certbot",
                    "    depends_on:",
                    "      - app",
                    "```",
                    "2. Configure o Nginx para encaminhar o tráfego para o aplicativo Flask."
                ]
            }
        ]
    },
    "en": {
        "title": "Docker Deployment Guide",
        "intro": "This guide explains how to deploy the LinkStack application using Docker.",
        "sections": [
            {
                "title": "Prerequisites",
                "content": [
                    "Docker installed",
                    "Docker Compose installed (optional, but recommended)",
                    "Git repository with the application code"
                ]
            },
            {
                "title": "Deployment Configuration",
                "content": [
                    "1. Make sure the Dockerfile is correctly configured:",
                    "```bash",
                    "# Check if you're using Dockerfile.flask as a base",
                    "cat Dockerfile.flask",
                    "```",
                    "2. Create a `docker-compose.yml` file in the project root:",
                    "```yaml",
                    "version: '3'",
                    "",
                    "services:",
                    "  app:",
                    "    build: .",
                    "    ports:",
                    "      - \"5000:5000\"",
                    "    depends_on:",
                    "      - db",
                    "    environment:",
                    "      - DATABASE_URL=postgresql://postgres:password@db:5432/postgres",
                    "      - PGHOST=db",
                    "      - PGPORT=5432",
                    "      - PGUSER=postgres",
                    "      - PGPASSWORD=password",
                    "      - PGDATABASE=postgres",
                    "      - SESSION_SECRET=your_secret_key_here",
                    "",
                    "  db:",
                    "    image: postgres:13",
                    "    volumes:",
                    "      - postgres_data:/var/lib/postgresql/data",
                    "    environment:",
                    "      - POSTGRES_PASSWORD=password",
                    "      - POSTGRES_USER=postgres",
                    "      - POSTGRES_DB=postgres",
                    "",
                    "volumes:",
                    "  postgres_data:",
                    "```",
                    "3. Build and start the containers:",
                    "```bash",
                    "docker-compose up -d",
                    "```"
                ]
            },
            {
                "title": "Verification",
                "content": [
                    "1. Check if the containers are running:",
                    "```bash",
                    "docker-compose ps",
                    "```",
                    "2. Access the application in your browser:",
                    "```",
                    "http://localhost:5000",
                    "```",
                    "3. Check logs for debugging:",
                    "```bash",
                    "docker-compose logs -f app",
                    "```"
                ]
            },
            {
                "title": "Production Deployment",
                "content": [
                    "For a production environment, it's recommended to use a reverse proxy like Nginx or Traefik to handle HTTPS traffic.",
                    "1. Add an Nginx service to your `docker-compose.yml`:",
                    "```yaml",
                    "  nginx:",
                    "    image: nginx:alpine",
                    "    ports:",
                    "      - \"80:80\"",
                    "      - \"443:443\"",
                    "    volumes:",
                    "      - ./nginx.conf:/etc/nginx/conf.d/default.conf",
                    "      - ./certbot/conf:/etc/letsencrypt",
                    "      - ./certbot/www:/var/www/certbot",
                    "    depends_on:",
                    "      - app",
                    "```",
                    "2. Configure Nginx to forward traffic to the Flask application."
                ]
            }
        ]
    }
}

# Templates para AWS
AWS_TEMPLATES = {
    "pt": {
        "title": "Guia de Deploy na AWS",
        "intro": "Este guia explica como implantar a aplicação LinkStack na Amazon Web Services (AWS).",
        "sections": [
            {
                "title": "Pré-requisitos",
                "content": [
                    "Conta na AWS",
                    "AWS CLI configurado",
                    "Docker instalado (para criar a imagem)",
                    "Repositório no Amazon ECR criado"
                ]
            },
            {
                "title": "Preparação da Aplicação",
                "content": [
                    "1. Certifique-se de que o Dockerfile.flask esteja configurado corretamente",
                    "2. Construa a imagem Docker:",
                    "```bash",
                    "docker build -f Dockerfile.flask -t linkstack-app .",
                    "```"
                ]
            },
            {
                "title": "Deploy no Amazon ECS",
                "content": [
                    "1. Faça login no Amazon ECR:",
                    "```bash",
                    "aws ecr get-login-password --region sua-regiao | docker login --username AWS --password-stdin seu-id-conta.dkr.ecr.sua-regiao.amazonaws.com",
                    "```",
                    "2. Marque a imagem Docker para o ECR:",
                    "```bash",
                    "docker tag linkstack-app:latest seu-id-conta.dkr.ecr.sua-regiao.amazonaws.com/linkstack-app:latest",
                    "```",
                    "3. Envie a imagem para o ECR:",
                    "```bash",
                    "docker push seu-id-conta.dkr.ecr.sua-regiao.amazonaws.com/linkstack-app:latest",
                    "```",
                    "4. Crie um cluster ECS (se ainda não tiver um):",
                    "```bash",
                    "aws ecs create-cluster --cluster-name linkstack-cluster",
                    "```",
                    "5. Crie uma definição de tarefa para o serviço:",
                    "```bash",
                    "# Crie um arquivo de definição de tarefa (task-definition.json)",
                    "aws ecs register-task-definition --cli-input-json file://task-definition.json",
                    "```",
                    "6. Crie um serviço ECS para executar a tarefa:",
                    "```bash",
                    "aws ecs create-service --cluster linkstack-cluster --service-name linkstack-service --task-definition linkstack-task --desired-count 1 --launch-type FARGATE --network-configuration \"awsvpcConfiguration={subnets=[subnet-12345678],securityGroups=[sg-12345678],assignPublicIp=ENABLED}\"",
                    "```"
                ]
            },
            {
                "title": "Configuração do Banco de Dados",
                "content": [
                    "1. Crie uma instância RDS PostgreSQL:",
                    "```bash",
                    "aws rds create-db-instance --db-instance-identifier linkstack-db --db-instance-class db.t3.micro --engine postgres --master-username postgres --master-user-password sua_senha_segura --allocated-storage 20",
                    "```",
                    "2. Atualize as variáveis de ambiente no serviço ECS para apontar para o RDS."
                ]
            },
            {
                "title": "Configuração de Load Balancer",
                "content": [
                    "1. Crie um Application Load Balancer (ALB):",
                    "```bash",
                    "aws elbv2 create-load-balancer --name linkstack-lb --subnets subnet-12345678 subnet-87654321 --security-groups sg-12345678",
                    "```",
                    "2. Crie um grupo de destino:",
                    "```bash",
                    "aws elbv2 create-target-group --name linkstack-tg --protocol HTTP --port 5000 --vpc-id vpc-12345678 --target-type ip --health-check-path / --health-check-interval-seconds 30",
                    "```",
                    "3. Crie um listener:",
                    "```bash",
                    "aws elbv2 create-listener --load-balancer-arn arn:aws:elasticloadbalancing:sua-regiao:seu-id-conta:loadbalancer/app/linkstack-lb/1234567890abcdef --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:sua-regiao:seu-id-conta:targetgroup/linkstack-tg/1234567890abcdef",
                    "```",
                    "4. Atualize o serviço ECS para usar o load balancer."
                ]
            }
        ]
    },
    "en": {
        "title": "AWS Deployment Guide",
        "intro": "This guide explains how to deploy the LinkStack application on Amazon Web Services (AWS).",
        "sections": [
            {
                "title": "Prerequisites",
                "content": [
                    "AWS account",
                    "Configured AWS CLI",
                    "Docker installed (to build the image)",
                    "Created repository in Amazon ECR"
                ]
            },
            {
                "title": "Application Preparation",
                "content": [
                    "1. Make sure Dockerfile.flask is correctly configured",
                    "2. Build the Docker image:",
                    "```bash",
                    "docker build -f Dockerfile.flask -t linkstack-app .",
                    "```"
                ]
            },
            {
                "title": "Deployment on Amazon ECS",
                "content": [
                    "1. Log in to Amazon ECR:",
                    "```bash",
                    "aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com",
                    "```",
                    "2. Tag the Docker image for ECR:",
                    "```bash",
                    "docker tag linkstack-app:latest your-account-id.dkr.ecr.your-region.amazonaws.com/linkstack-app:latest",
                    "```",
                    "3. Push the image to ECR:",
                    "```bash",
                    "docker push your-account-id.dkr.ecr.your-region.amazonaws.com/linkstack-app:latest",
                    "```",
                    "4. Create an ECS cluster (if you don't have one):",
                    "```bash",
                    "aws ecs create-cluster --cluster-name linkstack-cluster",
                    "```",
                    "5. Create a task definition for the service:",
                    "```bash",
                    "# Create a task definition file (task-definition.json)",
                    "aws ecs register-task-definition --cli-input-json file://task-definition.json",
                    "```",
                    "6. Create an ECS service to run the task:",
                    "```bash",
                    "aws ecs create-service --cluster linkstack-cluster --service-name linkstack-service --task-definition linkstack-task --desired-count 1 --launch-type FARGATE --network-configuration \"awsvpcConfiguration={subnets=[subnet-12345678],securityGroups=[sg-12345678],assignPublicIp=ENABLED}\"",
                    "```"
                ]
            },
            {
                "title": "Database Configuration",
                "content": [
                    "1. Create an RDS PostgreSQL instance:",
                    "```bash",
                    "aws rds create-db-instance --db-instance-identifier linkstack-db --db-instance-class db.t3.micro --engine postgres --master-username postgres --master-user-password your_secure_password --allocated-storage 20",
                    "```",
                    "2. Update the environment variables in the ECS service to point to the RDS."
                ]
            },
            {
                "title": "Load Balancer Configuration",
                "content": [
                    "1. Create an Application Load Balancer (ALB):",
                    "```bash",
                    "aws elbv2 create-load-balancer --name linkstack-lb --subnets subnet-12345678 subnet-87654321 --security-groups sg-12345678",
                    "```",
                    "2. Create a target group:",
                    "```bash",
                    "aws elbv2 create-target-group --name linkstack-tg --protocol HTTP --port 5000 --vpc-id vpc-12345678 --target-type ip --health-check-path / --health-check-interval-seconds 30",
                    "```",
                    "3. Create a listener:",
                    "```bash",
                    "aws elbv2 create-listener --load-balancer-arn arn:aws:elasticloadbalancing:your-region:your-account-id:loadbalancer/app/linkstack-lb/1234567890abcdef --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:your-region:your-account-id:targetgroup/linkstack-tg/1234567890abcdef",
                    "```",
                    "4. Update the ECS service to use the load balancer."
                ]
            }
        ]
    }
}

# Templates para Vercel
VERCEL_TEMPLATES = {
    "pt": {
        "title": "Guia de Deploy na Vercel",
        "intro": "Este guia explica como implantar a parte frontend da aplicação LinkStack na Vercel.",
        "sections": [
            {
                "title": "Pré-requisitos",
                "content": [
                    "Conta na Vercel",
                    "Vercel CLI instalado",
                    "Repositório Git com o código da aplicação frontend"
                ]
            },
            {
                "title": "Configuração do Deploy",
                "content": [
                    "1. Faça login na Vercel CLI:",
                    "```bash",
                    "vercel login",
                    "```",
                    "2. Crie um arquivo `vercel.json` na raiz do projeto:",
                    "```json",
                    "{",
                    "  \"version\": 2,",
                    "  \"builds\": [",
                    "    { \"src\": \"package.json\", \"use\": \"@vercel/static-build\" }",
                    "  ],",
                    "  \"routes\": [",
                    "    { \"src\": \"/(.*)\", \"dest\": \"/index.html\" }",
                    "  ],",
                    "  \"env\": {",
                    "    \"API_URL\": \"https://seu-backend-api.com\"",
                    "  }",
                    "}",
                    "```",
                    "3. Certifique-se de que seu package.json tem um script de build:",
                    "```json",
                    "\"scripts\": {",
                    "  \"build\": \"react-scripts build\"",
                    "}",
                    "```",
                    "4. Faça o deploy para a Vercel:",
                    "```bash",
                    "vercel",
                    "```",
                    "5. Para fazer o deploy para produção:",
                    "```bash",
                    "vercel --prod",
                    "```"
                ]
            },
            {
                "title": "Configuração de Variáveis de Ambiente",
                "content": [
                    "1. No painel da Vercel, acesse seu projeto",
                    "2. Vá para a guia 'Settings' > 'Environment Variables'",
                    "3. Adicione as variáveis de ambiente necessárias, como a URL da API do backend"
                ]
            },
            {
                "title": "Integração com o Backend",
                "content": [
                    "1. Certifique-se de que seu backend está acessível publicamente",
                    "2. Configure o CORS no backend para permitir solicitações da URL da Vercel",
                    "3. Atualize a URL da API no frontend para apontar para o backend implantado"
                ]
            },
            {
                "title": "Configuração de Domínio Personalizado",
                "content": [
                    "1. No painel da Vercel, acesse seu projeto",
                    "2. Vá para a guia 'Settings' > 'Domains'",
                    "3. Adicione seu domínio personalizado",
                    "4. Siga as instruções para configurar os registros DNS"
                ]
            }
        ]
    },
    "en": {
        "title": "Vercel Deployment Guide",
        "intro": "This guide explains how to deploy the frontend part of the LinkStack application on Vercel.",
        "sections": [
            {
                "title": "Prerequisites",
                "content": [
                    "Vercel account",
                    "Vercel CLI installed",
                    "Git repository with the frontend application code"
                ]
            },
            {
                "title": "Deployment Configuration",
                "content": [
                    "1. Log in to the Vercel CLI:",
                    "```bash",
                    "vercel login",
                    "```",
                    "2. Create a `vercel.json` file in the project root:",
                    "```json",
                    "{",
                    "  \"version\": 2,",
                    "  \"builds\": [",
                    "    { \"src\": \"package.json\", \"use\": \"@vercel/static-build\" }",
                    "  ],",
                    "  \"routes\": [",
                    "    { \"src\": \"/(.*)\", \"dest\": \"/index.html\" }",
                    "  ],",
                    "  \"env\": {",
                    "    \"API_URL\": \"https://your-backend-api.com\"",
                    "  }",
                    "}",
                    "```",
                    "3. Make sure your package.json has a build script:",
                    "```json",
                    "\"scripts\": {",
                    "  \"build\": \"react-scripts build\"",
                    "}",
                    "```",
                    "4. Deploy to Vercel:",
                    "```bash",
                    "vercel",
                    "```",
                    "5. To deploy to production:",
                    "```bash",
                    "vercel --prod",
                    "```"
                ]
            },
            {
                "title": "Environment Variables Configuration",
                "content": [
                    "1. In the Vercel dashboard, access your project",
                    "2. Go to the 'Settings' > 'Environment Variables' tab",
                    "3. Add the necessary environment variables, such as the backend API URL"
                ]
            },
            {
                "title": "Backend Integration",
                "content": [
                    "1. Make sure your backend is publicly accessible",
                    "2. Configure CORS in the backend to allow requests from the Vercel URL",
                    "3. Update the API URL in the frontend to point to the deployed backend"
                ]
            },
            {
                "title": "Custom Domain Configuration",
                "content": [
                    "1. In the Vercel dashboard, access your project",
                    "2. Go to the 'Settings' > 'Domains' tab",
                    "3. Add your custom domain",
                    "4. Follow the instructions to configure the DNS records"
                ]
            }
        ]
    }
}

# Função para carregar todos os templates
def load_all_templates():
    templates = {}
    
    # Adicionando templates do EasyPanel
    templates["easypanel"] = {
        "pt": {
            "title": "Guia de Deploy no EasyPanel",
            "intro": "Este guia explica como implantar a aplicação LinkStack no EasyPanel.",
            "sections": [
                {
                    "title": "Pré-requisitos",
                    "content": [
                        "Conta no EasyPanel",
                        "Repositório Git com o código da aplicação",
                        "Banco de dados PostgreSQL configurado"
                    ]
                },
                {
                    "title": "Configuração do Deploy",
                    "content": [
                        "1. Renomeie o arquivo `Dockerfile.flask` para `Dockerfile`:",
                        "```bash",
                        "git mv Dockerfile Dockerfile.original",
                        "git mv Dockerfile.flask Dockerfile",
                        "git add .",
                        "git commit -m \"Preparar Dockerfile para deploy\"",
                        "git push",
                        "```",
                        "2. No EasyPanel, crie um novo serviço Custom.",
                        "3. Configure o serviço para usar o Dockerfile.",
                        "4. Configure as variáveis de ambiente necessárias:"
                    ]
                },
                {
                    "title": "Variáveis de Ambiente",
                    "content": [
                        "**IMPORTANTE**: Escolha UMA das duas configurações abaixo:",
                        "",
                        "**Opção 1: Usando banco de dados PostgreSQL local no EasyPanel**:",
                        "```",
                        "# Nome do host deve ser o nome do serviço PostgreSQL no EasyPanel",
                        "DATABASE_URL=postgresql://postgres:senha@nome-servico-postgres:5432/postgres",
                        "PGHOST=nome-servico-postgres",
                        "PGPORT=5432",
                        "PGUSER=postgres",
                        "PGPASSWORD=sua_senha_segura",
                        "PGDATABASE=postgres",
                        "SESSION_SECRET=sua_chave_secreta_aqui",
                        "```",
                        "",
                        "**Opção 2: Usando banco de dados externo (Neon, Supabase, etc.)**:",
                        "```",
                        "# Use a URL fornecida pelo provedor de banco de dados",
                        "DATABASE_URL=postgresql://user:senha@host-externo.provedor.com:5432/dbname?sslmode=require",
                        "SESSION_SECRET=sua_chave_secreta_aqui",
                        "```",
                        "",
                        "> **ATENÇÃO**: O erro \"container is not running\" geralmente está relacionado com problemas na conexão do banco de dados. Verifique se as credenciais estão corretas e se o host está acessível."
                    ]
                },
                {
                    "title": "Verificação",
                    "content": [
                        "1. Verifique os logs de build no EasyPanel",
                        "2. Certifique-se de que o contêiner está em execução",
                        "3. Verifique se o banco de dados está corretamente configurado",
                        "4. Teste a aplicação acessando a URL fornecida pelo EasyPanel"
                    ]
                },
                {
                    "title": "Solução de Problemas",
                    "content": [
                        "### Erro: \"container is not running\"",
                        "",
                        "Se você encontrar esse erro, siga estas etapas:",
                        "",
                        "1. **Verifique os logs do contêiner**:",
                        "   - No EasyPanel, acesse os logs do serviço para identificar o problema.",
                        "",
                        "2. **Problemas comuns e soluções**:",
                        "",
                        "   **Problema de conexão com banco de dados**:",
                        "   - Verifique se o nome do host está correto (deve ser o nome do serviço no EasyPanel)",
                        "   - Confirme que as credenciais do banco de dados estão corretas",
                        "   - Para Neon/Supabase, verifique se `sslmode=require` está incluído na URL",
                        "",
                        "   **Problemas com dependências**:",
                        "   - Verifique se o arquivo REQUISITOS.txt contém todas as dependências necessárias",
                        "   - Certifique-se de que `gunicorn` está incluído nas dependências",
                        "",
                        "3. **Scripts de diagnóstico**:",
                        "   - O Dockerfile atualizado inclui scripts de diagnóstico que ajudam a identificar problemas",
                        "   - Verifique os logs para mensagens detalhadas sobre os testes de conexão com o banco de dados"
                    ]
                }
            ]
        },
        "en": {
            "title": "EasyPanel Deployment Guide",
            "intro": "This guide explains how to deploy the LinkStack application on EasyPanel.",
            "sections": [
                {
                    "title": "Prerequisites",
                    "content": [
                        "EasyPanel account",
                        "Git repository with the application code",
                        "Configured PostgreSQL database"
                    ]
                },
                {
                    "title": "Deployment Configuration",
                    "content": [
                        "1. Rename the `Dockerfile.flask` file to `Dockerfile`:",
                        "```bash",
                        "git mv Dockerfile Dockerfile.original",
                        "git mv Dockerfile.flask Dockerfile",
                        "git add .",
                        "git commit -m \"Prepare Dockerfile for deployment\"",
                        "git push",
                        "```",
                        "2. In EasyPanel, create a new Custom service.",
                        "3. Configure the service to use the Dockerfile.",
                        "4. Configure the necessary environment variables:"
                    ]
                },
                {
                    "title": "Environment Variables",
                    "content": [
                        "**IMPORTANT**: Choose ONE of the two configurations below:",
                        "",
                        "**Option 1: Using local PostgreSQL database in EasyPanel**:",
                        "```",
                        "# Host name must be the PostgreSQL service name in EasyPanel",
                        "DATABASE_URL=postgresql://postgres:password@postgres-service-name:5432/postgres",
                        "PGHOST=postgres-service-name",
                        "PGPORT=5432",
                        "PGUSER=postgres",
                        "PGPASSWORD=your_secure_password",
                        "PGDATABASE=postgres",
                        "SESSION_SECRET=your_secret_key_here",
                        "```",
                        "",
                        "**Option 2: Using external database (Neon, Supabase, etc.)**:",
                        "```",
                        "# Use the URL provided by the database provider",
                        "DATABASE_URL=postgresql://user:password@external-host.provider.com:5432/dbname?sslmode=require",
                        "SESSION_SECRET=your_secret_key_here",
                        "```",
                        "",
                        "> **ATTENTION**: The \"container is not running\" error is usually related to database connection issues. Make sure the credentials are correct and the host is accessible."
                    ]
                },
                {
                    "title": "Verification",
                    "content": [
                        "1. Check the build logs in EasyPanel",
                        "2. Make sure the container is running",
                        "3. Verify that the database is properly configured",
                        "4. Test the application by accessing the URL provided by EasyPanel"
                    ]
                }
            ]
        }
    }
    
    # Adicionando templates do Heroku
    templates["heroku"] = HEROKU_TEMPLATES
    
    # Adicionando templates do Docker
    templates["docker"] = DOCKER_TEMPLATES
    
    # Adicionando templates do AWS
    templates["aws"] = AWS_TEMPLATES
    
    # Adicionando templates do Vercel
    templates["vercel"] = VERCEL_TEMPLATES
    
    return templates

# Exporta os templates para uso em outros módulos
ALL_TEMPLATES = load_all_templates()