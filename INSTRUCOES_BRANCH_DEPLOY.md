# Instruções para Deploy via Branch Específico

Este documento detalha como preparar um branch específico para deploy no EasyPanel, permitindo que você mantenha seu código-fonte original enquanto cria uma versão otimizada para implantação.

## 1. Criar Branch de Deploy

Execute os seguintes comandos no seu ambiente de desenvolvimento local:

```bash
# Clone o repositório (se ainda não tiver feito)
git clone [URL_DO_SEU_REPOSITÓRIO]
cd [NOME_DO_REPOSITÓRIO]

# Certifique-se de que seu branch principal (main/master) está atualizado
git checkout main
git pull

# Crie e mude para um novo branch chamado 'deploy'
git checkout -b deploy

# Renomeie REQUISITOS.txt para requirements.txt
git mv REQUISITOS.txt requirements.txt

# Crie um Procfile para o Heroku/EasyPanel
echo "web: gunicorn --bind 0.0.0.0:\$PORT --workers 4 --threads 2 main:app" > Procfile

# Adicione as mudanças ao git
git add requirements.txt Procfile
git commit -m "Preparar repositório para deploy no EasyPanel"

# Envie o branch para o repositório remoto
git push origin deploy
```

## 2. Configurar o EasyPanel

1. **Acesse o painel do EasyPanel**
   - Faça login em sua conta
   - Vá para o projeto onde deseja implantar a aplicação

2. **Crie um novo serviço**
   - Clique em "Add service"
   - Selecione "Web Service" ou "Custom App"

3. **Configure as opções de build**
   - Repositório Git: [URL_DO_SEU_REPOSITÓRIO]
   - Branch: **deploy** (importante: selecione o branch que acabamos de criar)
   - Builder: **heroku/buildpacks:20**
   - Comando de Build: (deixe vazio)
   - Comando de Start: (deixe vazio para usar o Procfile)

4. **Configure as variáveis de ambiente**
   ```
   DATABASE_URL=postgresql://postgres:senha@linkstack-db:5432/postgres
   PGHOST=linkstack-db
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=sua_senha_segura
   PGDATABASE=postgres
   SESSION_SECRET=sua_chave_secreta_aqui
   PORT=5000
   ```

5. **Configure rede e portas**
   - Porta: 5000
   - Protocolo: HTTP

6. **Salve e implante**
   - Clique em "Save" ou "Deploy"
   - Acompanhe os logs de build para verificar se tudo está funcionando

## 3. Manter o Branch de Deploy Atualizado

Sempre que fizer alterações no branch principal (main/master) que precisam ser implantadas:

```bash
# Mude para o branch principal e atualize-o
git checkout main
git pull

# Mude para o branch deploy e integre as alterações
git checkout deploy
git merge main

# Certifique-se de que REQUISITOS.txt permanece como requirements.txt
# Se o merge reverter o nome do arquivo:
git mv REQUISITOS.txt requirements.txt
git add requirements.txt
git commit -m "Manter requirements.txt para deploy"

# Envie as atualizações para o repositório remoto
git push origin deploy
```

## 4. Solução de Problemas

### Erro de versão do Python
Se o EasyPanel não detectar corretamente a versão do Python, crie um arquivo `runtime.txt` no branch deploy:
```
echo "python-3.11.x" > runtime.txt
git add runtime.txt
git commit -m "Especificar versão do Python"
git push origin deploy
```

### Erro de dependências
Se houver problemas com a instalação de dependências, verifique se o arquivo requirements.txt está completo e tente isolar as dependências problemáticas em um ambiente virtual local primeiro.

### Erro de conexão ao banco de dados
Verifique se as variáveis de ambiente estão corretamente configuradas e se o serviço de banco de dados está acessível a partir do serviço da aplicação no EasyPanel.