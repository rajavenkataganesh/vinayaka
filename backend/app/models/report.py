from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    idol_id = Column(Integer, ForeignKey("idols.id"), nullable=False)
    reported_by = Column(Integer, nullable=True) # user_id or null
    report_type = Column(String, nullable=False) # 'Wrong location', 'Duplicate idol', 'Incorrect info', 'Idol no longer exists', 'Inappropriate image', 'Other'
    description = Column(Text, nullable=True)
    status = Column(String, default="pending") # 'pending', 'resolved', 'dismissed'
    created_at = Column(DateTime, default=datetime.utcnow)
