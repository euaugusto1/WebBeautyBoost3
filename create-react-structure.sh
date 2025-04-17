#!/bin/bash

# Cores para feedback visual
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}     Criando Projeto LinkStack React       ${NC}"
echo -e "${BLUE}============================================${NC}"

# Verifica se o nome do diretório foi fornecido
PROJECT_NAME=${1:-"linkstack-react"}

# Verifica se o diretório já existe
if [ -d "$PROJECT_NAME" ]; then
  echo -e "${RED}Erro: O diretório $PROJECT_NAME já existe. Escolha outro nome ou remova o diretório existente.${NC}"
  exit 1
fi

# Criar o projeto com Vite
echo -e "${YELLOW}Criando projeto React com Vite...${NC}"
npm create vite@latest $PROJECT_NAME -- --template react
cd $PROJECT_NAME

# Estrutura de pastas
echo -e "${YELLOW}Criando estrutura de pastas...${NC}"

# Pasta src e suas subpastas
mkdir -p src/assets/{fonts,images}
mkdir -p src/components/{common,edit,profile,themes}
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/styles
mkdir -p src/utils

# Arquivos comuns
echo -e "${YELLOW}Criando arquivos comuns...${NC}"

# Componentes comuns
COMMON_COMPONENTS=("Button" "Card" "Footer" "Loading" "Message")
for component in "${COMMON_COMPONENTS[@]}"; do
  touch src/components/common/${component}.jsx
  touch src/components/common/${component}.css
done
echo "export * from './Button';
export * from './Card';
export * from './Footer';
export * from './Loading';
export * from './Message';" > src/components/common/index.js

# Componentes de edição
EDIT_COMPONENTS=("EditButton" "FooterEditor" "LinkEditor" "ProfileEditor" "SocialEditor" "ThemeEditor")
for component in "${EDIT_COMPONENTS[@]}"; do
  touch src/components/edit/${component}.jsx
  touch src/components/edit/${component}.css
done
echo "export * from './EditButton';
export * from './FooterEditor';
export * from './LinkEditor';
export * from './ProfileEditor';
export * from './SocialEditor';
export * from './ThemeEditor';" > src/components/edit/index.js

# Componentes de perfil
PROFILE_COMPONENTS=("ProfileHeader" "ProfileLinks" "SocialLinks")
for component in "${PROFILE_COMPONENTS[@]}"; do
  touch src/components/profile/${component}.jsx
  touch src/components/profile/${component}.css
done
echo "export * from './ProfileHeader';
export * from './ProfileLinks';
export * from './SocialLinks';" > src/components/profile/index.js

# Componentes de temas
THEME_COMPONENTS=("ThemeSelector" "AnimatedPattern")
for component in "${THEME_COMPONENTS[@]}"; do
  touch src/components/themes/${component}.jsx
  touch src/components/themes/${component}.css
done
echo "export * from './ThemeSelector';
export * from './AnimatedPattern';" > src/components/themes/index.js

# Componente App
touch src/components/App.jsx

# Contextos
CONTEXTS=("AuthContext" "EditContext" "ThemeContext")
for context in "${CONTEXTS[@]}"; do
  touch src/context/${context}.jsx
done
echo "export * from './AuthContext';
export * from './EditContext';
export * from './ThemeContext';" > src/context/index.js

# Hooks
HOOKS=("useTheme" "useAnimatedPattern" "useEditMode" "useClickTracking")
for hook in "${HOOKS[@]}"; do
  touch src/hooks/${hook}.js
done

# Páginas
PAGES=("Home" "Login" "Register" "Profile" "NotFound")
for page in "${PAGES[@]}"; do
  touch src/pages/${page}.jsx
  touch src/pages/${page}.css
done

# Serviços
SERVICES=("api" "auth" "profile" "storage")
for service in "${SERVICES[@]}"; do
  touch src/services/${service}.js
done

# Estilos
STYLES=("animations" "colors" "gradients" "reset" "themes" "global")
for style in "${STYLES[@]}"; do
  touch src/styles/${style}.css
done

# Utilitários
UTILS=("constants" "helpers" "themeUtils" "validators")
for util in "${UTILS[@]}"; do
  touch src/utils/${util}.js
done

# Arquivos na raiz do src
touch src/App.css
touch src/index.css

# Arquivos de configuração
echo -e "${YELLOW}Criando arquivos de configuração...${NC}"
touch .dockerignore
touch .env.example
touch .eslintignore
touch .eslintrc.js
touch .prettierrc
touch Dockerfile
touch Dockerfile.dev
touch docker-compose.yml
touch jsconfig.json

# Pacotes essenciais
echo -e "${YELLOW}Instalando dependências essenciais...${NC}"
npm install react-router-dom axios @emotion/react @emotion/styled

# Pacotes de desenvolvimento
echo -e "${YELLOW}Instalando dependências de desenvolvimento...${NC}"
npm install -D eslint prettier eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier

# Configuração básica de ESLint
cat > .eslintrc.js << EOL
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
EOL

# Configuração do Prettier
cat > .prettierrc << EOL
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "jsxBracketSameLine": false,
  "bracketSpacing": true
}
EOL

# Configuração .gitignore
cat > .gitignore << EOL
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOL

# Configuração .dockerignore
cat > .dockerignore << EOL
**/node_modules
**/dist
.git
.gitignore
.env
.env.*
npm-debug.log
Dockerfile*
docker-compose*
README.md
.dockerignore
EOL

# Dockerfile básico
cat > Dockerfile << EOL
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOL

# Criar nginx.conf para roteamento SPA
cat > nginx.conf << EOL
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOL

# Docker Compose
cat > docker-compose.yml << EOL
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    restart: unless-stopped
EOL

# Criar README.md
cat > README.md << EOL
# LinkStack React

Uma aplicação de página de perfil personalizável com vários links estilo LinkTree construída com React.

## Requisitos

- Node.js 16.x ou superior
- npm 8.x ou superior

## Instalação

\`\`\`bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
\`\`\`

## Recursos

- Página de perfil personalizável
- Mais de 50 temas visuais
- Padrões de fundo animados
- Edição in-line de todos os elementos
- Rastreamento de cliques em links

## Implantação

Para instruções detalhadas sobre como implantar este projeto, consulte o arquivo DEPLOY.md.

## Licença

MIT
EOL

# Atualizar package.json com scripts úteis
npm pkg set scripts.lint="eslint src --ext .js,.jsx"
npm pkg set scripts.format="prettier --write \"src/**/*.{js,jsx,css,json}\""
npm pkg set scripts.preview="vite preview --port 3000"

echo -e "${GREEN}Estrutura do projeto criada com sucesso em $PROJECT_NAME!${NC}"
echo -e "${GREEN}Execute os seguintes comandos para iniciar:${NC}"
echo -e "${BLUE}  cd $PROJECT_NAME${NC}"
echo -e "${BLUE}  npm run dev${NC}"
echo -e "${YELLOW}Não esqueça de configurar os arquivos conforme suas necessidades${NC}"