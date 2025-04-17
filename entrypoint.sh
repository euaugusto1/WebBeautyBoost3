#!/bin/bash
set -e

# Variáveis de ambiente necessárias
# DATABASE_URL, PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGPORT

echo "=== INICIANDO APLICAÇÃO LINKSTACK ==="
echo "Verificando configurações..."

# Verificar se as variáveis de ambiente de banco de dados estão configuradas
if [ -n "$DATABASE_URL" ]; then
    echo "Detectada variável DATABASE_URL configurada: ${DATABASE_URL//:*:*@/:***:***@}"
    # Uma URL de banco de dados completa tem precedência sobre as variáveis individuais
elif [ -z "$PGUSER" ] || [ -z "$PGPASSWORD" ] || [ -z "$PGHOST" ] || [ -z "$PGDATABASE" ]; then
    echo "AVISO: Nem DATABASE_URL nem as variáveis individuais de banco de dados estão completamente configuradas!"
    echo "Verifique se DATABASE_URL ou (PGUSER, PGPASSWORD, PGHOST, PGDATABASE) estão definidas."
    echo "Tentaremos usar um SQLite local como fallback, mas isso pode não ser adequado para produção."
fi

# Cores para melhor visualização
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar a conexão com o banco de dados usando Python
echo -e "${BLUE}=== Verificando conexão com o banco de dados ===${NC}"
python -c "
import os
import time
import sys
import socket

# Função para imprimir mensagens coloridas
def print_green(msg): print(f'\033[0;32m{msg}\033[0m')
def print_yellow(msg): print(f'\033[0;33m{msg}\033[0m')
def print_red(msg): print(f'\033[0;31m{msg}\033[0m')
def print_blue(msg): print(f'\033[0;34m{msg}\033[0m')

try:
    import psycopg2
    print_blue('Psycopg2 está instalado, verificando conexão com PostgreSQL...')
    
    # Função para tentar conexão
    def try_connect():
        try:
            # Verificar qual método de conexão estamos usando
            db_url = os.environ.get('DATABASE_URL')
            
            if db_url:
                # Ocultar credenciais sensíveis nos logs
                masked_url = db_url
                if '@' in db_url:
                    prefix = db_url.split('@')[0]
                    if ':' in prefix:
                        user_part = prefix.split(':')[0]
                        masked_url = user_part + ':****@' + db_url.split('@')[1]
                print_yellow(f'Tentando conexão via DATABASE_URL: {masked_url}')
                
                # Testar se o host está acessível
                if '@' in db_url:
                    host_part = db_url.split('@')[1].split('/')[0]
                    if ':' in host_part:
                        host = host_part.split(':')[0]
                        try:
                            # Teste rápido para ver se o host está acessível
                            socket.gethostbyname(host)
                            print_green(f'O host {host} é resolvível!')
                        except socket.gaierror:
                            print_red(f'ERRO: O host {host} não é resolvível. Verifique o nome do host.')
                            return False
                
                conn = psycopg2.connect(db_url)
            else:
                # Usar variáveis individuais
                host = os.environ.get('PGHOST', 'localhost')
                port = os.environ.get('PGPORT', '5432')
                user = os.environ.get('PGUSER', 'postgres')
                password = os.environ.get('PGPASSWORD', '')
                dbname = os.environ.get('PGDATABASE', 'postgres')
                
                print_yellow(f'Tentando conexão via variáveis individuais: {host}:{port}/{dbname}')
                
                # Testar se o host está acessível
                try:
                    socket.gethostbyname(host)
                    print_green(f'O host {host} é resolvível!')
                except socket.gaierror:
                    print_red(f'ERRO: O host {host} não é resolvível. Verifique o nome do host ou o serviço de banco de dados.')
                    if host in ['localhost', '127.0.0.1']:
                        print_yellow('Nota: Você está tentando conectar ao localhost, o que é normal apenas para desenvolvimento.')
                    else:
                        print_yellow('Dica: Para EasyPanel, verifique se o nome do serviço de banco de dados está correto.')
                        print_yellow('      O nome do host deve ser o nome do serviço no EasyPanel, não \"localhost\".')
                    return False
                
                conn = psycopg2.connect(
                    host=host,
                    port=port,
                    user=user,
                    password=password,
                    dbname=dbname
                )
            
            # Verificar se a conexão está funcionando
            cur = conn.cursor()
            cur.execute('SELECT version()')
            version = cur.fetchone()[0]
            print_green(f'Conexão com o banco de dados bem-sucedida!')
            print_green(f'Versão do PostgreSQL: {version}')
            
            # Verificar se podemos criar/acessar tabelas
            try:
                cur.execute('CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, test_date TIMESTAMP DEFAULT NOW())')
                cur.execute('INSERT INTO connection_test (test_date) VALUES (NOW())')
                conn.commit()
                cur.execute('SELECT COUNT(*) FROM connection_test')
                count = cur.fetchone()[0]
                print_green(f'Teste de criação/acesso a tabelas bem-sucedido! (Total de testes: {count})')
            except Exception as table_error:
                print_yellow(f'Aviso ao verificar permissões de tabela: {str(table_error)}')
                print_yellow('A aplicação pode funcionar, mas pode haver problemas com permissões de banco de dados.')
            
            cur.close()
            conn.close()
            return True
        except psycopg2.OperationalError as e:
            if 'password authentication failed' in str(e).lower():
                print_red(f'ERRO DE AUTENTICAÇÃO: Senha incorreta para o usuário do banco de dados')
                print_yellow('Verifique as credenciais nas variáveis de ambiente PGUSER/PGPASSWORD ou DATABASE_URL')
            elif 'could not connect to server' in str(e).lower():
                print_red(f'ERRO DE CONEXÃO: Não foi possível conectar ao servidor de banco de dados')
                print_yellow('Verifique se o servidor está em execução e se o nome do host/endereço IP está correto')
                print_yellow('Para EasyPanel: O nome do host deve ser o nome do serviço PostgreSQL no EasyPanel')
            elif 'does not exist' in str(e).lower():
                print_red(f'ERRO: O banco de dados ou usuário não existe')
                print_yellow('Verifique se o nome do banco de dados e do usuário estão corretos')
            else:
                print_red(f'ERRO AO CONECTAR: {str(e)}')
            return False
        except Exception as e:
            print_red(f'ERRO INESPERADO: {str(e)}')
            return False
    
    # Tentar 5 vezes com intervalo de 2 segundos
    success = False
    for i in range(5):
        print_yellow(f'Tentativa {i+1}/5...')
        if try_connect():
            success = True
            break
        time.sleep(2)
    
    if not success:
        print_red('ALERTA: Não foi possível conectar ao banco de dados PostgreSQL após várias tentativas.')
        print_yellow('Verificando se o modo fallback para SQLite está configurado...')
        
        # Verificar se o app suporta fallback para SQLite
        try:
            import sqlite3
            print_yellow('SQLite está disponível. A aplicação pode usar SQLite como fallback.')
            print_yellow('Nota: O modo SQLite é adequado apenas para desenvolvimento/teste, não para produção.')
        except ImportError:
            print_red('SQLite não está disponível. A aplicação pode falhar sem uma conexão de banco de dados válida.')
    
except ImportError:
    print_yellow('Psycopg2 não está instalado, verificando se a aplicação pode usar SQLite...')
    try:
        import sqlite3
        print_green('SQLite está disponível como alternativa!')
        print_yellow('Nota: O modo SQLite é adequado apenas para desenvolvimento/teste, não para produção.')
    except ImportError:
        print_red('ALERTA: Nem psycopg2 nem sqlite3 estão disponíveis!')
        print_red('A aplicação provavelmente falhará sem acesso a um banco de dados!')
"

# Verificar se o módulo Flask está instalado
if ! python -c "import flask" &>/dev/null; then
    echo "ERRO: O módulo Flask não está instalado!"
    echo "Verifique se todas as dependências foram instaladas corretamente."
    echo "Conteúdo do arquivo requirements.txt:"
    cat requirements.txt
    exit 1
fi

# Verificar se o módulo gunicorn está instalado
if ! python -c "import gunicorn" &>/dev/null; then
    echo "ERRO: O módulo gunicorn não está instalado!"
    echo "Tente adicionar 'gunicorn' ao arquivo requirements.txt e reconstruir a imagem."
    exit 1
fi

# Verificar se o arquivo main.py existe
if [ ! -f main.py ]; then
    echo "ERRO: arquivo main.py não encontrado!"
    echo "Listando os arquivos no diretório atual:"
    ls -la
    exit 1
fi

# Configurações do ambiente
export PYTHONUNBUFFERED=1
export FLASK_ENV=${FLASK_ENV:-production}

echo "Todas as verificações passaram. Iniciando o servidor gunicorn..."
echo "==============================================="

# Iniciar a aplicação com gunicorn
exec gunicorn --bind 0.0.0.0:5000 \
    --workers 4 \
    --threads 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    main:app