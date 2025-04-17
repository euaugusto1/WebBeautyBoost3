#!/bin/bash
set -e

# Variáveis de ambiente necessárias
# DATABASE_URL, PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGPORT

echo "=== INICIANDO APLICAÇÃO LINKSTACK ==="
echo "Verificando configurações..."

# Verificar se as variáveis de ambiente necessárias estão definidas
if [ -z "$PGUSER" ] || [ -z "$PGPASSWORD" ] || [ -z "$PGHOST" ] || [ -z "$PGDATABASE" ]; then
    echo "ERRO: Variáveis de ambiente do banco de dados não estão completamente configuradas!"
    echo "Verifique se PGUSER, PGPASSWORD, PGHOST e PGDATABASE estão definidas."
    exit 1
fi

# Determinar se estamos usando psycopg2
if pip list | grep -q psycopg2; then
    echo "Detectado psycopg2, vamos aguardar a disponibilidade do banco de dados..."
    
    # Esperar até que o banco de dados esteja disponível
    # A opção -w -c '\q' faz com que o psql se conecte e saia imediatamente se a conexão for bem-sucedida
    max_attempts=30
    attempt=0
    
    until PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c '\q' 2>/dev/null || [ $attempt -eq $max_attempts ]; do
        attempt=$((attempt+1))
        echo "Tentativa $attempt/$max_attempts: Banco de dados ainda não está disponível, aguardando..."
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "ERRO: Banco de dados não disponível após $max_attempts tentativas."
        echo "Verifique as configurações de conexão e se o serviço de banco de dados está rodando."
        exit 1
    fi
    
    echo "Banco de dados conectado com sucesso!"
fi

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