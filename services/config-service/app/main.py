from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid
from app.db import SessionLocal, ensure_schema
from app.models import Theme, AccountTheme
ensure_schema()
app=FastAPI(title="config-service",version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
class ThemeIn(BaseModel): name:str; primary:str; accent:str; bg:str
class ThemeOut(ThemeIn): id:str
class AccountThemeIn(BaseModel): account_id:str; theme_id:str
@app.post("/themes", response_model=ThemeOut)
def create(t: ThemeIn):
    with SessionLocal() as s:
        tid=str(uuid.uuid4()); m=Theme(id=tid, **t.model_dump()); s.add(m); s.commit(); return ThemeOut(id=tid, **t.model_dump())
@app.get("/themes", response_model=List[ThemeOut])
def all():
    with SessionLocal() as s:
        rows=s.execute("select id,name,primary,accent,bg from config.themes").all()
        return [ThemeOut(id=r[0], name=r[1], primary=r[2], accent=r[3], bg=r[4]) for r in rows]
@app.put("/account-theme")
def set_theme(at: AccountThemeIn):
    with SessionLocal() as s:
        row=s.get(AccountTheme, at.account_id)
        if row: row.theme_id=at.theme_id
        else: s.add(AccountTheme(account_id=at.account_id, theme_id=at.theme_id))
        s.commit(); return {"ok":True}
@app.get("/account-theme/{account_id}", response_model=ThemeOut|None)
def get_theme(account_id:str):
    with SessionLocal() as s:
        row=s.get(AccountTheme, account_id)
        if not row: return None
        r=s.execute("select id,name,primary,accent,bg from config.themes where id=:id", {"id":row.theme_id}).first()
        if not r: return None
        return ThemeOut(id=r[0], name=r[1], primary=r[2], accent=r[3], bg=r[4])
