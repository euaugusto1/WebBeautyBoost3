#!/bin/bash
set -e

# Tempos de espera e retry
TIMEOUT=5
MAX_RETRIES=5

# Cores para melhor legibilidade
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Função para testar conexão de banco de dados usando python
function test_db_connection() {
    echo -e "${YELLOW}Verificando conexão com o banco de dados...${NC}"
    
    python -c "
import os
import psycopg2
import sys

try:
    # Tentar conectar usando DATABASE_URL ou variáveis separadas
    if 'DATABASE_URL' in os.environ:
        # Esconder credenciais sensíveis no log
        db_url = os.environ['DATABASE_URL']
        masked_url = db_url
        if '@' in db_url:
            prefix = db_url.split('@')[0]
            if ':' in prefix:
                user_part = prefix.split(':')[0]
                masked_url = user_part + ':****@' + db_url.split('@')[1]
        print(f'Tentando conectar via: {masked_url}')
        conn = psycopg2.connect(db_url)
    else:
        # Usar variáveis separadas
        params = {
            'host': os.environ.get('PGHOST', 'localhost'),
            'port': os.environ.get('PGPORT', '5432'),
            'user': os.environ.get('PGUSER', 'postgres'),
            'password': os.environ.get('PGPASSWORD', ''),
            'dbname': os.environ.get('PGDATABASE', 'postgres')
        }
        print(f'Tentando conectar via: {params[\"host\"]}:{params[\"port\"]}/{params[\"dbname\"]} (usuário: {params[\"user\"]})')
        conn = psycopg2.connect(**params)
    
    # Testar a conexão
    cur = conn.cursor()
    cur.execute('SELECT version()')
    version = cur.fetchone()[0]
    print(f'Conexão bem-sucedida! Versão: {version}')
    cur.close()
    conn.close()
    sys.exit(0)  # Sucesso
except Exception as e:
    print(f'ERRO DE CONEXÃO: {str(e)}')
    sys.exit(1)  # Falha
"
    return $?
}

# Verificar se a aplicação está respondendo
echo -e "${YELLOW}Executando verificação de saúde...${NC}"

# Primeiro verifique a conexão do banco de dados
if test_db_connection; then
    echo -e "${GREEN}Banco de dados está conectando corretamente.${NC}"
else
    echo -e "${RED}ERRO: Não foi possível conectar ao banco de dados.${NC}"
    echo -e "${YELLOW}Isso pode causar falha na inicialização da aplicação.${NC}"
    # Continue para verificar se a aplicação consegue iniciar mesmo assim
fi

# Tentar acessar a aplicação
retry_count=0
while [ $retry_count -lt $MAX_RETRIES ]; do
    if curl -s -f --max-time $TIMEOUT http://localhost:5000/ > /dev/null 2>&1; then
        echo -e "${GREEN}Aplicação está respondendo normalmente${NC}"
        exit 0
    else
        retry_count=$((retry_count+1))
        echo -e "${YELLOW}Tentativa $retry_count/$MAX_RETRIES falhou. Tentando novamente...${NC}"
        
        # Se estamos na última tentativa, fazer mais diagnósticos
        if [ $retry_count -eq $MAX_RETRIES ]; then
            echo -e "${YELLOW}Realizando diagnóstico adicional...${NC}"
            
            # Verificar se o processo gunicorn está rodando
            if pgrep -f "gunicorn" > /dev/null; then
                echo -e "${GREEN}O processo Gunicorn está em execução.${NC}"
                
                # Verificar logs recentes
                echo -e "${YELLOW}Últimas 10 linhas de log (se disponíveis):${NC}"
                tail -n 10 /var/log/gunicorn.log 2>/dev/null || echo "Nenhum log encontrado."
            else
                echo -e "${RED}O processo Gunicorn NÃO está em execução!${NC}"
            fi
        fi
        
        sleep 2
    fi
done

echo -e "${RED}ERRO: Aplicação não está respondendo após $MAX_RETRIES tentativas${NC}"
exit 1