from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class IdolBase(BaseModel):
    name: str
    description: Optional[str] = None
    address: str
    area: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None
    organizer_name: Optional[str] = None
    contact_number: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    crowd_status: Optional[str] = "Low"
    eco_status: Optional[str] = "Eco-Friendly"

class IdolCreate(IdolBase):
    pass

class IdolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    area: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    organizer_name: Optional[str] = None
    contact_number: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    crowd_status: Optional[str] = None
    eco_status: Optional[str] = None

class IdolResponse(IdolBase):
    id: int
    verification_status: str
    is_demo: bool
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    distance_meters: Optional[float] = None
    avg_rating: Optional[float] = 4.8
    total_reviews: Optional[int] = 0
    
    # Activity Badges Flags
    has_prasadam: Optional[bool] = False
    has_annadanam: Optional[bool] = False
    has_uregimpu: Optional[bool] = False

    class Config:
        from_attributes = True
