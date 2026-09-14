from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey
from app.database import Base

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    idol_id = Column(Integer, ForeignKey("idols.id"), nullable=False)
    user_id = Column(Integer, nullable=True)
    user_name = Column(String, default="Devotee")
    rating = Column(Float, nullable=False)
    review = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
