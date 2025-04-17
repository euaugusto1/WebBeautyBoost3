# Correção de Erro de Implantação no EasyPanel

O novo erro que você está encontrando ocorre porque:

1. O EasyPanel não consegue encontrar o arquivo de requisitos do Python
2. O buildpack Heroku está procurando por `requirements.txt` (em minúsculas), mas seu projeto usa `REQUISITOS.txt` (em maiúsculas)

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

### 4. Correção do Arquivo de Requisitos

Você tem duas opções para resolver o problema do arquivo de requisitos:

**Opção A: Renomear o arquivo no repositório**
Renomeie o arquivo `REQUISITOS.txt` para `requirements.txt` no seu repositório. Isso é a solução mais limpa.

**Opção B: Usar um script de build**
Adicionei um script de build ao repositório chamado `build.sh` que cuida da conversão do arquivo de requisitos.

Altere o comando de build no EasyPanel para:

```
chmod +x build.sh && ./build.sh
```

Este script copia seu arquivo `REQUISITOS.txt` para `requirements.txt` durante o processo de build e instala as dependências, sem alterar seu repositório original.

**Opção C: Modificar o comando de build diretamente**
Se preferir não usar o script, altere o comando de build no EasyPanel para:

```
cp REQUISITOS.txt requirements.txt && pip install -r requirements.txt
```

### 5. Reconstrua o Serviço

Após fazer essas alterações, use o botão "Rebuild" ou "Reconstruir" no EasyPanel para reiniciar o processo de implantação.

## Verificação

Após a reconstrução, verifique os logs de build para confirmar que:
1. Está usando o builder correto (heroku/buildpacks:20)
2. As variáveis de ambiente estão corretas
3. Não há erros de construção ou inicialização

Se ainda houver erros após essas alterações, por favor compartilhe os logs completos para uma análise mais detalhada.