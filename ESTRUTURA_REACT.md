# Estrutura de Pastas e Arquivos do Projeto LinkStack React

```
linkstack-react/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── fonts/                  # Fontes personalizadas
│   │   └── images/                 # Imagens estáticas
│   ├── components/
│   │   ├── common/                 # Componentes reutilizáveis
│   │   │   ├── Button.jsx          # Botão estilizado
│   │   │   ├── Button.css
│   │   │   ├── Card.jsx            # Componente de cartão
│   │   │   ├── Card.css
│   │   │   ├── Footer.jsx          # Componente de rodapé
│   │   │   ├── Footer.css
│   │   │   ├── Loading.jsx         # Indicador de carregamento
│   │   │   ├── Loading.css
│   │   │   ├── Message.jsx         # Componente de mensagem
│   │   │   ├── Message.css
│   │   │   └── index.js            # Exportações comuns
│   │   ├── edit/                   # Componentes para modo de edição
│   │   │   ├── EditButton.jsx      # Botão de edição
│   │   │   ├── EditButton.css
│   │   │   ├── FooterEditor.jsx    # Editor de footer
│   │   │   ├── FooterEditor.css
│   │   │   ├── LinkEditor.jsx      # Editor de links
│   │   │   ├── LinkEditor.css
│   │   │   ├── ProfileEditor.jsx   # Editor de perfil
│   │   │   ├── ProfileEditor.css
│   │   │   ├── SocialEditor.jsx    # Editor de redes sociais
│   │   │   ├── SocialEditor.css
│   │   │   ├── ThemeEditor.jsx     # Editor de temas
│   │   │   ├── ThemeEditor.css
│   │   │   └── index.js
│   │   ├── profile/                # Componentes da página de perfil
│   │   │   ├── ProfileHeader.jsx   # Cabeçalho do perfil
│   │   │   ├── ProfileHeader.css
│   │   │   ├── ProfileLinks.jsx    # Links do perfil
│   │   │   ├── ProfileLinks.css
│   │   │   ├── SocialLinks.jsx     # Links de redes sociais
│   │   │   ├── SocialLinks.css
│   │   │   └── index.js
│   │   ├── themes/                 # Componentes relacionados a temas
│   │   │   ├── ThemeSelector.jsx   # Seletor de tema
│   │   │   ├── ThemeSelector.css
│   │   │   ├── AnimatedPattern.jsx # Padrões de fundo animados
│   │   │   ├── AnimatedPattern.css
│   │   │   └── index.js
│   │   └── App.jsx                 # Componente principal
│   ├── context/
│   │   ├── AuthContext.jsx         # Contexto de autenticação
│   │   ├── EditContext.jsx         # Contexto do modo de edição
│   │   ├── ThemeContext.jsx        # Contexto de tema
│   │   └── index.js
│   ├── hooks/
│   │   ├── useTheme.js             # Hook para gerenciar temas
│   │   ├── useAnimatedPattern.js   # Hook para padrões animados
│   │   ├── useEditMode.js          # Hook para modo de edição
│   │   └── useClickTracking.js     # Hook para rastreamento de cliques
│   ├── pages/
│   │   ├── Home.jsx                # Página inicial
│   │   ├── Home.css
│   │   ├── Login.jsx               # Página de login
│   │   ├── Login.css
│   │   ├── Register.jsx            # Página de registro
│   │   ├── Register.css
│   │   ├── Profile.jsx             # Página de perfil
│   │   ├── Profile.css
│   │   ├── NotFound.jsx            # Página 404
│   │   └── NotFound.css
│   ├── services/
│   │   ├── api.js                  # Cliente API
│   │   ├── auth.js                 # Serviços de autenticação
│   │   ├── profile.js              # Serviços do perfil
│   │   └── storage.js              # Serviços de armazenamento local
│   ├── styles/
│   │   ├── animations.css          # Animações globais
│   │   ├── colors.css              # Variáveis de cores
│   │   ├── gradients.css           # Definições de gradientes
│   │   ├── reset.css               # Reset CSS
│   │   ├── themes.css              # Estilos de temas
│   │   └── global.css              # Estilos globais
│   ├── utils/
│   │   ├── constants.js            # Constantes da aplicação
│   │   ├── helpers.js              # Funções auxiliares
│   │   ├── themeUtils.js           # Utilitários de tema
│   │   └── validators.js           # Validadores
│   ├── App.jsx                     # Componente raiz
│   ├── App.css                     # Estilos do App
│   ├── index.jsx                   # Ponto de entrada do React
│   └── index.css                   # Estilos globais
├── .dockerignore                   # Arquivos ignorados pelo Docker
├── .env.example                    # Exemplo de variáveis de ambiente
├── .eslintignore                   # Arquivos ignorados pelo ESLint
├── .eslintrc.js                    # Configuração ESLint
├── .gitignore                      # Arquivos ignorados pelo Git
├── .prettierrc                     # Configuração Prettier
├── Dockerfile                      # Arquivo Docker para produção
├── Dockerfile.dev                  # Arquivo Docker para desenvolvimento
├── README.md                       # Documentação do projeto
├── create-react-structure.sh       # Script para criar estrutura
├── docker-compose.yml              # Configuração Docker Compose
├── jsconfig.json                   # Configuração do JS
├── package.json                    # Dependências e scripts
└── vite.config.js                  # Configuração do Vite
```

## Principais características da estrutura:

1. **Componentes modularizados e reutilizáveis**: Cada componente possui seu próprio arquivo CSS para melhor organização.

2. **Pasta `components` organizada por categorias**: Common, Edit, Profile e Themes - facilitando a localização de componentes específicos.

3. **Contextos React**: Para gerenciar estados globais, como tema, autenticação e modo de edição.

4. **Hooks personalizados**: Para lógica reutilizável relacionada a temas, padrões animados e rastreamento de cliques.

5. **Serviços separados**: Para comunicação com APIs, autenticação e armazenamento local.

6. **Arquivos de configuração**: Para Docker, ESLint, Prettier e outras ferramentas de desenvolvimento.

Esta estrutura segue as melhores práticas para projetos React modernos, facilitando a manutenção, escalabilidade e reutilização de código.