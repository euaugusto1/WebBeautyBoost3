# Solução para Contêiner que Não Inicia

Se você está recebendo o erro `Error response from daemon: container <ID> is not running`, isso significa que o contêiner Docker está falhando durante a inicialização. Aqui estão as etapas para resolver o problema:

## 1. Verifique os Logs do Contêiner

No EasyPanel ou em qualquer plataforma Docker, verifique os logs do contêiner para entender por que ele está falhando:

```bash
# No servidor onde o EasyPanel está rodando
docker logs <ID_DO_CONTAINER>
```

## 2. Problemas Comuns e Soluções

### Problema: Falha na Conexão com o Banco de Dados

**Sintomas nos logs:**
- `OperationalError: could not connect to server`
- `Connection refused`

**Solução:**
1. Verifique se o serviço de banco de dados está rodando
2. Confirme que as variáveis de ambiente estão corretas:
   ```
   DATABASE_URL=postgresql://postgres:senha@linkstack-db:5432/postgres
   PGHOST=linkstack-db
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=sua_senha_segura
   PGDATABASE=postgres
   ```
3. Certifique-se de que o nome do host do banco de dados está correto (geralmente o nome do serviço no docker-compose ou no EasyPanel)

### Problema: Permissões ou Dependências

**Sintomas nos logs:**
- `Permission denied`
- `ModuleNotFoundError: No module named 'X'`

**Solução:**
1. Para problemas de dependências, verifique se o arquivo REQUISITOS.txt está atualizado
2. Se faltar dependências específicas, adicione-as diretamente no Dockerfile:
   ```dockerfile
   # Adicione esta linha ao Dockerfile para incluir outras dependências
   RUN pip install --no-cache-dir biblioteca-adicional
   ```

### Problema: Erro no Código da Aplicação

**Sintomas nos logs:**
- Stack traces de Python
- Erros específicos da aplicação

**Solução:**
1. Corrija os erros no código
2. Faça um novo build e deploy

## 3. Solução de Timeout de Inicialização

Se o contêiner estiver sendo encerrado por demorar demais para iniciar:

```dockerfile
# Modifique o Dockerfile para incluir um script de inicialização
COPY ./healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh

HEALTHCHECK --interval=5s --timeout=3s --start-period=30s --retries=3 \
  CMD /healthcheck.sh

# Modifique o comando para usar um wrapper de inicialização
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 --graceful-timeout 30 main:app"]
```

### Conteúdo do healthcheck.sh:
```bash
#!/bin/sh
# Verifica se a aplicação está respondendo
curl -f http://localhost:5000/ || exit 1
```

## 4. Configuração de Inicialização Mais Robusta

Crie um script `entrypoint.sh` para tornar o processo de inicialização mais robusto:

```bash
#!/bin/bash
set -e

# Esperar o banco de dados estar disponível
echo "Esperando o banco de dados..."
until PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c '\q'; do
  echo "Banco de dados indisponível - esperando..."
  sleep 2
done
echo "Banco de dados disponível!"

# Iniciar a aplicação
exec gunicorn --bind 0.0.0.0:5000 --workers 4 --threads 2 main:app
```

Então modifique o Dockerfile:

```dockerfile
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
```

## 5. Configurações de Hardware no EasyPanel

Se o contêiner estiver falhando por falta de recursos:

1. No EasyPanel, aumente os recursos alocados:
   - Memória: pelo menos 256MB
   - CPU: pelo menos 0.1 core
   - Limite de memória: pelo menos 512MB

## 6. Problemas de PID 1 no Docker

Em alguns casos, os processos dentro do Docker podem não receber sinais corretamente:

```dockerfile
# Instale tini para lidar com sinais corretamente
RUN apt-get update && apt-get install -y tini
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--threads", "2", "main:app"]
```

Tente estas soluções uma a uma até resolver o problema do contêiner que não inicia.