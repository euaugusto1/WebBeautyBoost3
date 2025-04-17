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
    && rm -rf /var/lib/apt/lists/*

# Verificar se existe REQUISITOS.txt e copiar para requirements.txt
COPY REQUISITOS.txt* ./
RUN if [ -f REQUISITOS.txt ]; then \
    cp REQUISITOS.txt requirements.txt; \
fi

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código-fonte da aplicação
COPY . .

# Definir variáveis de ambiente
ENV FLASK_APP=main.py
ENV FLASK_ENV=production
ENV DEBUG=False

# Expor porta para a aplicação
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--threads", "2", "main:app"]