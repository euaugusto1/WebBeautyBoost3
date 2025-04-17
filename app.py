import os
import json
from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, SocialLink, ProfileLink, ThemeSetting, FooterItem
from forms import LoginForm, RegistrationForm

# Carregar variáveis de ambiente do .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Configurar Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Você precisa fazer login para acessar esta página.'
login_manager.login_message_category = 'error'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

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
def index():
    # Obter o usuário demo (por enquanto só temos esse)
    user = User.query.filter_by(username='demo').first_or_404()
    
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
    
    return render_template('index.html', profile=profile, theme=theme, pattern=pattern)

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
        if 'theme' in data and data['theme']:
            theme_name = data.get('theme')
            pattern_name = data.get('pattern', 'none')
            
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
        
        # Verificar se há uma nova imagem de perfil
        if 'profile_image' in data and data['profile_image']:
            # Extrair apenas a parte base64 da string (remover o prefixo 'data:image/png;base64,')
            if ',' in data['profile_image']:
                base64_data = data['profile_image'].split(',')[1]
            else:
                base64_data = data['profile_image']
            
            # Salvar imagem como arquivo
            import base64
            import os
            from datetime import datetime
            
            # Criar diretório de imagens se não existir
            img_dir = os.path.join('static', 'images', 'uploads')
            os.makedirs(img_dir, exist_ok=True)
            
            # Gerar nome de arquivo único
            filename = f"profile_{user.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
            filepath = os.path.join(img_dir, filename)
            
            # Salvar imagem
            try:
                with open(filepath, "wb") as fh:
                    fh.write(base64.b64decode(base64_data))
                
                # Atualizar caminho da imagem no usuário
                user.profile_image = os.path.join('images', 'uploads', filename)
            except Exception as img_error:
                print(f"Erro ao salvar imagem: {str(img_error)}")
                # Continuar mesmo se houver erro na imagem
        
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
        
        # Incrementar o contador de cliques
        link.click_count += 1
        db.session.commit()
        
        # Retornar sucesso e a URL para redirecionamento
        return jsonify({
            'success': True, 
            'url': link.url,
            'click_count': link.click_count
        })
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao registrar clique: {str(e)}")
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
