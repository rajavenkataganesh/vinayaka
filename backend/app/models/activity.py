from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    idol_id = Column(Integer, ForeignKey("idols.id"), nullable=False)
    
    # Activity Type: 'prasadam', 'annadanam', 'uregimpu'
    activity_type = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    date = Column(String, nullable=False) # e.g. "2026-09-17" or "Today"
    start_time = Column(String, nullable=False) # e.g. "12:30 PM"
    end_time = Column(String, nullable=True) # e.g. "02:00 PM"
    location = Column(String, nullable=False) # e.g. "Main Pandal"
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    organizer_name = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    
    # Status values:
    # For Prasadam/Annadanam: 'Upcoming', 'Available Now', 'Completed', 'Cancelled'
    # For Uregimpu: 'Upcoming', 'Starting Soon', 'In Progress', 'Completed', 'Cancelled'
    status = Column(String, default="Upcoming")
    
    # Verification status: 'pending', 'approved', 'rejected'
    verification_status = Column(String, default="approved")
    
    # Uregimpu Procession Specific Fields
    start_location = Column(String, nullable=True)
    end_location = Column(String, nullable=True)
    # JSON string representation of lat/lng coordinates array: "[[lat1, lng1], [lat2, lng2], ...]"
    route_coordinates = Column(Text, nullable=True)
    crowd_status = Column(String, default="Medium")
    
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
