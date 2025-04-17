import os
from flask import Flask, render_template

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

@app.route('/')
def index():
    # Profile data
    profile = {
        'name': 'Augusto Araujo',
        'bio': 'Desenvolvedor & entusiasta de IA',
        'phone': '(98) 98100-0099',
        'social_links': [
            {'platform': 'instagram', 'url': 'https://www.instagram.com/augu_ia/', 'icon': 'fa-instagram'},
            {'platform': 'linkedin', 'url': '#', 'icon': 'fa-linkedin'},
            {'platform': 'github', 'url': '#', 'icon': 'fa-github'},
            {'platform': 'twitter', 'url': '#', 'icon': 'fa-twitter'}
        ],
        'links': [
            {'title': 'Meu Portfolio', 'url': '#', 'icon': 'fa-globe', 'class': 'website'},
            {'title': 'Projetos de IA', 'url': '#', 'icon': 'fa-code', 'class': 'store'},
            {'title': 'Fale Comigo', 'url': '#', 'icon': 'fa-envelope', 'class': 'contact'}
        ]
    }
    
    return render_template('index.html', profile=profile)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
