# Guia de Deploy na Vercel

Este guia explica como implantar a parte frontend da aplicação LinkStack na Vercel.

## Pré-requisitos

Conta na Vercel
Vercel CLI instalado
Repositório Git com o código da aplicação frontend

## Configuração do Deploy

1. Faça login na Vercel CLI:
```bash
vercel login
```
2. Crie um arquivo `vercel.json` na raiz do projeto:
```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "API_URL": "https://seu-backend-api.com"
  }
}
```
3. Certifique-se de que seu package.json tem um script de build:
```json
"scripts": {
  "build": "react-scripts build"
}
```
4. Faça o deploy para a Vercel:
```bash
vercel
```
5. Para fazer o deploy para produção:
```bash
vercel --prod
```

## Configuração de Variáveis de Ambiente

1. No painel da Vercel, acesse seu projeto
2. Vá para a guia 'Settings' > 'Environment Variables'
3. Adicione as variáveis de ambiente necessárias, como a URL da API do backend

## Integração com o Backend

1. Certifique-se de que seu backend está acessível publicamente
2. Configure o CORS no backend para permitir solicitações da URL da Vercel
3. Atualize a URL da API no frontend para apontar para o backend implantado

## Configuração de Domínio Personalizado

1. No painel da Vercel, acesse seu projeto
2. Vá para a guia 'Settings' > 'Domains'
3. Adicione seu domínio personalizado
4. Siga as instruções para configurar os registros DNS

