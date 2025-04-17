# Guia de Desenvolvimento - LinkStack

Este documento fornece detalhes sobre a estrutura do código, componentes principais e guidelines para desenvolvimento do LinkStack.

## Arquitetura da Aplicação

O LinkStack segue uma arquitetura MVC (Model-View-Controller) simplificada usando Flask:

- **Models**: Definidos em `models.py`, representam as entidades do banco de dados
- **Views**: Templates HTML em `templates/`, com a principal interface em `index.html`
- **Controllers**: Rotas e lógica de negócios em `app.py`

### Estrutura de Diretórios

```
/
├── app.py                 # Configuração do Flask e rotas principais
├── main.py                # Ponto de entrada da aplicação
├── models.py              # Modelos do SQLAlchemy
├── templates/             # Templates HTML
│   └── index.html         # Interface principal (página única)
├── static/                # Arquivos estáticos
│   ├── css/               # Estilos CSS
│   │   ├── styles.css     # Estilos principais
│   │   ├── edit-mode.css  # Estilos para modo de edição
│   │   └── ...
│   ├── js/                # Scripts JavaScript
│   │   ├── main.js        # Script principal
│   │   ├── edit-mode.js   # Funcionalidades de edição
│   │   ├── social-links.js # Gerenciamento de links sociais
│   │   └── ...
│   └── images/            # Imagens e recursos
│       └── uploads/       # Uploads de imagens (volume persistente)
└── .env.example           # Exemplo de variáveis de ambiente
```

## Fluxo de Dados Principal

1. O usuário acessa a aplicação através da rota raiz (`/`)
2. O Flask renderiza `index.html` com os dados do usuário
3. O JavaScript manipula interações e edições no lado do cliente
4. As atualizações são enviadas para o backend via AJAX
5. As alterações são persistidas no banco de dados

## Componentes Principais

### 1. Backend (Python/Flask)

O backend é construído com Flask e SQLAlchemy:

- **app.py**: Configura o Flask, define rotas e manipuladores
- **models.py**: Define os modelos de dados usando SQLAlchemy
- **main.py**: Inicia a aplicação

### 2. Frontend

A interface do usuário é construída com HTML, CSS e JavaScript vanilla:

- **index.html**: Template principal (SPA - Single Page Application)
- **styles.css**: Estilos gerais e definições de tema
- **edit-mode.css**: Estilos específicos para o modo de edição
- **main.js**: Funcionalidades globais e inicialização
- **edit-mode.js**: Interface de edição e manipulação de formulários
- **animated-patterns.js**: Gerencia padrões de fundo animados
- **social-links.js**: Gerencia links sociais e ícones

## Lista de Endpoints da API

### Páginas

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Página principal que exibe o perfil |

### API JSON

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/update-profile` | POST | Atualiza os dados do perfil |
| `/click-link/<link_id>` | POST | Registra clique e retorna URL |
| `/get-link-stats/<link_id>` | GET | Obtém estatísticas de um link |

## Scripts JavaScript

### main.js

Responsável pela inicialização da aplicação e funções compartilhadas:

```javascript
// Funções principais:
- Inicializa AOS (Animate On Scroll)
- Gerencia o tema switcher
- Configura eventos de clique nos links
- Atualiza estatísticas de cliques
```

### edit-mode.js

Gerencia toda a funcionalidade do modo de edição:

```javascript
// Funções principais:
- enableEditMode(): Ativa o modo de edição 
- disableEditMode(): Desativa o modo de edição
- saveChanges(): Salva as alterações no backend
- makeFieldsEditable(): Converte elementos estáticos em editáveis
- addNewSocialLink(): Adiciona novo link social
- addNewProfileLink(): Adiciona novo link de perfil
- addNewFooterItem(): Adiciona novo item ao footer
```

### animated-patterns.js

Gerencia os padrões de fundo animados:

```javascript
// Funções principais:
- applyAnimatedPattern(): Aplica um padrão específico
- setupParticles(): Configura o padrão de partículas
- setupBubbles(): Configura o padrão de bolhas
- setupStarfield(): Configura o padrão de estrelas
```

## Componentes CSS

### styles.css

Estilos base e definições de tema:

```css
/* Seções principais:
- Variáveis CSS (temas e gradientes)
- Layout responsivo
- Estilos de cartão e container
- Animações e efeitos
- Links e botões
*/
```

### edit-mode.css

Estilos específicos para o modo de edição:

```css
/* Seções principais:
- Botões de edição e controles
- Campos editáveis
- Wrappers de edição de social links
- Wrappers de edição de profile links
- Seletor de tema e padrão
*/
```

## Modelos de Dados e Relações

Consulte o arquivo [ESTRUTURA_BANCO.md](ESTRUTURA_BANCO.md) para detalhes completos sobre a estrutura do banco de dados.

## Temas e Padrões de Fundo

### Temas

O sistema suporta 50 temas diferentes, definidos como classes CSS no formato `theme-XX`. Os temas são compostos por gradientes e cores coordenadas.

**Personalização de temas:**

Para adicionar novos temas, siga estes passos:

1. Adicione variáveis CSS em `styles.css`:
   ```css
   .theme-XX {
     --gradient: linear-gradient(135deg, #color1, #color2);
     --accent: #accent-color;
     --accent-rgb: R, G, B;  /* Valores RGB do accent */
     --text: #text-color;
     --text-secondary: #secondary-text-color;
     --card-bg: rgba(255, 255, 255, 0.1);
   }
   ```

2. Adicione a opção no seletor de temas em `index.html`

### Padrões de Fundo

Os padrões de fundo são animações JavaScript que adicionam movimento e interesse visual. Os padrões são:

- **particles**: Partículas flutuantes com movimento aleatório
- **wave**: Ondas em movimento
- **geometric**: Formas geométricas
- **bubbles**: Bolhas subindo
- **starfield**: Campo de estrelas
- **ripple**: Efeito de ondulação
- **lines**: Linhas animadas
- **none**: Sem padrão

## Extensão e Contribuição

### Adição de Novos Recursos

1. **Novos tipos de links**: Estenda a classe `ProfileLink` em `models.py`
2. **Novos efeitos visuais**: Adicione em `animated-patterns.js`
3. **Novos temas**: Adicione em `styles.css` e ao seletor em `index.html`

### Considerações para Pull Requests

1. Mantenha o JavaScript vanilla (sem frameworks)
2. Siga os padrões de estilo existentes
3. Documente novos recursos
4. Adicione animações com bom desempenho (considere dispositivos móveis)

## Depuração e Solução de Problemas

### Problemas comuns

1. **Banco de dados**: Problemas de conexão ou tabelas não criadas
   - Solução: Verifique variáveis de ambiente e execute `db.create_all()`

2. **Uploads de imagens**: Falhas ao salvar imagens
   - Solução: Verifique permissões do diretório `static/images/uploads`

3. **Animações de fundo**: Desempenho ruim em dispositivos móveis
   - Solução: Reduza a complexidade ou desative animações em dispositivos de baixo desempenho

### Logs e Depuração

O Flask está configurado para mostrar logs detalhados quando o modo de depuração está ativado:

```
DEBUG=True
```

Os logs JavaScript são exibidos no console do navegador.

## Boas Práticas

1. **Segurança:**
   - Sempre sanitize entradas de usuário
   - Use SQLAlchemy para evitar SQL injection
   - Não armazene senhas em texto claro

2. **Performance:**
   - Minifique CSS e JavaScript em produção
   - Otimize imagens
   - Use paginação para grandes conjuntos de dados

3. **Responsividade:**
   - Teste em diferentes tamanhos de tela
   - Priorize a experiência em dispositivos móveis

4. **Acessibilidade:**
   - Use atributos ARIA apropriadamente
   - Garanta contraste adequado
   - Teste com leitores de tela