# Guia de Implantação no EasyPanel

Este guia explica como implantar o LinkStack no EasyPanel, uma plataforma de hospedagem que oferece interface amigável para gerenciar aplicativos containerizados.

## Pré-requisitos

1. Conta no EasyPanel
2. Servidor com EasyPanel instalado
3. Banco de dados PostgreSQL acessível (pode ser instalado no próprio EasyPanel)

## Passo a Passo para Implantação

### 1. Preparação do Banco de Dados

1. No EasyPanel, crie um serviço PostgreSQL:
   - Nome: `linkstack-db`
   - Versão: 14 ou superior
   - Senha: Defina uma senha forte
   - Volume persistente: Ativado

2. Anote as credenciais geradas:
   - Usuário: geralmente `postgres`
   - Senha: a senha definida por você
   - Host: `linkstack-db`
   - Porta: `5432`
   - Banco de dados: `postgres` (padrão) ou crie um específico (`linkstack`)

### 2. Configuração da Aplicação

1. No EasyPanel, crie um novo serviço:
   - Nome: `linkstack`
   - Tipo: Custom
   - Imagem: `linkstack` (se você tiver uma imagem Docker) ou use a configuração Git

2. Configuração através do Git:
   - URL do repositório: seu repositório Git
   - Branch: `main` (ou o que você estiver usando)
   - Builder: `heroku/buildpacks:20` (em vez de heroku/builder:24)
   - Build Command: `pip install -r REQUISITOS.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 main:app`

   **IMPORTANTE**: Certifique-se de que seu repositório Git esteja configurado como público ou que você tenha adicionado uma chave SSH ao EasyPanel.

3. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=postgresql://postgres:senha@linkstack-db:5432/postgres
   PGHOST=linkstack-db
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=sua_senha
   PGDATABASE=postgres
   SESSION_SECRET=chave_secreta_gerada_aleatoriamente
   FLASK_ENV=production
   DEBUG=False
   ```

4. Configuração das portas:
   - Porta interna: `$PORT` (o EasyPanel define essa variável)
   - Porta HTTP: `80` (ou sua preferência)
   - Ative HTTPS se disponível

5. Configure volumes persistentes:
   - `/app/static/images/uploads` -> `linkstack-uploads` (para armazenar imagens de perfil)

### 3. Migração do Banco de Dados

Após a implantação inicial, você precisará inicializar o banco de dados. 
Acesse o shell do container ou execute os comandos na interface do EasyPanel:

```bash
# A aplicação já está configurada para criar as tabelas automaticamente
# Se necessário, você pode forçar a inicialização através do shell do app:
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### 4. Configuração de Domínio (Opcional)

1. No EasyPanel, acesse as configurações do seu serviço
2. Configure o domínio personalizado (se disponível)
3. Ative SSL/TLS para o domínio

### 5. Verificação da Implantação

1. Acesse seu aplicativo pela URL fornecida pelo EasyPanel
2. Verifique se todas as funcionalidades estão operacionais
3. Confirme que as uploads de imagens funcionam e são persistentes

## Estrutura de Arquivos Importante

Os principais componentes para implantar corretamente são:

```
/app
├── main.py               # Ponto de entrada da aplicação
├── app.py                # Configurações e rotas
├── models.py             # Modelos do banco de dados
├── templates/            # Templates HTML
│   └── index.html        # Página principal
├── static/               # Arquivos estáticos
│   ├── css/              # Estilos CSS
│   ├── js/               # Scripts JavaScript
│   └── images/           # Imagens estáticas
│       └── uploads/      # Diretório de uploads (precisa de volume persistente)
├── .env.example          # Exemplo de configuração de variáveis
└── REQUISITOS.txt        # Dependências
```

## Migração e Backup

### Backup do Banco de Dados

```bash
# Backup do banco PostgreSQL
pg_dump -h linkstack-db -U postgres -d postgres > linkstack_backup.sql
```

### Restauração do Banco de Dados

```bash
# Restauração do banco PostgreSQL
psql -h linkstack-db -U postgres -d postgres < linkstack_backup.sql
```

## Solução de Problemas

### Erros de Implantação com GitHub

Se você estiver enfrentando erros ao implantar via GitHub no EasyPanel:

1. **Problemas de Acesso ao Repositório**:
   - Verifique se o repositório está público ou se você adicionou uma chave SSH ao EasyPanel
   - Nas configurações do serviço no EasyPanel, vá em "Settings" > "Git" e verifique as credenciais

2. **Problemas com o Branch**:
   - Certifique-se de que o nome do branch está correto (main, master, etc.)
   - Verifique se o branch contém todos os arquivos necessários

3. **Erros de Build**:
   - Verifique os logs de build no EasyPanel para mensagens de erro específicas
   - Certifique-se de que o arquivo REQUISITOS.txt existe na raiz do repositório
   - Adicione um arquivo Procfile na raiz com: `web: gunicorn --bind 0.0.0.0:$PORT main:app`

4. **Solução Alternativa**:
   - Se o deploy via Git continuar falhando, considere usar o método Docker
   - Clone seu repositório localmente, construa a imagem e envie para o registro do EasyPanel

### Erro com heroku/builder:24

Se você encontrar erros ao usar o `heroku/builder:24`, siga estas etapas:
1. Mude o builder para `heroku/buildpacks:20` nas configurações do serviço
2. O builder mais recente (24) pode ter incompatibilidades com algumas dependências Python
3. Se o erro persistir, verifique os logs de construção para mensagens específicas de erro

### Problemas de Conexão com o Banco de Dados

Verifique:
1. Variáveis de ambiente configuradas corretamente
2. Serviço PostgreSQL está em execução
3. Credenciais de acesso corretas
4. Firewall permitindo conexão entre os serviços

### Problemas com Upload de Imagens

Verifique:
1. O volume persistente está configurado corretamente
2. As permissões do diretório de uploads são corretas
3. Há espaço em disco suficiente

### Logs e Monitoramento

1. Use a interface do EasyPanel para ver logs em tempo real
2. Configure alertas para monitorar a saúde do aplicativo

## Atualizações

Para atualizar seu aplicativo:

1. Push das alterações para o repositório Git
2. Reconstrua o serviço no EasyPanel
3. Verifique se as migrações de banco de dados são necessárias