# Guia Completo de Resolução de Problemas de Conexão com o Banco de Dados

## Problemas Comuns

Se você está enfrentando algum destes erros:

```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) connection to server at "localhost" (::1), port 5432 failed: Connection refused
```

```
Error response from daemon: container <ID> is not running
```

```
OperationalError: could not translate host name "nome-do-servico-db" to address: Name or service not known
```

Este guia vai ajudar você a resolver o problema.

## ✅ Diagnóstico Rápido

1. **Erro "container is not running"**: Na maioria das vezes, é causado por falha na conexão do banco de dados
2. **Erro de conexão recusada**: O host do banco de dados não está acessível ou não existe
3. **Erro de autenticação**: As credenciais (usuário/senha) estão incorretas
4. **Erro "host não encontrado"**: O nome do serviço de banco de dados está incorreto

## 🔧 Solução 1: Configurar Corretamente no EasyPanel

### Opção A: Usar PostgreSQL Local no EasyPanel

```
# Use o nome exato do serviço PostgreSQL no EasyPanel
DATABASE_URL=postgresql://postgres:senha_segura@nome-do-servico-postgres:5432/postgres
PGHOST=nome-do-servico-postgres
PGPORT=5432
PGUSER=postgres
PGPASSWORD=senha_segura
PGDATABASE=postgres
SESSION_SECRET=chave_secreta_para_sessoes
```

**⚠️ IMPORTANTE:**
- Substitua `nome-do-servico-postgres` pelo nome real do seu serviço PostgreSQL no EasyPanel
- Use o nome **exato** do serviço, respeitando maiúsculas/minúsculas e hífens

### Opção B: Usar Banco de Dados PostgreSQL Externo (Recomendado)

```
# Use a URL fornecida pelo seu provedor de banco de dados (Neon, Supabase, etc.)
DATABASE_URL=postgresql://usuario:senha@seu-host-externo.provedor.com:5432/dbname?sslmode=require
SESSION_SECRET=chave_secreta_para_sessoes
```

**💡 Dica para serviços externos:**
- Para Neon: Sempre inclua `?sslmode=require` no final da URL
- Para Supabase: Você pode encontrar a string de conexão no painel de controle do projeto

## Solução 3: Configuração no docker-compose.yml (Desenvolvimento Local)

Para desenvolvimento local com Docker Compose, configure seu `docker-compose.yml` assim:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/linkstack
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=linkstack
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔍 Diagnóstico Avançado

Nossa aplicação agora inclui scripts de diagnóstico automático que são executados na inicialização do contêiner:

### 1. Scripts de Diagnóstico Integrados

A versão atualizada do `entrypoint.sh` inclui diagnósticos avançados:

- Verificação de resolução DNS do host do banco de dados
- Teste de conexão completo com PostgreSQL
- Teste de permissões para criação/inserção/seleção em tabelas
- Exibição de mensagens de erro detalhadas e sugestões de correção
- Detecção automática do tipo de erro (autenticação, conexão, host não encontrado)

### 2. Verificando Logs no EasyPanel

Para diagnosticar problemas no EasyPanel:

1. Acesse seu serviço no EasyPanel
2. Vá para a aba "Logs"
3. Procure as mensagens coloridas de diagnóstico:
   - 🟢 Verde: Informações de sucesso
   - 🟡 Amarelo: Avisos e informações de diagnóstico
   - 🔴 Vermelho: Erros que precisam ser corrigidos

### 3. Exemplos de Problemas e Soluções

#### 3.1 "Nome do host não encontrado"

```
ERRO: O host nome-do-servico-postgres não é resolvível. Verifique o nome do host ou o serviço de banco de dados.
Dica: Para EasyPanel, verifique se o nome do serviço de banco de dados está correto.
O nome do host deve ser o nome do serviço no EasyPanel, não "localhost".
```

**Solução:** Verifique o nome exato do seu serviço PostgreSQL no EasyPanel e use-o como valor de `PGHOST`

#### 3.2 "Erro de autenticação"

```
ERRO DE AUTENTICAÇÃO: Senha incorreta para o usuário do banco de dados
Verifique as credenciais nas variáveis de ambiente PGUSER/PGPASSWORD ou DATABASE_URL
```

**Solução:** Corrija a senha no valor de `PGPASSWORD` ou na string `DATABASE_URL`

#### 3.3 "Contêiner não consegue iniciar"

```
ERROR: for app_service  container is not running
```

**Solução:** Verifique os logs do serviço para identificar o problema específico com o banco de dados

## 💡 Boas Práticas

1. **Usar banco de dados externo:** Serviços como Neon, Supabase ou Render oferecem PostgreSQL gratuito e mais estável que soluções autogerenciadas
2. **Variáveis simplificadas:** Para banco externo, use apenas `DATABASE_URL` em vez de várias variáveis separadas
3. **Verificar nomes exatos:** O nome do serviço deve ser exatamente igual ao configurado no EasyPanel
4. **Manter o healthcheck:** Não remova o script `healthcheck.sh`, ele é essencial para monitorar a saúde da aplicação