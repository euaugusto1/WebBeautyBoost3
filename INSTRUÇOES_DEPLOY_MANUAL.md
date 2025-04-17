# Instruções para Deploy Manual no EasyPanel

Com base nos erros que estamos enfrentando, a melhor solução é fazer um deploy manual que contorne as limitações do buildpack automático do EasyPanel.

## Solução 1: Deploy Manual com Dockerfile

Esta é a solução mais confiável e recomendada:

1. **Crie um Dockerfile personalizado**:
   - No repositório, renomeie o arquivo `requirements.txt.deploy` para `requirements.txt` (ou crie um novo com o mesmo conteúdo)
   - Utilize o arquivo Dockerfile existente no repositório ou crie um novo

2. **Configuração do EasyPanel**:
   - No EasyPanel, selecione "Custom" como tipo de serviço
   - Em vez de usar configuração Git, escolha "Build from Dockerfile"
   - Aponte para seu repositório Git
   - Não é necessário especificar comando de build ou start, pois o Dockerfile já os contém

3. **Configure as variáveis de ambiente**:
   ```
   DATABASE_URL=postgresql://postgres:senha@linkstack-db:5432/postgres
   PGHOST=linkstack-db
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=sua_senha_segura
   PGDATABASE=postgres
   SESSION_SECRET=sua_chave_secreta_aqui
   FLASK_ENV=production
   DEBUG=False
   ```

## Solução 2: Repositório Modificado para Deploy

Se preferir continuar usando a abordagem baseada em Git:

1. **Crie um novo branch no seu repositório especificamente para deploy**:
   ```bash
   git checkout -b deploy
   git mv REQUISITOS.txt requirements.txt
   git commit -m "Rename REQUISITOS.txt to requirements.txt for deployment"
   git push origin deploy
   ```

2. **Configuração do EasyPanel**:
   - Use a configuração Git, mas aponte para o branch `deploy` em vez de `main`
   - Builder: `heroku/buildpacks:20`
   - Comando de build: `pip install -r requirements.txt`
   - Comando de start: `gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 main:app`

3. **Configure as mesmas variáveis de ambiente mencionadas acima**

## Solução 3: Arquivo Procfile modificado

O buildpack Heroku para Python primeiro detecta o arquivo requirements.txt, mas depois executa o comando no Procfile. Você pode tentar:

1. **Modificar o Procfile**:
   ```
   web: cp REQUISITOS.txt requirements.txt && pip install -r requirements.txt && gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 main:app
   ```

2. **Criar um arquivo vazio requirements.txt**:
   ```bash
   touch requirements.txt
   git add requirements.txt
   git commit -m "Add empty requirements.txt for Heroku buildpack detection"
   git push
   ```

3. **Configuração do EasyPanel**:
   - Mesmas configurações, mas sem comando de build
   - O Procfile modificado gerenciará a instalação e execução

## Verificação

Após a implantação, verifique os logs para garantir que:
1. O Python foi instalado corretamente
2. As dependências foram instaladas com sucesso
3. O aplicativo iniciou sem erros

Se ocorrerem problemas, os logs detalhados do EasyPanel devem ajudar a identificar a causa raiz.