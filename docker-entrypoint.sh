#!/bin/sh

# Script para substituir variáveis de ambiente em tempo de execução
# nos arquivos JavaScript de produção da aplicação React

# Diretório do app
APP_DIR=/usr/share/nginx/html

# Identifica os arquivos JavaScript principais (aqueles com hash no nome)
JS_FILES=$(find $APP_DIR -type f -name "*.js" | grep -v "chunk")

# Se não encontramos arquivos JS, algo está errado
if [ -z "$JS_FILES" ]; then
  echo "AVISO: Não foi possível encontrar arquivos JavaScript. O build pode estar incompleto."
fi

# Função para substituir variáveis de ambiente
replace_in_js() {
  for JS_FILE in $JS_FILES; do
    echo "Processando: $JS_FILE"
    
    # Substitui as variáveis de ambiente encontradas
    # Formato no código: "process.env.VITE_VARIABLE_NAME"
    
    # Lista de variáveis a serem substituídas
    for envvar in $(printenv | grep "^VITE_" | cut -d= -f1); do
      # Obtém o valor da variável
      value=$(printenv $envvar)
      
      # Escapa caracteres especiais para uso com sed
      escaped_value=$(echo $value | sed -e 's/[\/&]/\\&/g')
      
      # Substitui "process.env.NOME_VAR" pelo valor real
      sed -i "s/process\.env\.${envvar}/${escaped_value}/g" $JS_FILE
      
      # Substitui "import.meta.env.NOME_VAR" pelo valor real
      sed -i "s/import\.meta\.env\.${envvar}/${escaped_value}/g" $JS_FILE
      
      echo "  Substituído: $envvar"
    done
  done
}

# Executa a substituição
replace_in_js

echo "Configuração da aplicação concluída"

# Executa o comando fornecido (geralmente o servidor Nginx)
exec "$@"