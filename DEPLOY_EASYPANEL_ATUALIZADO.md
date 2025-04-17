# Instruções Atualizadas para Deploy no EasyPanel

Após análise detalhada dos erros de deploy, preparamos instruções específicas para implantar sua aplicação Flask no EasyPanel.

## Opção 1: Deploy com Dockerfile.flask (Recomendado)

Esta é a melhor opção para sua aplicação Flask:

1. **No EasyPanel, crie um novo serviço customizado**:
   - Tipo: **Custom**
   - Método de construção: **Build from Dockerfile**
   - Repositório Git: *seu-repositorio*
   - Arquivo Dockerfile: **Dockerfile.flask**

2. **Configure as variáveis de ambiente**:
   ```
   DATABASE_URL=postgresql://postgres:senha@linkstack-db:5432/postgres
   PGHOST=linkstack-db
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=sua_senha_segura
   PGDATABASE=postgres
   SESSION_SECRET=sua_chave_secreta_aqui
   ```

3. **Configure as redes e portas**:
   - Porta: **5000**
   - Protocolo: **HTTP**

O `Dockerfile.flask` inclui:
- Uso de `python:3.11-slim` como base
- Configuração `PIP_BREAK_SYSTEM_PACKAGES=1` para evitar erros de ambiente gerenciado
- Instalação de dependências do sistema necessárias (build-essential, libpq-dev)
- Conversão automática de REQUISITOS.txt para requirements.txt
- Configuração do Gunicorn com workers e threads otimizados

## Opção 2: Deploy via Branch Específico

Se preferir não usar Docker, você pode:

1. **Criar um branch específico para deploy**:
   ```bash
   git checkout -b deploy
   git mv REQUISITOS.txt requirements.txt
   touch Procfile
   echo "web: gunicorn --bind 0.0.0.0:\$PORT --workers 4 --threads 2 main:app" > Procfile
   git add .
   git commit -m "Preparar repositório para deploy no EasyPanel"
   git push origin deploy
   ```

2. **Configurar o EasyPanel**:
   - Tipo: **Web Service**
   - Buildpack: **heroku/buildpacks:20**
   - Branch: **deploy**
   - Comando de Start: *(deixe vazio para usar o Procfile)*

## Solução de Problemas Comuns

### Erro de ambiente gerenciado externamente

Se você vir este erro:
```
error: externally-managed-environment
```

Soluções:
1. No Dockerfile, use um ambiente virtual:
   ```dockerfile
   RUN python3 -m venv /venv && \
       . /venv/bin/activate && \
       pip install -r requirements.txt
   ```

2. Ou defina a variável de ambiente:
   ```dockerfile
   ENV PIP_BREAK_SYSTEM_PACKAGES=1
   ```

### Erro de arquivo não encontrado

Se o buildpack não encontrar requirements.txt:
1. Certifique-se de que está usando o Dockerfile.flask
2. Ou renomeie manualmente REQUISITOS.txt para requirements.txt

### Erro de conexão com banco de dados

Verifique se:
1. A variável DATABASE_URL está corretamente configurada
2. O serviço de banco de dados está acessível pela aplicação (verifique as redes no EasyPanel)

## Verificação do Deploy

Após a implantação:
1. Verifique os logs de construção e execução
2. Use o endpoint de health check de sua aplicação 
3. Confirme se consegue acessar a aplicação pela URL fornecida pelo EasyPanel