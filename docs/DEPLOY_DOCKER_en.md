# Docker Deployment Guide

This guide explains how to deploy the LinkStack application using Docker.

## Prerequisites

Docker installed
Docker Compose installed (optional, but recommended)
Git repository with the application code

## Deployment Configuration

1. Make sure the Dockerfile is correctly configured:
```bash
# Check if you're using Dockerfile.flask as a base
cat Dockerfile.flask
```
2. Create a `docker-compose.yml` file in the project root:
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
      - DATABASE_URL=postgresql://postgres:password@db:5432/postgres
      - PGHOST=db
      - PGPORT=5432
      - PGUSER=postgres
      - PGPASSWORD=password
      - PGDATABASE=postgres
      - SESSION_SECRET=your_secret_key_here

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_USER=postgres
      - POSTGRES_DB=postgres

volumes:
  postgres_data:
```
3. Build and start the containers:
```bash
docker-compose up -d
```

## Verification

1. Check if the containers are running:
```bash
docker-compose ps
```
2. Access the application in your browser:
```
http://localhost:5000
```
3. Check logs for debugging:
```bash
docker-compose logs -f app
```

## Production Deployment

For a production environment, it's recommended to use a reverse proxy like Nginx or Traefik to handle HTTPS traffic.
1. Add an Nginx service to your `docker-compose.yml`:
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
2. Configure Nginx to forward traffic to the Flask application.

