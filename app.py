import os
import json
from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from models import db, User, SocialLink, ProfileLink, ThemeSetting, FooterItem

# Carregar variáveis de ambiente do .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Configuração do banco de dados
# Verificar se DATABASE_URL está definido, caso contrário usar variáveis individuais para construir a URL
db_url = os.environ.get("DATABASE_URL")
if db_url is None:
    # Tentar construir a URL a partir das variáveis individuais
    db_host = os.environ.get("PGHOST", "localhost")
    db_port = os.environ.get("PGPORT", "5432")
    db_user = os.environ.get("PGUSER", "postgres")
    db_password = os.environ.get("PGPASSWORD", "")
    db_name = os.environ.get("PGDATABASE", "linkstack")
    
    db_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    
    # Fallback para SQLite se mesmo assim não tivermos as variáveis
    if not all([db_host, db_user, db_name]):
        db_url = "sqlite:///linkstack.db"
        print("Aviso: Variáveis de ambiente de banco de dados não encontradas. Usando SQLite local.")
else:
    # Corrigir problema com URLs começando com postgres:// (mudar para postgresql://)
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
        print("Aviso: Convertendo string de conexão de 'postgres://' para 'postgresql://'")
        
    print(f"Usando DB_URL: {db_url.split('@')[0].split('://')[0]}://*****@{db_url.split('@')[1] if '@' in db_url else 'localhost'}")

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configurar o modo debug a partir das variáveis de ambiente
app.config["DEBUG"] = os.environ.get("DEBUG", "False").lower() == "true"

# Inicializar o banco de dados
db.init_app(app)

# Criar tabelas
with app.app_context():
    db.create_all()
    
    # Verificar se existe um usuário de demonstração, caso contrário, criar
    demo_user = User.query.filter_by(username='demo').first()
    if not demo_user:
        demo_user = User(
            username='demo',
            email='demo@linkstack.com',
            name='Augusto Araujo',
            bio='Desenvolvedor & entusiasta de IA',
            description='Apaixonado por tecnologia e desenvolvimento de soluções inovadoras. Especialista em Python, JavaScript e frameworks modernos.',
            phone='(98) 98100-0099',
            copyright_text='Todos os direitos reservados © 2025 - Powered by LinkStack',
            copyright_icon='fa-copyright'
        )
        demo_user.set_password('demo1234')
        
        # Adicionar perfil social
        social_links = [
            SocialLink(platform='instagram', url='https://www.instagram.com/augu_ia/', icon='fa-instagram'),
            SocialLink(platform='linkedin', url='#', icon='fa-linkedin'),
            SocialLink(platform='github', url='#', icon='fa-github'),
            SocialLink(platform='twitter', url='#', icon='fa-twitter')
        ]
        demo_user.social_links = social_links
        
        # Adicionar links do perfil
        profile_links = [
            ProfileLink(title='Meu Portfolio', url='#', icon='fa-globe', css_class='website', position=1),
            ProfileLink(title='Projetos de IA', url='#', icon='fa-code', css_class='store', position=2),
            ProfileLink(title='Fale Comigo', url='#', icon='fa-envelope', css_class='contact', position=3)
        ]
        demo_user.profile_links = profile_links
        
        # Adicionar configurações de tema
        theme_settings = ThemeSetting(theme_name='theme-2')
        demo_user.theme_settings = theme_settings
        
        # Adicionar itens do footer
        footer_items = [
            FooterItem(text='(98) 98100-0099', icon='fa-phone-alt', position=1),
            FooterItem(text='contato@augu.dev', icon='fa-envelope', url='mailto:contato@augu.dev', position=2)
        ]
        demo_user.footer_items = footer_items
        
        db.session.add(demo_user)
        db.session.commit()

@app.route('/')
@app.route('/<string:edit_token>')
def index(edit_token=None):
    # Obter o usuário demo (por enquanto só temos esse)
    user = User.query.filter_by(username='demo').first_or_404()
    
    # Verificar se o token de edição é válido
    # Token fixo para simplificar, em produção deveria ser gerado de forma segura
    edit_mode = False
    if edit_token == 'd6d0b89d23827d16fe0c225aef457c1e0a0e7c2001da4af3a29d846b4ac01c9b':
        edit_mode = True
    
    # Montar o perfil a partir dos dados do usuário
    profile = {
        'name': user.name,
        'bio': user.bio,
        'description': user.description or '',
        'phone': user.phone,
        'image_url': user.profile_image,
        'copyright_text': user.copyright_text or 'Todos os direitos reservados © 2025 - Powered by LinkStack',
        'copyright_icon': user.copyright_icon or 'fa-copyright',
        'social_links': [
            {
                'platform': link.platform, 
                'url': link.url, 
                'icon': link.icon
            } for link in user.social_links
        ],
        'links': [
            {
                'id': link.id,
                'title': link.title, 
                'url': link.url, 
                'icon': link.icon, 
                'class': link.css_class,
                'click_count': link.click_count
            } for link in user.profile_links
        ],
        'footer_items': [
            {
                'text': item.text,
                'icon': item.icon,
                'url': item.url,
                'is_brand': item.is_brand
            } for item in user.footer_items
        ]
    }
    
    # Obter o tema atual e padrão de fundo
    theme = 'theme-2'  # Tema padrão
    pattern = 'none'   # Padrão de fundo padrão
    if user.theme_settings:
        theme = user.theme_settings.theme_name
        pattern = user.theme_settings.background_pattern
    
    return render_template('index.html', profile=profile, theme=theme, pattern=pattern, edit_mode=edit_mode)

@app.route('/update-profile', methods=['POST'])
def update_profile():
    try:
        # Obter dados do formulário
        data = request.json
        
        # Obter usuário (usamos o demo por enquanto)
        user = User.query.filter_by(username='demo').first_or_404()
        
        # Atualizar dados do usuário
        user.name = data.get('name')
        user.bio = data.get('bio')
        user.description = data.get('description', '')
        user.phone = data.get('phone')
        user.copyright_text = data.get('copyright_text', '')
        user.copyright_icon = data.get('copyright_icon', 'fa-copyright')
        
        # Atualizar tema e padrão de fundo
        # Verifique se existe propriedade copyright nos dados
        if 'copyright' in data and isinstance(data['copyright'], dict):
            # Atualizar ícone e texto de copyright específicos
            user.copyright_text = data['copyright'].get('text', user.copyright_text)
            user.copyright_icon = data['copyright'].get('icon', user.copyright_icon)
        
        # Atualizar tema
        theme_name = data.get('theme')
        if theme_name:
            pattern_name = data.get('pattern', 'none')
            print(f"Atualizando tema para: {theme_name}, padrão: {pattern_name}")
            
            if user.theme_settings:
                user.theme_settings.theme_name = theme_name
                user.theme_settings.background_pattern = pattern_name
            else:
                theme_settings = ThemeSetting(
                    user_id=user.id, 
                    theme_name=theme_name,
                    background_pattern=pattern_name
                )
                db.session.add(theme_settings)
        
        # Verificar se há uma nova imagem de perfil - apenas se a flag image_changed estiver presente
        if 'profile_image' in data and data['profile_image'] and data.get('image_changed', False):
            # Verificar se a string base64 é válida
            try:
                print(f"Iniciando processamento de imagem de perfil: {data['profile_image'][:30]}...")
                
                # Extrair apenas a parte base64 da string (remover o prefixo 'data:image/png;base64,')
                base64_data = ''
                if ',' in data['profile_image']:
                    header, base64_data = data['profile_image'].split(',', 1)
                    print(f"Detectado cabeçalho na imagem: {header}")
                else:
                    base64_data = data['profile_image']
                    print("Nenhum cabeçalho detectado, usando dados brutos")
                
                # Verificar se a string base64 tem conteúdo
                if base64_data and len(base64_data) > 0:
                    print(f"Tamanho dos dados base64: {len(base64_data)} caracteres")
                    
                    # Salvar imagem como arquivo
                    import base64
                    import os
                    from datetime import datetime
                    
                    # Criar diretório de imagens se não existir
                    img_dir = os.path.join('static', 'images', 'uploads')
                    os.makedirs(img_dir, exist_ok=True)
                    print(f"Diretório para uploads: {img_dir}")
                    
                    # Gerar nome de arquivo único
                    filename = f"profile_{user.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
                    filepath = os.path.join(img_dir, filename)
                    print(f"Caminho do arquivo que será criado: {filepath}")
                    
                    # Salvar imagem
                    try:
                        # Limpar possíveis caracteres inválidos
                        base64_data = base64_data.strip()
                        # Adicionar padding se necessário
                        missing_padding = len(base64_data) % 4
                        if missing_padding:
                            base64_data += '=' * (4 - missing_padding)
                        
                        # Decodificar e salvar
                        print("Decodificando imagem base64...")
                        decoded_data = base64.b64decode(base64_data)
                        print(f"Imagem decodificada: {len(decoded_data)} bytes")
                        
                        with open(filepath, "wb") as fh:
                            fh.write(decoded_data)
                        
                        # Verificar se a imagem foi escrita corretamente
                        if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
                            # Atualizar caminho da imagem no usuário
                            image_path = os.path.join('images', 'uploads', filename)
                            user.profile_image = image_path
                            print(f"Imagem de perfil salva com sucesso: {user.profile_image}")
                        else:
                            print(f"Arquivo de imagem foi criado, mas está vazio: {filepath}")
                    except Exception as img_error:
                        print(f"Erro ao salvar imagem: {str(img_error)}")
                        import traceback
                        print(traceback.format_exc())
                        # Continuar mesmo se houver erro na imagem
                else:
                    print("String base64 vazia ou inválida")
            except Exception as decode_error:
                print(f"Erro ao processar a string base64 da imagem: {str(decode_error)}")
                import traceback
                print(traceback.format_exc())
        
        # Atualizar links sociais
        # Primeiro, remover todos os links existentes
        for link in user.social_links:
            db.session.delete(link)
        
        # Adicionar os novos links sociais
        for link_data in data.get('social_links', []):
            social_link = SocialLink(
                user_id=user.id,
                platform=link_data.get('platform'),
                url=link_data.get('url'),
                icon=link_data.get('icon')
            )
            db.session.add(social_link)
        
        # Atualizar links do perfil
        # Primeiro, remover todos os links existentes
        for link in user.profile_links:
            db.session.delete(link)
        
        # Adicionar os novos links do perfil
        for index, link_data in enumerate(data.get('profile_links', [])):
            profile_link = ProfileLink(
                user_id=user.id,
                title=link_data.get('title'),
                url=link_data.get('url'),
                icon=link_data.get('icon'),
                css_class=link_data.get('class'),
                position=index + 1
            )
            db.session.add(profile_link)
            
        # Atualizar itens do footer
        # Primeiro, remover todos os itens existentes
        for item in user.footer_items:
            db.session.delete(item)
            
        # Adicionar os novos itens do footer
        for index, item_data in enumerate(data.get('footer_items', [])):
            footer_item = FooterItem(
                user_id=user.id,
                text=item_data.get('text'),
                icon=item_data.get('icon'),
                url=item_data.get('url'),
                is_brand=item_data.get('is_brand', False),
                position=index + 1
            )
            db.session.add(footer_item)
        
        # Salvar as alterações no banco de dados
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Perfil atualizado com sucesso!'})
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao atualizar perfil: {str(e)}')
        return jsonify({'success': False, 'message': f'Erro ao atualizar o perfil: {str(e)}'}), 500

@app.route('/click-link/<int:link_id>', methods=['POST'])
def click_link(link_id):
    """Registra um clique em um link e redireciona para a URL do link."""
    try:
        # Buscar o link no banco de dados
        link = ProfileLink.query.get_or_404(link_id)
        print(f"Processando clique para o link ID {link_id} - Contagem atual: {link.click_count}")
        
        # Incrementar o contador de cliques
        link.click_count += 1
        
        # Realizar o commit imediatamente
        try:
            db.session.commit()
            print(f"Clique registrado com sucesso. Nova contagem: {link.click_count}")
        except Exception as commit_error:
            db.session.rollback()
            print(f"Erro ao realizar commit do clique: {str(commit_error)}")
            raise commit_error
        
        # Retornar sucesso e a URL para redirecionamento
        return jsonify({
            'success': True, 
            'url': link.url,
            'click_count': link.click_count
        })
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao registrar clique: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return jsonify({
            'success': False, 
            'message': 'Erro ao registrar clique',
            'error': str(e)
        }), 500

@app.route('/get-link-stats/<int:link_id>')
def get_link_stats(link_id):
    """Retorna estatísticas de um link específico."""
    try:
        link = ProfileLink.query.get_or_404(link_id)
        return jsonify({
            'success': True,
            'title': link.title,
            'click_count': link.click_count
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Erro ao obter estatísticas',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
