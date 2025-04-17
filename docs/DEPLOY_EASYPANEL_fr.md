# EasyPanel Déploiement Guide

Ce guide explique comment déployer the LinkStack application sur EasyPanel.

## Prérequis

EasyPanel account
Git repository avec le code de l'application
Configuré PostgreSQL database

## Déploiement Configuration

1. Rename the `Dockerfile.flask` file to `Dockerfile`:
```bash
git mv Dockerfile Dockerfile.original
git mv Dockerfile.flask Dockerfile
git add .
git commit -m "Prepare Dockerfile for deployment"
git push
```
2. In EasyPanel, create a new Custom service.
3. Configurez le service pour utiliser le Dockerfile.
4. Configurez les variables d'environnement nécessaires:

## Variables d'Environnement

```
DATABASE_URL=postgresql://postgres:password@linkstack-db:5432/postgres
PGHOST=linkstack-db
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_secure_password
PGDATABASE=postgres
SESSION_SECRET=your_secret_key_here
```

## Vérification

1. Check the build logs in EasyPanel
2. Assurez-vous the container est en cours d'exécution
3. Vérifiez that the database est correctement configuré
4. Testez l'application by accessing the URL provided by EasyPanel

