import sys
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "keyser")

DB_URI = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DB_URI)

def check_logs():
    print(f"Connecting to {DB_NAME}...")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, insight_id, validation_stage, status, notes FROM validation_logs ORDER BY id DESC LIMIT 15;"))
        rows = result.fetchall()
        
        print(f"\n--- LATEST 15 VALIDATION LOGS ---")
        if not rows:
            print("No logs found.")
        for row in rows:
            print(f"ID: {row[0]} | Insight: {row[1]} | Stage: {row[2]:<15} | Status: {row[3]:<10} | Notes: {row[4]}")

if __name__ == "__main__":
    check_logs()
