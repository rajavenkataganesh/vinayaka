from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RatingCreate(BaseModel):
    idol_id: int
    rating: float
    review: Optional[str] = None

class RatingResponse(RatingCreate):
    id: int
    user_id: Optional[int] = None
    user_name: str
    created_at: datetime

    class Config:
        from_attributes = True
