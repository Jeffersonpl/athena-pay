from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import os, requests
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

ensure_schema()
app=FastAPI(title="payments-service",version="HMLPROD")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
ACCOUNTS_URL=os.getenv("ACCOUNTS_URL","http://accounts-service:8080")
class FeeTable(BaseModel): methods: Dict[str,float]={}; fixed: float=0.0
class GovTaxTable(BaseModel): iss: float=0.0; pis: float=0.0; cofins: float=0.0
FEES: Dict[str, FeeTable] = {}
GOV: GovTaxTable = GovTaxTable()
@app.post("/admin/fees/{cid}") def set_fees(cid:str, t:FeeTable): FEES[cid]=t; return t
@app.post("/admin/gov/taxes") def set_gov(t:GovTaxTable): global GOV; GOV=t; return GOV
def credit(acc, amt, cur="BRL"):
    try: requests.post(f"{ACCOUNTS_URL}/postings/credit", json={"account_id":acc,"amount":amt,"currency":cur}, timeout=5)
    except: pass
