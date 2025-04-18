import os
from dotenv import load_dotenv
import psycopg2
import time

# Carregar variáveis de ambiente
load_dotenv()

# Configurações do banco de dados
db_host = os.environ.get("PGHOST")
db_port = os.environ.get("PGPORT")
db_user = os.environ.get("PGUSER")
db_password = os.environ.get("PGPASSWORD")
db_name = os.environ.get("PGDATABASE")
db_url = os.environ.get("DATABASE_URL")

print("Conectando ao banco de dados PostgreSQL...")
print(f"Host: {db_host}")
print(f"Porta: {db_port}")
print(f"Usuário: {db_user}")
print(f"Nome do Banco: {db_name}")
print(f"URL: {db_url}")

# Tentar conexão usando variáveis individuais
try:
    print("\nTentando conexão com variáveis individuais...")
    connection = psycopg2.connect(
        host=db_host,
        port=db_port,
        user=db_user,
        password=db_password,
        dbname=db_name
    )
    cursor = connection.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"Conexão bem-sucedida! Versão do PostgreSQL: {version[0]}")
    
    # Listar tabelas
    print("\nTabelas no banco de dados:")
    cursor.execute("""
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    for table in tables:
        print(f"- {table[0]}")
    
    # Fechar conexão
    cursor.close()
    connection.close()
    print("Conexão encerrada com sucesso.")
except Exception as e:
    print(f"Erro na conexão com variáveis individuais: {e}")

# Aguardar um momento antes de tentar novamente com DATABASE_URL
time.sleep(1)

# Tentar conexão usando DATABASE_URL
try:
    print("\nTentando conexão com DATABASE_URL...")
    connection = psycopg2.connect(db_url)
    cursor = connection.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"Conexão bem-sucedida! Versão do PostgreSQL: {version[0]}")
    
    # Listar tabelas
    print("\nTabelas no banco de dados:")
    cursor.execute("""
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    for table in tables:
        print(f"- {table[0]}")
    
    # Fechar conexão
    cursor.close()
    connection.close()
    print("Conexão encerrada com sucesso.")
except Exception as e:
    print(f"Erro na conexão com DATABASE_URL: {e}")