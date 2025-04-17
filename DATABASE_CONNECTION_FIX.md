# Correção para Problemas de Conexão com o Banco de Dados

Se você está recebendo o erro:

```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) connection to server at "localhost" (::1), port 5432 failed: Connection refused
```

Ou:

```
Error response from daemon: container <ID> is not running
```

Este problema ocorre porque o contêiner está tentando se conectar a um banco de dados PostgreSQL em "localhost", mas no ambiente Docker/EasyPanel, o banco de dados está em um contêiner separado.

## Solução 1: Corrigir URLs do Banco de Dados no EasyPanel

Quando você configura o serviço no EasyPanel, é crucial definir as variáveis de ambiente corretas para a conexão com o banco de dados:

### Variáveis de Ambiente para Banco de Dados no EasyPanel:

```
DATABASE_URL=postgresql://postgres:senha_segura@nome-do-servico-db:5432/postgres
PGHOST=nome-do-servico-db
PGPORT=5432
PGUSER=postgres
PGPASSWORD=senha_segura
PGDATABASE=postgres
```

**IMPORTANTE:** Substitua `nome-do-servico-db` pelo nome real do seu serviço de banco de dados no EasyPanel. Normalmente, é algo como `linkstack-db` ou `app-db`.

### Como encontrar o nome correto do serviço de banco de dados:

1. No EasyPanel, acesse a lista de serviços
2. Localize o serviço que contém seu banco de dados PostgreSQL
3. O nome do serviço na rede interna do EasyPanel será o que você deve usar em vez de "localhost"

## Solução 2: Usar um Banco de Dados Externo (Neon, Supabase, etc.)

Se você estiver usando um banco de dados externo como Neon:

1. Configure apenas a variável `DATABASE_URL` com a string de conexão completa:

```
DATABASE_URL=postgresql://usuario:senha@seu-host-neon.neon.tech/neondb?sslmode=require
```

2. Remova ou deixe em branco as variáveis individuais (`PGHOST`, `PGUSER`, etc.)

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

## Testando a Conexão

Adicione este código no script `entrypoint.sh` para verificar a conexão com o banco de dados antes de iniciar a aplicação:

```bash
# Este teste imprime informações detalhadas sobre a conexão
echo "Testando conexão com o banco de dados..."
if [ -n "$DATABASE_URL" ]; then
    echo "URL de conexão: ${DATABASE_URL//:*:*@/:***:***@}"
else
    echo "URL de conexão construída a partir de variáveis individuais:"
    echo "Host: $PGHOST"
    echo "Porta: $PGPORT"
    echo "Usuário: $PGUSER"
    echo "Banco: $PGDATABASE"
fi

# Tentar se conectar ao banco de dados
python -c "
import psycopg2
import os
import time

# Função para tentar conexão
def try_connect():
    try:
        db_url = os.environ.get('DATABASE_URL')
        if db_url:
            conn = psycopg2.connect(db_url)
        else:
            conn = psycopg2.connect(
                host=os.environ.get('PGHOST', 'localhost'),
                port=os.environ.get('PGPORT', '5432'),
                user=os.environ.get('PGUSER', 'postgres'),
                password=os.environ.get('PGPASSWORD', ''),
                dbname=os.environ.get('PGDATABASE', 'postgres')
            )
        conn.close()
        return True
    except Exception as e:
        print(f'Erro ao conectar: {str(e)}')
        return False

# Tentar 5 vezes com intervalo de 2 segundos
for i in range(5):
    print(f'Tentativa {i+1}/5...')
    if try_connect():
        print('Conexão bem-sucedida!')
        exit(0)
    time.sleep(2)

print('Não foi possível conectar ao banco de dados após várias tentativas.')
exit(1)
"
```

Este script ajuda a diagnosticar problemas de conexão verificando se é possível conectar ao banco de dados com as variáveis de ambiente configuradas.