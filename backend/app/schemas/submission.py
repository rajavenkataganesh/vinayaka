from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SubmissionCreate(BaseModel):
    idol_name: str
    area: str
    address: str
    latitude: float
    longitude: float
    organizer_name: Optional[str] = None
    contact_number: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    description: Optional[str] = None
    eco_status: Optional[str] = "Eco-Friendly"
    image_url: Optional[str] = None
    ai_detection_result: Optional[str] = None
    ai_confidence: Optional[float] = 0.0
    is_ai_verified: Optional[bool] = False
    submitter_name: Optional[str] = "Anonymous Devotee"

class SubmissionResponse(SubmissionCreate):
    id: int
    submitted_by: Optional[int] = None
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime
    duplicate_warning: Optional[str] = None

    class Config:
        from_attributes = True
