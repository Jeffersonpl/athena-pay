from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import re, os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
DB_URL = os.getenv("DATABASE_URL","postgresql+psycopg2://fin:finpass@postgres:5432/fintech")
SCHEMA = os.getenv("DB_SCHEMA","public")
engine = create_engine(DB_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
def ensure_schema():
    with engine.connect() as conn:
        conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{SCHEMA}";'))
        conn.commit()

from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
ensure_schema()
class Customer(Base):
    __tablename__="customers"; __table_args__={"schema": os.getenv("DB_SCHEMA","public")}
    id: Mapped[str]=mapped_column(String, primary_key=True)
    person_type: Mapped[str]=mapped_column(String)  # PF|PJ
    full_name: Mapped[str]=mapped_column(String)
    cpf_cnpj: Mapped[str]=mapped_column(String, unique=True)
    email: Mapped[str]=mapped_column(String)
    kyc_level: Mapped[int]=mapped_column(Integer, default=0)
    is_teen: Mapped[bool]=mapped_column(Boolean, default=False)
    is_gamer: Mapped[bool]=mapped_column(Boolean, default=False)
    is_nerd: Mapped[bool]=mapped_column(Boolean, default=False)
Base.metadata.create_all(bind=engine)
app=FastAPI(title="customer-service",version="HMLPROD")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
class CustomerIn(BaseModel):
    id:str; person_type:str=Field(...,pattern="^(PF|PJ)$"); full_name:str; cpf_cnpj:str; email:str
    kyc_level:int=0; is_teen:bool=False; is_gamer:bool=False; is_nerd:bool=False
def _val(doc, p):
    if p=='PF' and not re.fullmatch(r"\d{11}",doc): raise HTTPException(422,"CPF inválido")
    if p=='PJ' and not re.fullmatch(r"\d{14}",doc): raise HTTPException(422,"CNPJ inválido")
@app.post("/customers")
def create(c:CustomerIn):
    _val(c.cpf_cnpj,c.person_type)
    with SessionLocal() as s:
        s.add(Customer(**c.model_dump())); s.commit(); return c
