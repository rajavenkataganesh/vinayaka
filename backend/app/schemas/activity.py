from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ActivityBase(BaseModel):
    idol_id: int
    activity_type: str # 'prasadam', 'annadanam', 'uregimpu'
    title: str
    description: Optional[str] = None
    date: str
    start_time: str
    end_time: Optional[str] = None
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    organizer_name: Optional[str] = None
    contact_number: Optional[str] = None
    status: Optional[str] = "Upcoming"
    
    # Procession specific
    start_location: Optional[str] = None
    end_location: Optional[str] = None
    route_coordinates: Optional[str] = None # JSON string
    crowd_status: Optional[str] = "Medium"

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    organizer_name: Optional[str] = None
    contact_number: Optional[str] = None
    status: Optional[str] = None
    verification_status: Optional[str] = None
    start_location: Optional[str] = None
    end_location: Optional[str] = None
    route_coordinates: Optional[str] = None
    crowd_status: Optional[str] = None

class ActivityResponse(ActivityBase):
    id: int
    verification_status: str
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    # Extra formatted metadata for UI responses
    idol_name: Optional[str] = None
    idol_area: Optional[str] = None
    idol_image_url: Optional[str] = None
    distance_meters: Optional[float] = None

    class Config:
        from_attributes = True
