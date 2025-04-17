# Correção de Problemas de Deploy no EasyPanel

## Problema Identificado

No EasyPanel, o buildpack do Heroku está procurando por um arquivo chamado `requirements.txt` (em minúsculas), mas nosso projeto utiliza o nome `REQUISITOS.txt` (em maiúsculas). Isso causa a falha na detecção do Python pelo buildpack.

## Soluções

### 1. Usando Docker (Recomendado)

A melhor e mais confiável solução é utilizar o Dockerfile.flask para o deploy. Esta abordagem contorna as limitações dos buildpacks e oferece mais controle sobre o processo de build.

- No EasyPanel, selecione **Custom** como tipo de serviço
- Escolha a opção **Build from Dockerfile**
- Aponte para o repositório Git
- Especifique o arquivo Dockerfile: `Dockerfile.flask`

Este Dockerfile foi criado especificamente para a aplicação Flask, incluindo:
- Conversão automática de REQUISITOS.txt para requirements.txt
- Configuração apropriada de gunicorn com workers e threads
- Variáveis de ambiente configuradas corretamente

### 2. Usando requirements.txt.deploy

Se preferir continuar com o buildpack, você pode:
1. Renomear manualmente `requirements.txt.deploy` para `requirements.txt` no seu repositório
2. Fazer commit e push dessa alteração
3. Configurar o EasyPanel para usar o buildpack Heroku (heroku/buildpacks:20)

### 3. Branch Separado para Deploy

Outra alternativa é manter um branch específico para deploy onde:
1. `REQUISITOS.txt` é renomeado para `requirements.txt`
2. Aponte o EasyPanel para este branch específico de deploy

## Verificação

Após implementar qualquer uma destas soluções, verifique os logs de build no EasyPanel para garantir que:
1. As dependências estão sendo instaladas corretamente
2. O aplicativo está sendo iniciado sem erros
3. As variáveis de ambiente estão acessíveis ao aplicativo

Para informações mais detalhadas, consulte o documento `INSTRUÇOES_DEPLOY_MANUAL.md`