import os
import shutil

from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = (".txt", ".log")


os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_uploaded_file(file: UploadFile):

    # Check filename
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing."
        )

    # Validate extension
    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Only .txt and .log files are allowed."
        )

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    try:

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = os.path.getsize(file_path)

        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        preview = content[:300]

        return {
            "status": "success",
            "message": "Log uploaded successfully.",
            "filename": file.filename,
            "size_in_bytes": file_size,
            "preview": preview
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        file.file.close()