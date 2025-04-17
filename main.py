import os
from app import app  # noqa: F401

if __name__ == "__main__":
    # Obter a porta do ambiente (para compatibilidade com EasyPanel)
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("DEBUG", "False").lower() == "true"
    
    app.run(host="0.0.0.0", port=port, debug=debug)
