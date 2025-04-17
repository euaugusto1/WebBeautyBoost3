# Guia de Deploy no EasyPanel

Este guia explica como implantar a aplicação LinkStack no EasyPanel.

## Pré-requisitos

Conta no EasyPanel
Repositório Git com o código da aplicação
Banco de dados PostgreSQL configurado

## Configuração do Deploy

1. Renomeie o arquivo `Dockerfile.flask` para `Dockerfile`:
```bash
git mv Dockerfile Dockerfile.original
git mv Dockerfile.flask Dockerfile
git add .
git commit -m "Preparar Dockerfile para deploy"
git push
```
2. No EasyPanel, crie um novo serviço Custom.
3. Configure o serviço para usar o Dockerfile.
4. Configure as variáveis de ambiente necessárias:

## Variáveis de Ambiente

```
DATABASE_URL=postgresql://postgres:senha@linkstack-db:5432/postgres
PGHOST=linkstack-db
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua_senha_segura
PGDATABASE=postgres
SESSION_SECRET=sua_chave_secreta_aqui
```

## Verificação

1. Verifique os logs de build no EasyPanel
2. Certifique-se de que o contêiner está em execução
3. Verifique se o banco de dados está corretamente configurado
4. Teste a aplicação acessando a URL fornecida pelo EasyPanel

