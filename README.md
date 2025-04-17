# LinkStack - Plataforma de Perfil de Links

Uma plataforma moderna e personalizável para criar perfis de links, similar ao Linktree, mas com recursos avançados de personalização de temas, padrões animados, e designs modernos.

## Recursos Principais

- **Design Moderno e Responsivo**: Interface elegante para qualquer dispositivo
- **50+ Temas Predefinidos**: Gradientes e cores para todos os gostos
- **Padrões de Fundo Animados**: Adicione vida ao seu perfil com animações
- **Edição Inline**: Edite todo o perfil diretamente na mesma página
- **Links Personalizáveis**: Adicione ícones, títulos e URLs para seus links
- **Redes Sociais**: Integração com principais plataformas (Instagram, Twitter, LinkedIn, etc.)
- **Estatísticas de Cliques**: Acompanhe a popularidade de cada link
- **Personalização do Footer**: Adicione informações de contato e direitos autorais
- **Upload de Imagem**: Personalize sua foto de perfil

## Tecnologias Utilizadas

- **Backend**: Python, Flask, SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Banco de Dados**: PostgreSQL (ou SQLite para desenvolvimento)
- **Animações**: AOS (Animate On Scroll), CSS Animations
- **Ícones**: Font Awesome 6

## Requisitos de Sistema

- Python 3.8+
- PostgreSQL 12+ (recomendado para produção)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## Configuração do Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example` e configure os seguintes parâmetros:

```
# Configurações do aplicativo
FLASK_APP=main.py
FLASK_ENV=production
SESSION_SECRET=sua_chave_secreta_aqui

# Configurações do banco de dados PostgreSQL
DATABASE_URL=postgresql://usuario:senha@localhost:5432/linkstack
PGHOST=localhost
PGPORT=5432
PGUSER=usuario
PGPASSWORD=senha
PGDATABASE=linkstack

# Outras configurações (opcional)
DEBUG=False
```

### Instalação de Dependências

```bash
# Instalar dependências Python
pip install -r requirements.txt

# Iniciar o banco de dados e criar tabelas
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

## Implantação no EasyPanel

1. Crie um novo aplicativo no EasyPanel
2. Configure as variáveis de ambiente:
   - Banco de dados PostgreSQL (DATABASE_URL ou variáveis PG*)
   - SESSION_SECRET (chave secreta para sessões)
   - FLASK_ENV=production
   - DEBUG=False

3. Implante o código-fonte:
   ```bash
   git clone https://github.com/seu-usuario/linkstack.git
   cd linkstack
   # Configurar o repositório remoto para o EasyPanel
   git remote add easypanel https://easypanel.seu-servidor.com/git/linkstack
   git push easypanel main
   ```

4. Configure o serviço no EasyPanel:
   - Comando: `gunicorn --bind 0.0.0.0:$PORT main:app`
   - Porta: 5000 (ou use a variável PORT do EasyPanel)
   - Volume para dados persistentes: `/app/static/images/uploads`

## Estrutura do Banco de Dados

### Tabelas Principais

- **users**: Armazena informações de usuários
- **social_links**: Links para redes sociais
- **profile_links**: Links principais do perfil
- **theme_settings**: Configurações de tema e padrão de fundo
- **footer_items**: Itens do rodapé

### Diagrama ER

```
User
  |
  |-- SocialLink (1:N)
  |-- ProfileLink (1:N)
  |-- ThemeSetting (1:1)
  |-- FooterItem (1:N)
```

## Extensão e Personalização

### Adição de Novos Temas

Para adicionar novos temas, edite os arquivos:
- `static/css/styles.css`: Adicione gradientes CSS
- `static/js/edit-mode.js`: Adicione opções no seletor de temas

### Adição de Padrões de Fundo

Para adicionar padrões animados:
- `static/css/animated-patterns.css`: Defina os estilos CSS 
- `static/js/animated-patterns.js`: Implemente a lógica JavaScript

## Licença

Este projeto está licenciado sob a licença MIT.

## Suporte

Para suporte, entre em contato através do email contato@augu.dev.