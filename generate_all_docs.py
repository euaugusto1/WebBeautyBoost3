#!/usr/bin/env python3
"""
Gerador de Documentação Multilíngue Completo
--------------------------------------------
Este script gera documentação de deployment para todas as plataformas
e idiomas suportados.
"""

import os
import subprocess
import argparse
from pathlib import Path

# Idiomas suportados (primários e traduzidos)
LANGUAGES = {
    "pt": "Português",
    "en": "English",
    "es": "Español",
    "fr": "Français"
}

# Idiomas primários (com templates nativos)
PRIMARY_LANGUAGES = ["pt", "en"]

# Idiomas de tradução (sem templates nativos)
TRANSLATION_LANGUAGES = ["es", "fr"]

# Plataformas suportadas
PLATFORMS = [
    "easypanel",
    "heroku",
    "vercel",
    "docker",
    "aws"
]

def generate_primary_docs(output_dir):
    """
    Gera a documentação para os idiomas primários usando doc_generator.py
    """
    print(f"Gerando documentação para idiomas primários: {', '.join(PRIMARY_LANGUAGES)}")
    
    for platform in PLATFORMS:
        for language in PRIMARY_LANGUAGES:
            cmd = ["python", "doc_generator.py", 
                   "--platform", platform, 
                   "--language", language, 
                   "--output", output_dir]
            
            print(f"Executando: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"  Sucesso: {platform} em {language}")
            else:
                print(f"  Erro: {platform} em {language}")
                print(f"  {result.stderr.strip()}")

def translate_docs(output_dir):
    """
    Traduz a documentação dos idiomas primários para os idiomas de tradução
    """
    print(f"Traduzindo documentação para: {', '.join(TRANSLATION_LANGUAGES)}")
    
    # Para cada arquivo gerado em idioma primário
    for platform in PLATFORMS:
        for source_lang in PRIMARY_LANGUAGES:
            for target_lang in TRANSLATION_LANGUAGES:
                source_file = os.path.join(output_dir, f"DEPLOY_{platform.upper()}_{source_lang}.md")
                
                if not os.path.exists(source_file):
                    print(f"  Arquivo fonte não encontrado: {source_file}")
                    continue
                
                cmd = ["python", "translate_docs.py",
                       "--input", source_file,
                       "--source-lang", source_lang,
                       "--target-lang", target_lang]
                
                print(f"Executando: {' '.join(cmd)}")
                result = subprocess.run(cmd, capture_output=True, text=True)
                
                if result.returncode == 0:
                    print(f"  Sucesso: {platform} de {source_lang} para {target_lang}")
                else:
                    print(f"  Erro: {platform} de {source_lang} para {target_lang}")
                    print(f"  {result.stderr.strip()}")

def create_index(output_dir):
    """
    Cria um arquivo index.md com links para todos os documentos gerados
    """
    print("Criando índice de documentação...")
    
    index_content = "# Documentação de Deployment\n\n"
    
    # Agrupa os links por plataforma
    for platform in PLATFORMS:
        platform_title = platform.capitalize()
        index_content += f"## {platform_title}\n\n"
        
        for lang_code, lang_name in LANGUAGES.items():
            doc_file = f"DEPLOY_{platform.upper()}_{lang_code}.md"
            if os.path.exists(os.path.join(output_dir, doc_file)):
                index_content += f"- [{lang_name}]({doc_file})\n"
        
        index_content += "\n"
    
    # Salva o arquivo de índice
    index_path = os.path.join(output_dir, "index.md")
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    print(f"Índice criado: {index_path}")

def main():
    parser = argparse.ArgumentParser(description='Gerador de Documentação Multilíngue Completo')
    parser.add_argument('--output', default='docs', help='Diretório de saída para os arquivos')
    parser.add_argument('--skip-primary', action='store_true', help='Pular geração de documentação em idiomas primários')
    parser.add_argument('--skip-translation', action='store_true', help='Pular tradução de documentação')
    parser.add_argument('--skip-index', action='store_true', help='Pular criação do índice')
    
    args = parser.parse_args()
    
    # Cria o diretório de saída se não existir
    os.makedirs(args.output, exist_ok=True)
    
    # Gera documentação para idiomas primários
    if not args.skip_primary:
        generate_primary_docs(args.output)
    
    # Traduz documentação para outros idiomas
    if not args.skip_translation:
        translate_docs(args.output)
    
    # Cria índice de documentação
    if not args.skip_index:
        create_index(args.output)
    
    print(f"Documentação gerada com sucesso no diretório: {args.output}")

if __name__ == "__main__":
    main()