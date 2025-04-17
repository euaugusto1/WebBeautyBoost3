# LinkStack React

**LinkStack React** é uma aplicação moderna para criação de páginas de perfil personalizadas estilo LinkTree, construída com React e tecnologias web modernas.

![Banner do LinkStack](https://via.placeholder.com/1200x300)

## 🌟 Características

- ✨ Interface de usuário moderna e responsiva
- 🎨 Mais de 50 temas e gradientes personalizados
- 🔄 Padrões de fundo animados
- ✏️ Edição in-line de todos os elementos
- 📊 Rastreamento de cliques em links
- 📱 Design totalmente responsivo
- 🔒 Autenticação de usuários
- 🚀 Desempenho otimizado

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção de interfaces
- **React Router** - Navegação e roteamento
- **Axios** - Cliente HTTP para requisições de API
- **CSS Modules** - Estilos encapsulados por componente
- **FontAwesome** - Ícones vetoriais
- **Vite** - Ferramentas de build rápidas para desenvolvimento

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (v16.x ou superior)
- [npm](https://www.npmjs.com/) (v8.x ou superior) ou [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🚀 Instalação e Execução

### Clonando o Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/linkstack-react.git

# Entre na pasta do projeto
cd linkstack-react
```

### Instalação de Dependências

```bash
# Usando npm
npm install

# OU usando Yarn
yarn
```

### Configuração de Ambiente

Copie o arquivo `.env.example` para criar um novo arquivo `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e defina as variáveis de ambiente necessárias:

```
VITE_API_URL=http://localhost:5000/api
VITE_MOCK_DATA=true  # Set to false in production
```

### Executando em Desenvolvimento

```bash
# Usando npm
npm run dev

# OU usando Yarn
yarn dev
```

Isso iniciará o servidor de desenvolvimento em [http://localhost:5173](http://localhost:5173).

### Construção para Produção

```bash
# Usando npm
npm run build

# OU usando Yarn
yarn build
```

Os arquivos de produção serão gerados na pasta `dist`.

### Visualizando a Build de Produção Localmente

```bash
# Usando npm
npm run preview

# OU usando Yarn
yarn preview
```

Isso iniciará um servidor para visualizar a build de produção em [http://localhost:4173](http://localhost:4173).

## 📁 Estrutura do Projeto

Consulte o arquivo `ESTRUTURA_REACT.md` para uma visão detalhada da estrutura de pastas e arquivos do projeto.

## 📝 Configuração do Servidor de API

O frontend React precisa se comunicar com um servidor backend para funcionalidades completas. Por padrão, o projeto espera uma API REST em `http://localhost:5000/api`. 

Para implementar o backend, você pode:

1. **Usar o servidor Flask existente**: Configure o servidor Flask de acordo com as instruções no arquivo `README.md` original.

2. **Implementar uma nova API**: Use qualquer framework de sua preferência (Express.js, NestJS, etc.) seguindo a estrutura de endpoints esperada pelo frontend.

3. **Modo de desenvolvimento sem backend**: Defina `VITE_MOCK_DATA=true` no arquivo `.env` para usar dados simulados durante o desenvolvimento.

## 🌐 Implantação

Para instruções detalhadas sobre como implantar este projeto em várias plataformas, consulte o arquivo `DEPLOY_REACT.md`.

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes com cobertura
npm run test:coverage
```

## 📚 Documentação Adicional

- [Componentes](COMPONENTES_REACT.md) - Documentação detalhada de componentes
- [API](API_DOCS.md) - Documentação da API
- [Contribuição](CONTRIBUTING.md) - Guia para contribuidores

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o guia de contribuição antes de submeter pull requests.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [Font Awesome](https://fontawesome.com/) - Pela biblioteca de ícones
- [Unsplash](https://unsplash.com/) - Por imagens de alta qualidade
- [React Community](https://reactjs.org/community/support.html) - Pelo suporte contínuo