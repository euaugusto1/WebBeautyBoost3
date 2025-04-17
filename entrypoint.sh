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

# Verificar a conexão com o banco de dados usando Python
echo "Verificando conexão com o banco de dados..."
python -c "
import os
import time
import sys

try:
    import psycopg2
    print('Psycopg2 está instalado, verificando conexão com PostgreSQL...')
    
    # Função para tentar conexão
    def try_connect():
        try:
            db_url = os.environ.get('DATABASE_URL')
            if db_url:
                print(f'Tentando conexão via DATABASE_URL: {db_url.split(\"@\")[1] if \"@\" in db_url else \"[formato não padrão]\"} (credenciais ocultadas)')
                conn = psycopg2.connect(db_url)
            else:
                host = os.environ.get('PGHOST', 'localhost')
                port = os.environ.get('PGPORT', '5432')
                user = os.environ.get('PGUSER', 'postgres')
                password = os.environ.get('PGPASSWORD', '')
                dbname = os.environ.get('PGDATABASE', 'postgres')
                print(f'Tentando conexão via variáveis individuais: {host}:{port}/{dbname}')
                conn = psycopg2.connect(
                    host=host,
                    port=port,
                    user=user,
                    password=password,
                    dbname=dbname
                )
            
            # Verificar se a conexão está funcionando
            cur = conn.cursor()
            cur.execute('SELECT 1')
            cur.close()
            conn.close()
            return True
        except Exception as e:
            print(f'Erro ao conectar: {str(e)}')
            return False
    
    # Tentar 5 vezes com intervalo de 2 segundos
    success = False
    for i in range(5):
        print(f'Tentativa {i+1}/5...')
        if try_connect():
            print('Conexão com o banco de dados bem-sucedida!')
            success = True
            break
        time.sleep(2)
    
    if not success:
        print('ALERTA: Não foi possível conectar ao banco de dados PostgreSQL após várias tentativas.')
        print('Verificando se o modo fallback para SQLite está configurado...')
        # Não vamos falhar aqui, pois o app.py tem fallback para SQLite
    
except ImportError:
    print('Psycopg2 não está instalado, a aplicação pode estar configurada para usar SQLite.')
    print('Verificando a configuração no app.py...')
    # Permitir continuar mesmo sem psycopg2, pois podemos estar usando SQLite
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