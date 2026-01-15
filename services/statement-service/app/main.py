from fastapi import FastAPI, HTTPException, Response, Header
from fastapi.middleware.cors import CORSMiddleware
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from jose import jwt
import httpx, os, io, datetime
ISSUER=os.getenv("JWT_ISSUER","http://keycloak:8080/realms/athena")
ACCOUNTS_URL=os.getenv("ACCOUNTS_URL","http://accounts-service:8080")
app=FastAPI(title="statement-service",version="HMLPROD")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
async def verify(authorization):
    if not authorization or not authorization.lower().startswith("bearer "): 
        raise HTTPException(401,"missing token")
    token = authorization.split(" ",1)[1]
    data = jwt.get_unverified_claims(token)
    if data.get("iss") != ISSUER: raise HTTPException(401,"bad iss")
    return data.get("sub"), set(data.get("realm_access",{}).get("roles",[]))
async def is_owner_or_admin(sub, roles, account_id):
    admin = {"cto","ceo","manager","finance"}
    if roles & admin: return True
    async with httpx.AsyncClient(timeout=5) as c:
        r = await c.get(f"{ACCOUNTS_URL}/accounts/{account_id}")
        if r.status_code != 200: return False
        return r.json().get("owner_id") == sub
@app.get("/accounts/{account_id}/statement.pdf")
async def pdf(account_id: str, Authorization: str|None = Header(None)):
    sub, roles = await verify(Authorization)
    if not await is_owner_or_admin(sub, roles, account_id):
        raise HTTPException(403,"forbidden")
    buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=A4)
    c.setFont("Helvetica-Bold", 16); c.drawString(50, 800, f"Athena — Extrato {account_id}")
    c.setFont("Helvetica", 12); c.drawString(50, 780, f"Data: {datetime.date.today().isoformat()}")
    y=740
    for i in range(10): c.drawString(50,y, f"{datetime.date.today().isoformat()} | MEMO {i} | +R$ {100+i:.2f}"); y-=20
    c.showPage(); c.save(); pdf = buf.getvalue(); buf.close()
    return Response(content=pdf, media_type="application/pdf")
