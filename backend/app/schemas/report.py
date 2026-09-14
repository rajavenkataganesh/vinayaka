from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportCreate(BaseModel):
    idol_id: int
    report_type: str
    description: Optional[str] = None

class ReportResponse(ReportCreate):
    id: int
    reported_by: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
