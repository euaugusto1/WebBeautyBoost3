# Guia de Deploy - LinkStack React

Este guia fornece instruções detalhadas para implantar a aplicação LinkStack React em várias plataformas de hospedagem.

## Índice

1. [Deploy no Vercel](#deploy-no-vercel)
2. [Deploy no Netlify](#deploy-no-netlify)
3. [Deploy no Heroku](#deploy-no-heroku)
4. [Deploy com AWS Fargate](#deploy-com-aws-fargate)
5. [Deploy no EasyPanel](#deploy-no-easypanel)
6. [Configurações Gerais](#configurações-gerais)

---

## Deploy no Vercel

O Vercel é uma plataforma excelente para aplicações React, oferecendo CDN global e integração contínua.

### Pré-requisitos

1. Uma conta no [Vercel](https://vercel.com)
2. Seu código em um repositório Git (GitHub, GitLab ou Bitbucket)

### Passos para Deploy

1. **Faça login no Vercel Dashboard**:
   - Acesse https://vercel.com e faça login com sua conta

2. **Importe o Projeto**:
   - Clique em "Import Project"
   - Selecione "Import Git Repository" e conecte sua conta do GitHub, GitLab ou Bitbucket
   - Selecione o repositório do LinkStack React

3. **Configure o Projeto**:
   - **Nome do Projeto**: `linkstack-react` (ou outro de sua escolha)
   - **Framework Preset**: Selecione "Vite"
   - **Build Command**: `npm run build` (ou `vite build` se estiver usando Vite)
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

4. **Variáveis de Ambiente**:
   - Clique em "Environment Variables"
   - Adicione as seguintes variáveis:
     - `VITE_API_URL`: URL do seu backend (ex: `https://api.seu-dominio.com`)
     - `VITE_ENVIRONMENT`: `production`
     - `VITE_MOCK_DATA`: `false`

5. **Clique em "Deploy"**:
   - O Vercel iniciará automaticamente a construção e implantação do seu projeto
   - Após a conclusão, você receberá uma URL para acessar seu site

### Configurações Adicionais

1. **Domínio Personalizado**:
   - No dashboard do projeto, vá para "Settings" > "Domains"
   - Adicione seu domínio personalizado e siga as instruções para configuração de DNS

2. **Comportamento de Fallback para SPA**:
   - No dashboard do projeto, vá para "Settings" > "General"
   - Na seção "Rewrites", adicione uma regra para redirecionar todas as rotas para o index.html

```
Source: /(.*) 
Destination: /index.html
```

---

## Deploy no Netlify

O Netlify oferece recursos semelhantes ao Vercel, com foco em sites estáticos e aplicações de frontend.

### Pré-requisitos

1. Uma conta no [Netlify](https://netlify.com)
2. Seu código em um repositório Git (GitHub, GitLab ou Bitbucket)

### Passos para Deploy

1. **Faça login no Netlify Dashboard**:
   - Acesse https://app.netlify.com e faça login com sua conta

2. **Adicione um Novo Site**:
   - Clique em "New site from Git"
   - Selecione o provedor de Git onde seu repositório está hospedado
   - Autorize o Netlify se necessário

3. **Configure o Deploy**:
   - Selecione o repositório do LinkStack React
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

4. **Variáveis de Ambiente**:
   - Vá para "Site settings" > "Build & deploy" > "Environment"
   - Adicione as mesmas variáveis mencionadas no deploy do Vercel

5. **Clique em "Deploy Site"**:
   - O Netlify iniciará o processo de build e deploy

### Configurações Adicionais

1. **Redirecionamentos para SPA**:
   - Crie um arquivo `_redirects` na pasta `public` com o seguinte conteúdo:
   ```
   /* /index.html 200
   ```

2. **Domínio Personalizado**:
   - No dashboard do site, vá para "Site settings" > "Domain management"
   - Clique em "Add custom domain" e siga as instruções

---

## Deploy no Heroku

Embora o Heroku seja mais conhecido por hospedagem de backend, ele também pode hospedar aplicações React eficientemente.

### Pré-requisitos

1. Uma conta no [Heroku](https://heroku.com)
2. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado

### Passos para Deploy

1. **Crie um Servidor Estático**:
   - Adicione o pacote `serve` como dependência:
   ```bash
   npm install --save serve
   ```

2. **Configure o Script de Início**:
   - No `package.json`, adicione:
   ```json
   "scripts": {
     "start": "serve -s dist",
     "heroku-postbuild": "npm run build"
   }
   ```

3. **Crie um Arquivo `Procfile`**:
   - Na raiz do projeto, crie um arquivo chamado `Procfile` com:
   ```
   web: npm start
   ```

4. **Crie um Aplicativo no Heroku**:
   ```bash
   heroku login
   heroku create linkstack-react
   ```

5. **Configure Variáveis de Ambiente**:
   ```bash
   heroku config:set VITE_API_URL=https://sua-api.com
   heroku config:set VITE_ENVIRONMENT=production
   heroku config:set VITE_MOCK_DATA=false
   ```

6. **Faça o Deploy**:
   ```bash
   git add .
   git commit -m "Configuração para deploy no Heroku"
   git push heroku master
   ```

7. **Abra o Aplicativo**:
   ```bash
   heroku open
   ```

### Alternativa: Usando o Buildpack de Node.js e Nginx

```bash
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nginx
```

---

## Deploy com AWS Fargate

AWS Fargate permite executar contêineres Docker sem gerenciar servidores, ideal para aplicações React containerizadas.

### Pré-requisitos

1. Uma conta [AWS](https://aws.amazon.com)
2. [AWS CLI](https://aws.amazon.com/cli/) configurado
3. Docker instalado

### Passos para Deploy

1. **Crie um Repositório ECR**:
   ```bash
   aws ecr create-repository --repository-name linkstack-react
   ```

2. **Autentique o Docker com ECR**:
   ```bash
   aws ecr get-login-password | docker login --username AWS --password-stdin {seu-id-aws}.dkr.ecr.{região}.amazonaws.com
   ```

3. **Construa e Envie a Imagem Docker**:
   ```bash
   docker build -t linkstack-react .
   docker tag linkstack-react:latest {seu-id-aws}.dkr.ecr.{região}.amazonaws.com/linkstack-react:latest
   docker push {seu-id-aws}.dkr.ecr.{região}.amazonaws.com/linkstack-react:latest
   ```

4. **Crie um Cluster Fargate**:
   - Use o console AWS para criar um cluster Fargate
   - Ou use AWS CLI:
   ```bash
   aws ecs create-cluster --cluster-name linkstack-cluster
   ```

5. **Crie uma Definição de Tarefa**:
   - Crie um arquivo `task-definition.json`:
   ```json
   {
     "family": "linkstack-task",
     "executionRoleArn": "arn:aws:iam::{seu-id-aws}:role/ecsTaskExecutionRole",
     "networkMode": "awsvpc",
     "containerDefinitions": [
       {
         "name": "linkstack-react",
         "image": "{seu-id-aws}.dkr.ecr.{região}.amazonaws.com/linkstack-react:latest",
         "essential": true,
         "portMappings": [
           {
             "containerPort": 80,
             "hostPort": 80,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "VITE_API_URL",
             "value": "https://sua-api.com"
           },
           {
             "name": "VITE_ENVIRONMENT",
             "value": "production"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/linkstack-task",
             "awslogs-region": "{região}",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ],
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512"
   }
   ```

6. **Registre a Definição de Tarefa**:
   ```bash
   aws ecs register-task-definition --cli-input-json file://task-definition.json
   ```

7. **Crie um Serviço ECS**:
   ```bash
   aws ecs create-service \
     --cluster linkstack-cluster \
     --service-name linkstack-service \
     --task-definition linkstack-task:1 \
     --desired-count 1 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxx],securityGroups=[sg-xxxxxxxx],assignPublicIp=ENABLED}" \
     --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:{região}:{seu-id-aws}:targetgroup/linkstack-tg/xxxxxxxx,containerName=linkstack-react,containerPort=80"
   ```

8. **Configure um Application Load Balancer** (opcional mas recomendado):
   - Use o console AWS para criar um ALB
   - Configure o grupo-alvo para apontar para o serviço Fargate

---

## Deploy no EasyPanel

O EasyPanel é uma solução simplificada para gerenciar aplicações containerizadas.

### Pré-requisitos

1. Um servidor com EasyPanel instalado
2. Acesso administrativo ao painel EasyPanel

### Passos para Deploy

1. **Adicione um Novo Serviço no EasyPanel**:
   - Faça login no painel administrativo do EasyPanel
   - Vá para "Serviços" e clique em "Adicionar Serviço"

2. **Configure o Serviço**:
   - **Nome**: `linkstack-react`
   - **Tipo**: Custom
   - Selecione uma das opções:
     - **Opção A**: Usar uma imagem Docker:
       - Imagem: `linkstack-react` (se você tiver construído localmente)
       - Porta: `80`
     - **Opção B**: Configuração via Git:
       - URL do repositório: seu repositório Git
       - Branch: `main` (ou o que você estiver usando)
       - **Builder**: `heroku/buildpacks:20` (ao invés de heroku/builder:24)
       - Build Command: `npm install && npm run build`
       - Start Command: `npm start`

3. **Configure Variáveis de Ambiente**:
   ```
   VITE_API_URL=https://sua-api.com
   VITE_ENVIRONMENT=production
   VITE_MOCK_DATA=false
   ```

4. **Configuração das Portas**:
   - Porta interna: `80`
   - Porta HTTP: `80` (ou sua preferência)
   - Ative HTTPS se disponível

5. **Clique em "Criar" para Iniciar o Deploy**:
   - O EasyPanel construirá e implantará seu aplicativo

### Solução de Problemas no EasyPanel

#### Erro com heroku/builder:24

Se você encontrar erros ao usar o `heroku/builder:24`, siga estas etapas:
1. Mude o builder para `heroku/buildpacks:20` nas configurações do serviço
2. O builder mais recente (24) pode ter incompatibilidades com algumas dependências Node.js/npm
3. Se o erro persistir, verifique os logs de construção para mensagens específicas de erro

---

## Configurações Gerais

Estas configurações se aplicam a todas as plataformas de deploy.

### Conexão com Backend

Para todas as implantações, certifique-se de configurar corretamente a variável `VITE_API_URL` para apontar para seu backend:

- Backend no mesmo domínio: `/api`
- Backend em outro domínio: URL completa, como `https://api.seu-dominio.com`

### CORS e Segurança

Se seu frontend e backend estiverem em domínios diferentes:

1. **Configure CORS no Backend**:
   - Permita solicitações do domínio do seu frontend

2. **Configure CSP (Content Security Policy)**:
   - Adicione cabeçalhos apropriados no servidor web

### SSL/TLS

Recomendamos fortemente habilitar HTTPS para todas as implantações:

- Vercel/Netlify: HTTPS é habilitado por padrão
- Heroku: HTTPS é habilitado por padrão
- AWS/EasyPanel: Configure certificados SSL usando serviços como Let's Encrypt

### Monitoramento

Considere adicionar ferramentas de monitoramento:

- Vercel Analytics
- Google Analytics
- Sentry para rastreamento de erros

---

## Referências

- [Documentação do Vite](https://vitejs.dev/guide/static-deploy.html)
- [Documentação do Vercel](https://vercel.com/docs)
- [Documentação do Netlify](https://docs.netlify.com/)
- [Documentação do Heroku](https://devcenter.heroku.com/)
- [AWS Fargate](https://aws.amazon.com/fargate/)
- [Documentação do EasyPanel](https://easypanel.io/docs)