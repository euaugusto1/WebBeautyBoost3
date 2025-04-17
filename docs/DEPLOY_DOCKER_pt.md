# Guia de Deploy com Docker

Este guia explica como implantar a aplicação LinkStack usando Docker.

## Pré-requisitos

Docker instalado
Docker Compose instalado (opcional, mas recomendado)
Repositório Git com o código da aplicação

## Configuração do Deploy

1. Certifique-se de que o Dockerfile está configurado corretamente:
```bash
# Verifique se está usando o Dockerfile.flask como base
cat Dockerfile.flask
```
2. Crie um arquivo `docker-compose.yml` na raiz do projeto:
```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://postgres:senha@db:5432/postgres
      - PGHOST=db
      - PGPORT=5432
      - PGUSER=postgres
      - PGPASSWORD=senha
      - PGDATABASE=postgres
      - SESSION_SECRET=sua_chave_secreta_aqui

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=senha
      - POSTGRES_USER=postgres
      - POSTGRES_DB=postgres

volumes:
  postgres_data:
```
3. Construa e inicie os contêineres:
```bash
docker-compose up -d
```

## Verificação

1. Verifique se os contêineres estão em execução:
```bash
docker-compose ps
```
2. Acesse a aplicação em seu navegador:
```
http://localhost:5000
```
3. Verifique os logs para depuração:
```bash
docker-compose logs -f app
```

## Deploy em Produção

Para um ambiente de produção, é recomendável usar um proxy reverso como Nginx ou Traefik para lidar com o tráfego HTTPS.
1. Adicione um serviço Nginx ao seu `docker-compose.yml`:
```yaml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - app
```
2. Configure o Nginx para encaminhar o tráfego para o aplicativo Flask.

