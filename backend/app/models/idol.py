from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from app.database import Base

class Idol(Base):
    __tablename__ = "idols"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    address = Column(String, nullable=False)
    area = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    organizer_name = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    opening_time = Column(String, nullable=True)
    closing_time = Column(String, nullable=True)
    crowd_status = Column(String, default="Low") # 'Low', 'Medium', 'High'
    eco_status = Column(String, default="Eco-Friendly") # 'Eco-Friendly', 'Unknown', 'Not Eco-Friendly'
    verification_status = Column(String, default="verified") # 'verified', 'pending', 'rejected'
    is_demo = Column(Boolean, default=False)
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
