from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
import os, hmac, hashlib
app=FastAPI(title="fx-crypto-service",version="HMLPROD")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
COINBASE_SECRET=os.getenv("COINBASE_COMMERCE_WEBHOOK_SECRET","changeme")
@app.post("/webhooks/coinbase")
async def coinbase(request: Request, cc_sig: str = Header(None, alias="X-CC-Webhook-Signature")):
    body = await request.body()
    if not cc_sig: raise HTTPException(400,"missing signature")
    mac = hmac.new(COINBASE_SECRET.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(mac, cc_sig): raise HTTPException(403,"bad signature")
    return {"ok": True}
