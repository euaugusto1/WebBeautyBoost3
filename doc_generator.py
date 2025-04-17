#!/usr/bin/env python3
"""
Multilingual Deployment Documentation Generator
----------------------------------------------
Este script gera documentação de deployment em múltiplos idiomas para diferentes plataformas.
"""

import os
import json
import argparse
from pathlib import Path
from deployment_templates import ALL_TEMPLATES

# Idiomas suportados
LANGUAGES = {
    "pt": "Português",
    "en": "English",
    "es": "Español",
    "fr": "Français"
}

# Plataformas de deployment suportadas
PLATFORMS = [
    "easypanel",
    "heroku",
    "vercel",
    "docker",
    "aws"
]

# Usar os templates do arquivo deployment_templates.py
TEMPLATES = ALL_TEMPLATES

# Função para adicionar mais templates conforme necessário
def add_platform_template(platform, language, template_data):
    if platform not in TEMPLATES:
        TEMPLATES[platform] = {}
    TEMPLATES[platform][language] = template_data

# Função para gerar o markdown
def generate_markdown(platform, language):
    if platform not in TEMPLATES:
        print(f"Erro: Plataforma '{platform}' não encontrada.")
        return None
    
    if language not in TEMPLATES[platform]:
        print(f"Erro: Idioma '{language}' não disponível para '{platform}'.")
        return None
    
    template = TEMPLATES[platform][language]
    markdown = f"# {template['title']}\n\n"
    markdown += f"{template['intro']}\n\n"
    
    for section in template['sections']:
        markdown += f"## {section['title']}\n\n"
        for item in section['content']:
            markdown += f"{item}\n"
        markdown += "\n"
    
    return markdown

# Função para salvar a documentação
def save_documentation(content, platform, language, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    lang_name = LANGUAGES.get(language, language)
    filename = f"DEPLOY_{platform.upper()}_{language}.md"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Documentação gerada: {filepath}")
    return filepath

# Função principal
def main():
    parser = argparse.ArgumentParser(description='Gerador de Documentação de Deployment Multilíngue')
    parser.add_argument('--platform', choices=PLATFORMS, help='Plataforma de deployment')
    parser.add_argument('--language', choices=LANGUAGES.keys(), help='Idioma da documentação')
    parser.add_argument('--output', default='docs', help='Diretório de saída para os arquivos')
    parser.add_argument('--all', action='store_true', help='Gerar para todas as plataformas e idiomas')
    
    args = parser.parse_args()
    
    if args.all:
        for platform in TEMPLATES.keys():
            for language in TEMPLATES[platform].keys():
                content = generate_markdown(platform, language)
                if content:
                    save_documentation(content, platform, language, args.output)
    elif args.platform and args.language:
        content = generate_markdown(args.platform, args.language)
        if content:
            save_documentation(content, args.platform, args.language, args.output)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()