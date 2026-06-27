from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload
from app.routers.analysis import router as analysis_router
from app.models.analysis import AnalysisResponse
from app.db.init_db import init_db

init_db()
app = FastAPI(title="AI DevOps Copilot")

# Configure CORS
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(analysis_router)

@app.get("/")
def home():
    return {
        "message": "AI DevOps Copilot Backend Running"
    }