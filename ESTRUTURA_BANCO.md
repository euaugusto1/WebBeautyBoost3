# Estrutura do Banco de Dados LinkStack

Este documento detalha a estrutura do banco de dados usado pelo LinkStack, explicando tabelas, relacionamentos e campos importantes.

## Visão Geral do Modelo de Dados

O LinkStack utiliza um modelo de dados relacional implementado com SQLAlchemy. A aplicação usa 5 tabelas principais para armazenar todos os dados necessários para gerenciar os perfis de usuários e suas personalizações.

### Diagrama ER Simplificado

```
User (1) ---< SocialLink (N)
  |
  +---< ProfileLink (N)
  |
  +---< FooterItem (N)
  |
  +--- ThemeSetting (1)
```

## Descrição Detalhada das Tabelas

### 1. Tabela `users`

Armazena informações básicas do usuário e suas configurações gerais de perfil.

| Campo          | Tipo          | Descrição                                |
|----------------|---------------|-----------------------------------------|
| id             | Integer (PK)  | Identificador único do usuário          |
| username       | String        | Nome de usuário único                   |
| email          | String        | Email de contato (único)                |
| password_hash  | String        | Hash da senha (criptografada)           |
| name           | String        | Nome completo ou de exibição            |
| bio            | String        | Pequena biografia do usuário            |
| description    | String        | Descrição adicional abaixo da bio       |
| phone          | String        | Número de telefone                      |
| profile_image  | String        | Caminho da imagem de perfil             |
| copyright_text | String        | Texto personalizado de copyright        |
| copyright_icon | String        | Ícone usado no copyright (Font Awesome) |
| created_at     | DateTime      | Data de criação do registro             |
| updated_at     | DateTime      | Data da última atualização              |

### 2. Tabela `social_links`

Armazena links para redes sociais e suas configurações.

| Campo      | Tipo          | Descrição                                |
|------------|---------------|-----------------------------------------|
| id         | Integer (PK)  | Identificador único do link social       |
| user_id    | Integer (FK)  | Referência ao usuário (users.id)         |
| platform   | String        | Nome da plataforma (ex: instagram)       |
| url        | String        | URL completa do perfil social            |
| icon       | String        | Classe CSS do ícone (Font Awesome)       |
| created_at | DateTime      | Data de criação do registro              |
| updated_at | DateTime      | Data da última atualização               |

### 3. Tabela `profile_links`

Armazena os links principais exibidos no perfil e estatísticas.

| Campo       | Tipo          | Descrição                                |
|-------------|---------------|-----------------------------------------|
| id          | Integer (PK)  | Identificador único do link              |
| user_id     | Integer (FK)  | Referência ao usuário (users.id)         |
| title       | String        | Título do link                           |
| url         | String        | URL do link                              |
| icon        | String        | Classe CSS do ícone (Font Awesome)       |
| css_class   | String        | Classe CSS adicional para estilização    |
| position    | Integer       | Ordem de exibição no perfil              |
| is_active   | Boolean       | Status do link (ativo/inativo)           |
| click_count | Integer       | Contador de cliques                      |
| created_at  | DateTime      | Data de criação do registro              |
| updated_at  | DateTime      | Data da última atualização               |

### 4. Tabela `theme_settings`

Armazena as configurações de tema e aparência do perfil.

| Campo              | Tipo          | Descrição                                |
|--------------------|---------------|-----------------------------------------|
| id                 | Integer (PK)  | Identificador único da configuração      |
| user_id            | Integer (FK)  | Referência ao usuário (users.id)         |
| theme_name         | String        | Nome do tema usado (ex: theme-2)         |
| background_pattern | String        | Nome do padrão de fundo animado          |
| custom_css         | Text          | CSS personalizado adicional              |
| custom_colors      | Text          | Cores personalizadas (formato JSON)      |
| created_at         | DateTime      | Data de criação do registro              |
| updated_at         | DateTime      | Data da última atualização               |

### 5. Tabela `footer_items`

Armazena itens personalizados do rodapé.

| Campo      | Tipo          | Descrição                                |
|------------|---------------|-----------------------------------------|
| id         | Integer (PK)  | Identificador único do item de footer    |
| user_id    | Integer (FK)  | Referência ao usuário (users.id)         |
| text       | String        | Texto para exibição                      |
| icon       | String        | Classe CSS do ícone (Font Awesome)       |
| url        | String        | URL opcional para o item (se linkável)    |
| is_brand   | Boolean       | Se é um item de marca                    |
| position   | Integer       | Ordem de exibição no rodapé              |
| created_at | DateTime      | Data de criação do registro              |
| updated_at | DateTime      | Data da última atualização               |

## Índices e Performance

Para otimizar o desempenho do banco de dados, os seguintes índices são recomendados:

1. Índices de Chave Estrangeira:
   - `social_links.user_id`
   - `profile_links.user_id`
   - `theme_settings.user_id`
   - `footer_items.user_id`

2. Índices Específicos:
   - `users.username` (para buscas por nome de usuário)
   - `users.email` (para verificações de email)
   - `profile_links.position` (para ordenação de links)
   - `footer_items.position` (para ordenação de itens do rodapé)

## Migrações e Evolução do Esquema

A aplicação utiliza o mecanismo padrão do SQLAlchemy para criação de tabelas durante a inicialização. Se forem necessárias migrações mais complexas, recomenda-se a implementação de Alembic ou Flask-Migrate para gerenciar alterações de esquema.

### Exemplos de SQL para Verificação

Para verificar a estrutura do banco de dados em PostgreSQL:

```sql
-- Listar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar estrutura de uma tabela específica
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users';

-- Verificar contagem de registros
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM profile_links;
```

## Considerações sobre Segurança

O sistema implementa as seguintes práticas de segurança:

1. **Armazenamento de Senhas**: As senhas são armazenadas com hash seguro usando Werkzeug
2. **Proteção contra SQL Injection**: Uso de ORM SQLAlchemy para consultas parametrizadas
3. **Dados Sensíveis**: Nenhum dado sensível é armazenado em texto simples

## Backup e Recuperação

Para realizar o backup do banco de dados PostgreSQL:

```bash
pg_dump -h hostname -U username database_name > backup_file.sql
```

Para restaurar o backup:

```bash
psql -h hostname -U username database_name < backup_file.sql
```