#!/bin/bash

# Script para adicionar ao repositório para facilitar a implantação no EasyPanel
# Este script copia o arquivo REQUISITOS.txt para requirements.txt
# Use-o no comando de build do EasyPanel: ./build.sh

echo "Iniciando processo de build..."

# Verificar se REQUISITOS.txt existe
if [ -f REQUISITOS.txt ]; then
    echo "Copiando REQUISITOS.txt para requirements.txt..."
    cp REQUISITOS.txt requirements.txt
    echo "Arquivo copiado com sucesso!"
else
    echo "ERRO: Arquivo REQUISITOS.txt não encontrado!"
    exit 1
fi

# Instalar dependências
echo "Instalando dependências com pip..."
pip install -r requirements.txt

echo "Build concluído com sucesso!"