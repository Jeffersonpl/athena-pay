from fastapi import FastAPI
app = FastAPI(title="acquirer-simulator")
@app.get("/reconcile-file")
def gen(): 
    # return a tiny CSV as a string (for the CronJob or manual test)
    csv = "payment_id,amount,status\nabc,10.00,settled\n"
    return {"filename":"acquirer_reconcile.csv","content":csv}
