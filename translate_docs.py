#!/usr/bin/env python3
"""
Tradutor de Documentação de Deployment
--------------------------------------
Este script traduz documentação de deployment de um idioma para outro
usando dicionários de tradução.
"""

import os
import re
import argparse
from pathlib import Path

# Dicionários de tradução para espanhol
ES_TRANSLATIONS = {
    # Português para Espanhol
    "pt": {
        # Palavras comuns
        "Guia": "Guía",
        "Deploy": "Despliegue",
        "Deployment": "Despliegue",
        "Implantação": "Despliegue",
        "Configuração": "Configuración",
        "Variáveis": "Variables",
        "Ambiente": "Entorno",
        "Verificação": "Verificación",
        "Pré-requisitos": "Requisitos previos",
        "Banco de dados": "Base de datos",
        "Conta": "Cuenta",
        "Repositório": "Repositorio",
        "Aplicação": "Aplicación",
        "Configurado": "Configurado",
        "Arquivo": "Archivo",
        "Serviço": "Servicio",
        "Variáveis de Ambiente": "Variables de Entorno",
        "Senha": "Contraseña",
        "Chave": "Clave",
        "Secreta": "Secreta",
        "Logs": "Registros",
        "Certifique-se": "Asegúrate",
        "Verifique": "Verifica",
        "Teste": "Prueba",
        "Contêiner": "Contenedor",
        "Execução": "Ejecución",
        "Acessando": "Accediendo",
        "Fornecida": "Proporcionada",
        
        # Frases específicas
        "Este guia explica como implantar": "Esta guía explica cómo desplegar",
        "no EasyPanel": "en EasyPanel",
        "no Heroku": "en Heroku",
        "na AWS": "en AWS",
        "no Docker": "con Docker",
        "na Vercel": "en Vercel",
        "com o código da aplicação": "con el código de la aplicación",
        "Configure o serviço para usar o Dockerfile": "Configura el servicio para usar el Dockerfile",
        "Configure as variáveis de ambiente necessárias": "Configura las variables de entorno necesarias",
        "está em execução": "está en ejecución",
        "está corretamente configurado": "está correctamente configurado",
        "Teste a aplicação": "Prueba la aplicación",
        "Verifique os logs": "Verifica los registros",
    },
    
    # Inglês para Espanhol
    "en": {
        # Palavras comuns
        "Guide": "Guía",
        "Deployment": "Despliegue",
        "Configuration": "Configuración",
        "Variables": "Variables",
        "Environment": "Entorno",
        "Verification": "Verificación",
        "Prerequisites": "Requisitos previos",
        "Database": "Base de datos",
        "Account": "Cuenta",
        "Repository": "Repositorio",
        "Application": "Aplicación",
        "Configured": "Configurado",
        "File": "Archivo",
        "Service": "Servicio",
        "Environment Variables": "Variables de Entorno",
        "Password": "Contraseña",
        "Key": "Clave",
        "Secret": "Secreta",
        "Logs": "Registros",
        "Make sure": "Asegúrate",
        "Verify": "Verifica",
        "Test": "Prueba",
        "Container": "Contenedor",
        "Running": "Ejecución",
        "Accessing": "Accediendo",
        "Provided": "Proporcionada",
        
        # Frases específicas
        "This guide explains how to deploy": "Esta guía explica cómo desplegar",
        "on EasyPanel": "en EasyPanel",
        "on Heroku": "en Heroku",
        "on AWS": "en AWS",
        "using Docker": "con Docker",
        "on Vercel": "en Vercel",
        "with the application code": "con el código de la aplicación",
        "Configure the service to use the Dockerfile": "Configura el servicio para usar el Dockerfile",
        "Configure the necessary environment variables": "Configura las variables de entorno necesarias",
        "is running": "está en ejecución",
        "is properly configured": "está correctamente configurado",
        "Test the application": "Prueba la aplicación",
        "Check the logs": "Verifica los registros",
    }
}

# Dicionários de tradução para francês
FR_TRANSLATIONS = {
    # Português para Francês
    "pt": {
        # Palavras comuns
        "Guia": "Guide",
        "Deploy": "Déploiement",
        "Deployment": "Déploiement",
        "Implantação": "Déploiement",
        "Configuração": "Configuration",
        "Variáveis": "Variables",
        "Ambiente": "Environnement",
        "Verificação": "Vérification",
        "Pré-requisitos": "Prérequis",
        "Banco de dados": "Base de données",
        "Conta": "Compte",
        "Repositório": "Dépôt",
        "Aplicação": "Application",
        "Configurado": "Configuré",
        "Arquivo": "Fichier",
        "Serviço": "Service",
        "Variáveis de Ambiente": "Variables d'Environnement",
        "Senha": "Mot de passe",
        "Chave": "Clé",
        "Secreta": "Secrète",
        "Logs": "Journaux",
        "Certifique-se": "Assurez-vous",
        "Verifique": "Vérifiez",
        "Teste": "Testez",
        "Contêiner": "Conteneur",
        "Execução": "Exécution",
        "Acessando": "Accédant",
        "Fornecida": "Fournie",
        
        # Frases específicas
        "Este guia explica como implantar": "Ce guide explique comment déployer",
        "no EasyPanel": "sur EasyPanel",
        "no Heroku": "sur Heroku",
        "na AWS": "sur AWS",
        "no Docker": "avec Docker",
        "na Vercel": "sur Vercel",
        "com o código da aplicação": "avec le code de l'application",
        "Configure o serviço para usar o Dockerfile": "Configurez le service pour utiliser le Dockerfile",
        "Configure as variáveis de ambiente necessárias": "Configurez les variables d'environnement nécessaires",
        "está em execução": "est en cours d'exécution",
        "está corretamente configurado": "est correctement configuré",
        "Teste a aplicação": "Testez l'application",
        "Verifique os logs": "Vérifiez les journaux",
    },
    
    # Inglês para Francês
    "en": {
        # Palavras comuns
        "Guide": "Guide",
        "Deployment": "Déploiement",
        "Configuration": "Configuration",
        "Variables": "Variables",
        "Environment": "Environnement",
        "Verification": "Vérification",
        "Prerequisites": "Prérequis",
        "Database": "Base de données",
        "Account": "Compte",
        "Repository": "Dépôt",
        "Application": "Application",
        "Configured": "Configuré",
        "File": "Fichier",
        "Service": "Service",
        "Environment Variables": "Variables d'Environnement",
        "Password": "Mot de passe",
        "Key": "Clé",
        "Secret": "Secrète",
        "Logs": "Journaux",
        "Make sure": "Assurez-vous",
        "Verify": "Vérifiez",
        "Test": "Testez",
        "Container": "Conteneur",
        "Running": "Exécution",
        "Accessing": "Accédant",
        "Provided": "Fournie",
        
        # Frases específicas
        "This guide explains how to deploy": "Ce guide explique comment déployer",
        "on EasyPanel": "sur EasyPanel",
        "on Heroku": "sur Heroku",
        "on AWS": "sur AWS",
        "using Docker": "avec Docker",
        "on Vercel": "sur Vercel",
        "with the application code": "avec le code de l'application",
        "Configure the service to use the Dockerfile": "Configurez le service pour utiliser le Dockerfile",
        "Configure the necessary environment variables": "Configurez les variables d'environnement nécessaires",
        "is running": "est en cours d'exécution",
        "is properly configured": "est correctement configuré",
        "Test the application": "Testez l'application",
        "Check the logs": "Vérifiez les journaux",
    }
}

# Mapeamento de idioma para dicionário de tradução
TRANSLATION_DICTS = {
    "es": ES_TRANSLATIONS,
    "fr": FR_TRANSLATIONS
}

def translate_text(text, source_lang, target_lang):
    """
    Traduz um texto de um idioma fonte para um idioma alvo
    usando um dicionário de tradução simples.
    """
    if target_lang not in TRANSLATION_DICTS:
        print(f"Erro: Idioma alvo '{target_lang}' não suportado para tradução.")
        return text
    
    if source_lang not in TRANSLATION_DICTS[target_lang]:
        print(f"Erro: Idioma fonte '{source_lang}' não suportado para tradução para '{target_lang}'.")
        return text
    
    translation_dict = TRANSLATION_DICTS[target_lang][source_lang]
    
    # Ordenar as chaves por tamanho (do maior para o menor)
    # para evitar substituições parciais de frases
    keys = sorted(translation_dict.keys(), key=len, reverse=True)
    
    # Substituir frases e palavras
    for key in keys:
        # Usar expressão regular para corresponder a palavras completas
        # evitando substituições parciais
        text = re.sub(r'\b' + re.escape(key) + r'\b', translation_dict[key], text)
    
    return text

def translate_file(input_path, output_path, source_lang, target_lang):
    """
    Traduz um arquivo de um idioma fonte para um idioma alvo.
    """
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        translated_content = translate_text(content, source_lang, target_lang)
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(translated_content)
        
        print(f"Tradução concluída: {output_path}")
        return True
    except Exception as e:
        print(f"Erro ao traduzir o arquivo: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Tradutor de Documentação de Deployment')
    parser.add_argument('--input', required=True, help='Arquivo de entrada a ser traduzido')
    parser.add_argument('--output', help='Arquivo de saída traduzido')
    parser.add_argument('--source-lang', required=True, choices=['pt', 'en'], help='Idioma fonte')
    parser.add_argument('--target-lang', required=True, choices=['es', 'fr'], help='Idioma alvo')
    
    args = parser.parse_args()
    
    input_path = args.input
    source_lang = args.source_lang
    target_lang = args.target_lang
    
    if not args.output:
        base_name = os.path.basename(input_path)
        dir_name = os.path.dirname(input_path)
        name_parts = base_name.split('_')
        
        if len(name_parts) >= 3:
            # Substitui o código de idioma na última parte
            name_parts[-1] = target_lang + '.md'
            output_name = '_'.join(name_parts)
        else:
            # Adiciona o código de idioma ao nome do arquivo
            name_without_ext = os.path.splitext(base_name)[0]
            output_name = f"{name_without_ext}_{target_lang}.md"
        
        output_path = os.path.join(dir_name, output_name)
    else:
        output_path = args.output
    
    translate_file(input_path, output_path, source_lang, target_lang)

if __name__ == "__main__":
    main()