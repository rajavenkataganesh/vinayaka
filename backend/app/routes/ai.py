import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.ai_detector import detect_ganesh_idol
from app.config import settings

router = APIRouter(prefix="/api/ai", tags=["AI Idol Verification"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10 MB

@router.post("/detect")
async def detect_idol_in_image(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: JPG, PNG, WEBP."
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Save file to uploads directory
    file_id = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, file_id)
    with open(saved_path, "wb") as f:
        f.write(content)

    image_url = f"/uploads/{file_id}"

    # Run AI detection algorithm
    detection_result = detect_ganesh_idol(content)
    detection_result["image_url"] = image_url

    return detection_result
