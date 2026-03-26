import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from extensions import db
import models

def reset_db():
    app = create_app()
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables from current schema...")
        db.create_all()
        print("Successfully reset the database schema.")

if __name__ == '__main__':
    reset_db()
