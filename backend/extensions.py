from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# ─── Core extensions (initialized in app.py via init_app) ────
db   = SQLAlchemy()
cors = CORS()

print("[EXTENSIONS] db and cors instances created")
