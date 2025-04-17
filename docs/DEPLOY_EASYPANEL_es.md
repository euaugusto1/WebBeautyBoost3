# EasyPanel Despliegue Guía

Esta guía explica cómo desplegar the LinkStack application en EasyPanel.

## Requisitos previos

EasyPanel account
Git repository con el código de la aplicación
Configurado PostgreSQL database

## Despliegue Configuración

1. Rename the `Dockerfile.flask` file to `Dockerfile`:
```bash
git mv Dockerfile Dockerfile.original
git mv Dockerfile.flask Dockerfile
git add .
git commit -m "Prepare Dockerfile for deployment"
git push
```
2. In EasyPanel, create a new Custom service.
3. Configura el servicio para usar el Dockerfile.
4. Configura las variables de entorno necesarias:

## Variables de Entorno

```
DATABASE_URL=postgresql://postgres:password@linkstack-db:5432/postgres
PGHOST=linkstack-db
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_secure_password
PGDATABASE=postgres
SESSION_SECRET=your_secret_key_here
```

## Verificación

1. Check the build logs in EasyPanel
2. Asegúrate the container está en ejecución
3. Verifica that the database está correctamente configurado
4. Prueba la aplicación by accessing the URL provided by EasyPanel

