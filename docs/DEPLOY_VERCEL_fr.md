# Vercel Déploiement Guide

Ce guide explique comment déployer the frontend part of the LinkStack application sur Vercel.

## Prérequis

Vercel account
Vercel CLI installed
Git repository with the frontend application code

## Déploiement Configuration

1. Log in to the Vercel CLI:
```bash
vercel login
```
2. Create a `vercel.json` file in the project root:
```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "API_URL": "https://your-backend-api.com"
  }
}
```
3. Assurez-vous your package.json has a build script:
```json
"scripts": {
  "build": "react-scripts build"
}
```
4. Deploy to Vercel:
```bash
vercel
```
5. To deploy to production:
```bash
vercel --prod
```

## Variables d'Environnement Configuration

1. In the Vercel dashboard, access your project
2. Go to the 'Settings' > 'Variables d'Environnement' tab
3. Add the necessary environment variables, such as the backend API URL

## Backend Integration

1. Assurez-vous your backend is publicly accessible
2. Configure CORS in the backend to allow requests from the Vercel URL
3. Update the API URL in the frontend to point to the deployed backend

## Custom Domain Configuration

1. In the Vercel dashboard, access your project
2. Go to the 'Settings' > 'Domains' tab
3. Add your custom domain
4. Follow the instructions to configure the DNS records

