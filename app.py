import os
import json
from flask import Flask, render_template, request, redirect, url_for, flash, session
from models import db, User, SocialLink, ProfileLink, ThemeSetting

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Configuração do banco de dados
# Verificar se DATABASE_URL está definido, caso contrário usar SQLite
db_url = os.environ.get("DATABASE_URL")
if db_url is None:
    db_url = "sqlite:///linkstack.db"
    print("Aviso: Variável de ambiente DATABASE_URL não encontrada. Usando SQLite local.")

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

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
            phone='(98) 98100-0099'
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
        'phone': user.phone,
        'social_links': [
            {
                'platform': link.platform, 
                'url': link.url, 
                'icon': link.icon
            } for link in user.social_links
        ],
        'links': [
            {
                'title': link.title, 
                'url': link.url, 
                'icon': link.icon, 
                'class': link.css_class
            } for link in user.profile_links
        ]
    }
    
    # Obter o tema atual
    theme = 'theme-2'  # Tema padrão
    if user.theme_settings:
        theme = user.theme_settings.theme_name
    
    return render_template('index.html', profile=profile, theme=theme)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
