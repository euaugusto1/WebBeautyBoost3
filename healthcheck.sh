#!/bin/bash
set -e

# Tempos de espera e retry
TIMEOUT=3
MAX_RETRIES=3

# Verificar se a aplicação está respondendo
echo "Executando verificação de saúde..."

# Tentar acessar a aplicação
retry_count=0
while [ $retry_count -lt $MAX_RETRIES ]; do
    if curl -s -f --max-time $TIMEOUT http://localhost:5000/ > /dev/null 2>&1; then
        echo "Aplicação está respondendo normalmente"
        exit 0
    else
        retry_count=$((retry_count+1))
        echo "Tentativa $retry_count/$MAX_RETRIES falhou. Tentando novamente..."
        sleep 1
    fi
done

echo "ERRO: Aplicação não está respondendo após $MAX_RETRIES tentativas"
exit 1