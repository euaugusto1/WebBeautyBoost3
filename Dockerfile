FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Configurar para que o pip não reclame sobre ambientes gerenciados externamente
ENV PIP_BREAK_SYSTEM_PACKAGES=1

# Instalar dependências do sistema necessárias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    postgresql-client \
    tini \
    && rm -rf /var/lib/apt/lists/*

# Verificar se existe REQUISITOS.txt e copiar para requirements.txt
COPY REQUISITOS.txt* ./
RUN if [ -f REQUISITOS.txt ]; then \
    cp REQUISITOS.txt requirements.txt; \
fi

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copiar scripts de healthcheck e entrypoint
COPY healthcheck.sh /healthcheck.sh
COPY entrypoint.sh /entrypoint.sh

# Tornar os scripts executáveis
RUN chmod +x /healthcheck.sh /entrypoint.sh

# Copiar código-fonte da aplicação
COPY . .

# Definir variáveis de ambiente
ENV FLASK_APP=main.py
ENV FLASK_ENV=production
ENV DEBUG=False
ENV PYTHONUNBUFFERED=1

# Configurar healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD /healthcheck.sh

# Expor porta para a aplicação
EXPOSE 5000

# Usar tini como ponto de entrada para manipulação correta de sinais
ENTRYPOINT ["/usr/bin/tini", "--"]

# Usar o script de entrypoint para inicialização robusta
CMD ["/entrypoint.sh"]