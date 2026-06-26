from fastapi import FastAPI
from app.routers import upload
from app.routers.analysis import router as analysis_router

app = FastAPI(title="AI DevOps Copilot")
app.include_router(upload.router)
app.include_router(analysis_router)
@app.get("/")
def home():
    return {
        "message": "AI DevOps Copilot Backend Running"
    }