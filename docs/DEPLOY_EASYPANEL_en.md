# EasyPanel Deployment Guide

This guide explains how to deploy the LinkStack application on EasyPanel.

## Prerequisites

EasyPanel account
Git repository with the application code
Configured PostgreSQL database

## Deployment Configuration

1. Rename the `Dockerfile.flask` file to `Dockerfile`:
```bash
git mv Dockerfile Dockerfile.original
git mv Dockerfile.flask Dockerfile
git add .
git commit -m "Prepare Dockerfile for deployment"
git push
```
2. In EasyPanel, create a new Custom service.
3. Configure the service to use the Dockerfile.
4. Configure the necessary environment variables:

## Environment Variables

```
DATABASE_URL=postgresql://postgres:password@linkstack-db:5432/postgres
PGHOST=linkstack-db
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_secure_password
PGDATABASE=postgres
SESSION_SECRET=your_secret_key_here
```

## Verification

1. Check the build logs in EasyPanel
2. Make sure the container is running
3. Verify that the database is properly configured
4. Test the application by accessing the URL provided by EasyPanel

