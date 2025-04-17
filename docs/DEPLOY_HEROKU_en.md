# Heroku Deployment Guide

This guide explains how to deploy the LinkStack application on Heroku.

## Prerequisites

Heroku account
Heroku CLI installed
Git installed
Git repository with the application code

## Deployment Configuration

1. Create a `runtime.txt` file in the project root with the following content:
```
python-3.11.0
```
2. Rename the `REQUISITOS.txt` file to `requirements.txt`:
```bash
git mv REQUISITOS.txt requirements.txt
```
3. Make sure the `Procfile` has the following content:
```
web: gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 main:app
```
4. Login to the Heroku CLI:
```bash
heroku login
```
5. Create a new Heroku application:
```bash
heroku create your-linkstack-app
```
6. Provision a PostgreSQL database:
```bash
heroku addons:create heroku-postgresql:mini
```
7. Configure environment variables:
```bash
heroku config:set SESSION_SECRET=your_secret_key_here
```
8. Deploy the application:
```bash
git add .
git commit -m "Prepared for Heroku deployment"
git push heroku main
```

## Verification

1. Open the application in your browser:
```bash
heroku open
```
2. Check logs for debugging:
```bash
heroku logs --tail
```

