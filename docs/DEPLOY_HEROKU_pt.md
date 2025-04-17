# Guia de Deploy no Heroku

Este guia explica como implantar a aplicação LinkStack no Heroku.

## Pré-requisitos

Conta no Heroku
Heroku CLI instalado
Git instalado
Repositório Git com o código da aplicação

## Configuração do Deploy

1. Crie um arquivo `runtime.txt` na raiz do projeto com o seguinte conteúdo:
```
python-3.11.0
```
2. Renomeie o arquivo `REQUISITOS.txt` para `requirements.txt`:
```bash
git mv REQUISITOS.txt requirements.txt
```
3. Certifique-se de que o arquivo `Procfile` tenha o seguinte conteúdo:
```
web: gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 main:app
```
4. Faça login no Heroku CLI:
```bash
heroku login
```
5. Crie um novo aplicativo Heroku:
```bash
heroku create seu-app-linkstack
```
6. Provisione um banco de dados PostgreSQL:
```bash
heroku addons:create heroku-postgresql:mini
```
7. Configure as variáveis de ambiente:
```bash
heroku config:set SESSION_SECRET=sua_chave_secreta_aqui
```
8. Faça o deploy do aplicativo:
```bash
git add .
git commit -m "Preparado para deploy no Heroku"
git push heroku main
```

## Verificação

1. Abra o aplicativo em seu navegador:
```bash
heroku open
```
2. Verifique os logs para depuração:
```bash
heroku logs --tail
```

