#!/usr/bin/env python3
"""
Criador de Visualização HTML para Documentação de Deployment
-----------------------------------------------------------
Este script cria uma página HTML para visualizar a documentação de deployment
gerada pelo sistema de documentação multilíngue.
"""

import os
import argparse
import markdown
import re
from pathlib import Path

# Mapeamento de idiomas
LANGUAGES = {
    "pt": "Português",
    "en": "English",
    "es": "Español",
    "fr": "Français"
}

# Mapeamento de plataformas
PLATFORMS = {
    "easypanel": "EasyPanel",
    "heroku": "Heroku",
    "vercel": "Vercel",
    "docker": "Docker",
    "aws": "AWS"
}

def process_markdown_files(docs_dir):
    """
    Processa os arquivos markdown e gera arquivos HTML correspondentes
    """
    markdown_files = []
    
    # Encontrar todos os arquivos markdown no diretório
    for file in os.listdir(docs_dir):
        if file.endswith('.md') and 'DEPLOY_' in file:
            markdown_files.append(file)
    
    # Processar cada arquivo
    for md_file in markdown_files:
        md_path = os.path.join(docs_dir, md_file)
        html_file = os.path.splitext(md_file)[0] + '.html'
        html_path = os.path.join(docs_dir, html_file)
        
        try:
            with open(md_path, 'r', encoding='utf-8') as f:
                md_content = f.read()
            
            # Converter markdown para HTML
            html_content = markdown.markdown(md_content, extensions=['fenced_code', 'codehilite'])
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"Convertido: {md_file} -> {html_file}")
        except Exception as e:
            print(f"Erro ao processar {md_file}: {e}")
    
    return markdown_files

def generate_index_html(docs_dir, markdown_files):
    """
    Gera o arquivo index.html com links para todos os documentos
    """
    # Organizar os arquivos por plataforma e idioma
    docs_by_platform = {}
    
    for file in markdown_files:
        # Extrair plataforma e idioma do nome do arquivo
        # Formato: DEPLOY_PLATAFORMA_IDIOMA.md
        parts = file.split('_')
        if len(parts) >= 3:
            platform = parts[1].lower()
            lang_with_ext = parts[2]
            lang = lang_with_ext.split('.')[0]
            
            if platform not in docs_by_platform:
                docs_by_platform[platform] = []
            
            docs_by_platform[platform].append(lang)
    
    # Gerar links de navegação para plataformas
    platforms_navigation = ""
    for platform in sorted(docs_by_platform.keys()):
        platform_name = PLATFORMS.get(platform.lower(), platform.capitalize())
        platforms_navigation += f'<li><a href="#" data-path="docs/DEPLOY_{platform.upper()}_pt.html">{platform_name}</a></li>\n'
    
    # Gerar links de navegação para idiomas
    languages_navigation = ""
    for lang_code, lang_name in LANGUAGES.items():
        languages_navigation += f'<li><a href="#" data-path="docs/DEPLOY_EASYPANEL_{lang_code}.html">{lang_name}</a></li>\n'
    
    # Gerar botões de idioma
    language_buttons = ""
    for lang_code, lang_name in LANGUAGES.items():
        language_buttons += f'<button class="language-button" data-language="{lang_code}">{lang_name}</button>\n'
    
    # Conteúdo inicial
    initial_content = "<h1>Selecione uma plataforma e idioma</h1><p>Escolha uma plataforma no menu lateral para ver a documentação de deployment.</p>"
    
    # Template HTML
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LinkStack Deployment Documentation</title>
    <style>
        :root {{
            --primary-color: #4a6cf7;
            --secondary-color: #6b7280;
            --background-color: #f9fafb;
            --text-color: #1f2937;
            --border-color: #e5e7eb;
            --sidebar-width: 250px;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--background-color);
            color: var(--text-color);
            display: flex;
            min-height: 100vh;
        }}
        
        .sidebar {{
            width: var(--sidebar-width);
            background-color: white;
            border-right: 1px solid var(--border-color);
            padding: 20px;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
        }}
        
        .sidebar h1 {{
            font-size: 1.5rem;
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: var(--primary-color);
        }}
        
        .sidebar-section {{
            margin-bottom: 1.5rem;
        }}
        
        .sidebar-section h2 {{
            font-size: 1.2rem;
            margin-bottom: 0.8rem;
            color: var(--text-color);
        }}
        
        .sidebar-section ul {{
            list-style-type: none;
            padding-left: 0.5rem;
            margin: 0;
        }}
        
        .sidebar-section li {{
            margin-bottom: 0.5rem;
        }}
        
        .sidebar-section a {{
            text-decoration: none;
            color: var(--secondary-color);
            display: block;
            padding: 5px 10px;
            border-radius: 4px;
            transition: background-color 0.2s, color 0.2s;
        }}
        
        .sidebar-section a:hover,
        .sidebar-section a.active {{
            background-color: rgba(74, 108, 247, 0.1);
            color: var(--primary-color);
        }}
        
        .content {{
            flex: 1;
            padding: 30px;
            margin-left: var(--sidebar-width);
            max-width: 800px;
        }}
        
        .content h1 {{
            color: var(--primary-color);
            margin-top: 0;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-color);
        }}
        
        .content h2 {{
            color: var(--text-color);
            margin-top: 2rem;
            margin-bottom: 1rem;
        }}
        
        .content p {{
            line-height: 1.6;
            margin-bottom: 1rem;
        }}
        
        .content ul, .content ol {{
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
        }}
        
        .content li {{
            margin-bottom: 0.5rem;
        }}
        
        .content pre {{
            background-color: #f0f2f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin-bottom: 1.5rem;
        }}
        
        .content code {{
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.9rem;
        }}
        
        .language-selector {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }}
        
        .language-button {{
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background-color: white;
            color: var(--secondary-color);
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.2s, color 0.2s;
        }}
        
        .language-button:hover,
        .language-button.active {{
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }}
        
        @media (max-width: 768px) {{
            .sidebar {{
                width: 100%;
                height: auto;
                position: relative;
                border-right: none;
                border-bottom: 1px solid var(--border-color);
            }}
            
            .content {{
                margin-left: 0;
                padding: 20px;
            }}
            
            body {{
                flex-direction: column;
            }}
        }}
    </style>
</head>
<body>
    <div class="sidebar">
        <h1>LinkStack Deployment</h1>
        
        <!-- Platforms Navigation -->
        <div class="sidebar-section">
            <h2>Platforms</h2>
            <ul>
                {platforms_navigation}
            </ul>
        </div>
        
        <!-- Languages Navigation -->
        <div class="sidebar-section">
            <h2>Languages</h2>
            <ul>
                {languages_navigation}
            </ul>
        </div>
    </div>
    
    <div class="content">
        <div class="language-selector">
            {language_buttons}
        </div>
        
        <div id="doc-content">
            {initial_content}
        </div>
    </div>
    
    <script>
        // Simple client-side routing
        document.addEventListener('DOMContentLoaded', function() {{
            const contentDiv = document.getElementById('doc-content');
            const allLinks = document.querySelectorAll('.sidebar a');
            const languageButtons = document.querySelectorAll('.language-button');
            
            // Function to load content
            async function loadContent(path) {{
                try {{
                    const response = await fetch(path);
                    if (!response.ok) {{
                        throw new Error(`HTTP error! status: ${{response.status}}`);
                    }}
                    const html = await response.text();
                    contentDiv.innerHTML = html;
                    
                    // Update active link
                    allLinks.forEach(link => {{
                        link.classList.remove('active');
                        if (link.getAttribute('data-path') === path) {{
                            link.classList.add('active');
                        }}
                    }});
                    
                    // Update URL hash
                    window.location.hash = path;
                }} catch (error) {{
                    console.error('Error loading content:', error);
                    contentDiv.innerHTML = `<h1>Error</h1><p>Could not load the requested content: ${{error.message}}</p>`;
                }}
            }}
            
            // Handle link clicks
            allLinks.forEach(link => {{
                link.addEventListener('click', function(e) {{
                    e.preventDefault();
                    const path = this.getAttribute('data-path');
                    loadContent(path);
                }});
            }});
            
            // Handle language button clicks
            languageButtons.forEach(button => {{
                button.addEventListener('click', function() {{
                    const activePlatformLink = document.querySelector('.sidebar a.active');
                    if (activePlatformLink) {{
                        const currentPath = activePlatformLink.getAttribute('data-path');
                        const platform = currentPath.split('_')[1].toLowerCase();
                        const language = this.getAttribute('data-language');
                        const newPath = `docs/DEPLOY_${{platform.toUpperCase()}}_${{language}}.html`;
                        loadContent(newPath);
                    }}
                    
                    // Update active button
                    languageButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }});
            }});
            
            // Handle initial load
            if (window.location.hash) {{
                loadContent(window.location.hash.substring(1));
            }} else {{
                // Default document to load
                const defaultDoc = 'docs/DEPLOY_EASYPANEL_pt.html';
                loadContent(defaultDoc);
            }}
        }});
    </script>
</body>
</html>
    """
    
    # Salvar o arquivo index.html
    index_path = 'index.html'
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Arquivo index.html gerado: {index_path}")

def main():
    parser = argparse.ArgumentParser(description='Criador de Visualização HTML para Documentação de Deployment')
    parser.add_argument('--docs-dir', default='docs', help='Diretório contendo os arquivos markdown')
    
    args = parser.parse_args()
    
    print(f"Processando arquivos markdown no diretório: {args.docs_dir}")
    markdown_files = process_markdown_files(args.docs_dir)
    
    print("Gerando arquivo index.html...")
    generate_index_html(args.docs_dir, markdown_files)
    
    print("Visualização HTML criada com sucesso!")

if __name__ == "__main__":
    main()