# Gerador de Documentação de Deployment Multilíngue

Este projeto fornece um conjunto de ferramentas para gerar documentação de deployment em múltiplos idiomas para diferentes plataformas. A documentação é gerada em formato Markdown e pode ser convertida em HTML para visualização fácil.

## Funcionalidades

- Geração de documentação para várias plataformas de deployment (EasyPanel, Heroku, Docker, AWS, Vercel)
- Suporte para múltiplos idiomas (Português, Inglês, Espanhol, Francês)
- Tradução automática de documentos entre idiomas
- Visualização HTML com navegação intuitiva
- Interface de linha de comando para geração personalizada de documentos

## Visão Geral dos Arquivos

- `doc_generator.py`: Gera documentação markdown com base em templates
- `deployment_templates.py`: Contém templates de documentação para diferentes plataformas e idiomas
- `translate_docs.py`: Traduz documentos entre idiomas usando dicionários de tradução
- `generate_all_docs.py`: Interface para gerar toda a documentação em uma única etapa
- `create_html_view.py`: Cria uma interface HTML para visualizar a documentação

## Requisitos

- Python 3.6+
- Pacote Python markdown (para visualização HTML)

```bash
pip install markdown
```

## Como Usar

### Gerar Toda a Documentação

Para gerar documentação para todas as plataformas e idiomas:

```bash
python generate_all_docs.py
```

Isso vai:
1. Gerar documentação em português e inglês para todas as plataformas
2. Traduzir a documentação para espanhol e francês
3. Criar um arquivo de índice

Por padrão, os arquivos são salvos no diretório `docs/`.

### Opções Avançadas

Você pode personalizar a geração com as seguintes opções:

```bash
python generate_all_docs.py --output caminho/para/saida --skip-primary --skip-translation --skip-index
```

- `--output`: Especifica o diretório de saída (padrão: 'docs')
- `--skip-primary`: Pula a geração de documentos em idiomas primários (português e inglês)
- `--skip-translation`: Pula a tradução de documentos para outros idiomas
- `--skip-index`: Pula a criação do arquivo de índice

### Gerar Documentação para uma Plataforma Específica

Para gerar documentação para uma plataforma e idioma específicos:

```bash
python doc_generator.py --platform easypanel --language pt
```

### Traduzir um Documento Específico

Para traduzir um documento de um idioma para outro:

```bash
python translate_docs.py --input docs/DEPLOY_EASYPANEL_pt.md --source-lang pt --target-lang es
```

### Criar Visualização HTML

Após gerar a documentação, você pode criar uma interface HTML para visualização:

```bash
python create_html_view.py
```

Isso vai:
1. Converter todos os arquivos markdown para HTML
2. Criar um arquivo `index.html` com uma interface de navegação
3. Permitir alternar entre plataformas e idiomas na visualização

## Personalização

### Adicionar Novos Templates

Para adicionar templates para novas plataformas ou idiomas, edite o arquivo `deployment_templates.py`. Siga o formato existente para criar novos templates.

### Adicionar Novos Idiomas para Tradução

Para adicionar suporte para tradução para novos idiomas, edite o arquivo `translate_docs.py` e adicione novos dicionários de tradução, seguindo o formato dos dicionários ES_TRANSLATIONS e FR_TRANSLATIONS.

## Exemplo de Fluxo de Trabalho

1. Gerar toda a documentação:
   ```bash
   python generate_all_docs.py
   ```

2. Criar a visualização HTML:
   ```bash
   python create_html_view.py
   ```

3. Abrir o arquivo `index.html` em um navegador para visualizar a documentação

## Suporte a Novas Plataformas

Se você precisar adicionar documentação para uma nova plataforma, siga estas etapas:

1. Adicione a nova plataforma à lista PLATFORMS em `doc_generator.py`
2. Crie templates para a nova plataforma em `deployment_templates.py`
3. Execute novamente `generate_all_docs.py` para incluir a nova plataforma

## Observações

- As traduções são realizadas usando dicionários simples, e podem não ser perfeitas para todos os casos
- Para obter melhores resultados, revise manualmente os documentos traduzidos
- A visualização HTML funciona melhor quando servida por um servidor web