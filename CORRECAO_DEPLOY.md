# Correção de Erro de Implantação no EasyPanel

O erro que você está encontrando ocorre porque:

1. O EasyPanel está tentando usar o builder `heroku/builder:24`, que tem problemas de compatibilidade
2. As variáveis de ambiente estão configuradas para desenvolvimento local e não para o EasyPanel

## Solução Passo a Passo

### 1. Mude o Builder no EasyPanel

No painel administrativo do seu projeto no EasyPanel:

1. Vá para "Settings" ou "Configurações" do serviço
2. Localize o campo "Builder"
3. Substitua `heroku/builder:24` por `heroku/buildpacks:20`
4. Salve as alterações

### 2. Corrija as Variáveis de Ambiente

Você precisa ajustar as variáveis de ambiente para o ambiente EasyPanel. Vá para a seção de variáveis de ambiente no EasyPanel e defina:

```
DATABASE_URL=postgresql://postgres:senha@linkstack-db:5432/postgres
PGHOST=linkstack-db
PGPORT=5432
PGUSER=postgres
PGPASSWORD=senha
PGDATABASE=postgres
SESSION_SECRET=sua_chave_secreta_aqui
FLASK_ENV=production
DEBUG=False
```

**IMPORTANTE**: Substitua `senha` por uma senha segura e `sua_chave_secreta_aqui` por uma string aleatória de caracteres.

### 3. Verifique o Procfile

Certifique-se de que o arquivo `Procfile` existe no seu repositório e contém:

```
web: gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 main:app
```

### 4. Comando de Build

O comando de build no EasyPanel deve ser:

```
pip install -r REQUISITOS.txt
```

### 5. Reconstrua o Serviço

Após fazer essas alterações, use o botão "Rebuild" ou "Reconstruir" no EasyPanel para reiniciar o processo de implantação.

## Verificação

Após a reconstrução, verifique os logs de build para confirmar que:
1. Está usando o builder correto (heroku/buildpacks:20)
2. As variáveis de ambiente estão corretas
3. Não há erros de construção ou inicialização

Se ainda houver erros após essas alterações, por favor compartilhe os logs completos para uma análise mais detalhada.