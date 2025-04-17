FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Argumentos de build
ARG VITE_API_URL
ARG VITE_ENVIRONMENT=production
ARG VITE_MOCK_DATA=false

# Variáveis de ambiente para o build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_ENVIRONMENT=${VITE_ENVIRONMENT}
ENV VITE_MOCK_DATA=${VITE_MOCK_DATA}

# Copia arquivos de configuração e dependências
COPY package*.json ./
COPY .npmrc ./

# Instala as dependências com flags de produção
RUN npm ci --only=production --no-audit --no-fund

# Copia o código fonte
COPY . .

# Constrói a aplicação
RUN npm run build

# Estágio 2: Servidor Web Nginx
FROM nginx:stable-alpine AS production

# Copia configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Adiciona script de inicialização para substituir variáveis de ambiente no runtime
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Comando para iniciar o Nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]