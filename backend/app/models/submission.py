from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from app.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    submitted_by = Column(Integer, nullable=True) # user id or null for guest
    submitter_name = Column(String, nullable=True)
    idol_name = Column(String, nullable=False)
    area = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    organizer_name = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    opening_time = Column(String, nullable=True)
    closing_time = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    eco_status = Column(String, default="Eco-Friendly")
    image_url = Column(String, nullable=True)
    
    # AI detection details
    ai_detection_result = Column(String, nullable=True) # JSON string or status message
    ai_confidence = Column(Float, default=0.0)
    is_ai_verified = Column(Boolean, default=False)
    
    status = Column(String, default="pending") # 'pending', 'approved', 'rejected', 'changes_requested'
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
