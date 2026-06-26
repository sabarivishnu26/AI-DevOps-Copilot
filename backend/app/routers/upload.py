from fastapi import APIRouter, UploadFile, File
from app.services.upload_service import save_uploaded_file

router = APIRouter(
    prefix="/api",
    tags=["Upload"]
)


@router.post("/upload-log")
async def upload_log(file: UploadFile = File(...)):
    return await save_uploaded_file(file)