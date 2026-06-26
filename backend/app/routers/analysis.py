from fastapi import APIRouter

from app.services.analysis_service import analyze_log

router = APIRouter(
    prefix="/api",
    tags=["Analysis"]
)


@router.post("/analyze/{filename}")
async def analyze(filename: str):

    return analyze_log(filename)