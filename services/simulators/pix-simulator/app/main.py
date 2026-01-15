from fastapi import FastAPI, Request
app = FastAPI(title="pix-simulator")
@app.post("/pix/webhook")
async def webhook(req: Request):
    body = await req.json()
    # Simply echo back with a simulated settlement flag
    body["simulated_settlement"] = True
    return {"status":"received","data":body}
