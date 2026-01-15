from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
DB_URL = os.getenv("DATABASE_URL","postgresql+psycopg2://fin:finpass@postgres:5432/fintech")
SCHEMA = "config"
engine = create_engine(DB_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
def ensure_schema():
    with engine.connect() as conn:
        conn.execute(text('CREATE SCHEMA IF NOT EXISTS config'))
        conn.commit()
