from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.rating import Rating
from app.models.user import User
from app.schemas.rating import RatingCreate, RatingResponse
from app.utils.auth import get_current_user_optional

router = APIRouter(prefix="/api/ratings", tags=["Ratings"])

@router.post("", response_model=RatingResponse, status_code=status.HTTP_201_CREATED)
def submit_rating(
    rating_in: RatingCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if rating_in.rating < 1 or rating_in.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1.0 and 5.0.")

    new_rating = Rating(
        idol_id=rating_in.idol_id,
        user_id=current_user.id if current_user else None,
        user_name=current_user.name if current_user else "Devotee",
        rating=float(rating_in.rating),
        review=rating_in.review
    )
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
    return new_rating

@router.get("/idol/{idol_id}", response_model=List[RatingResponse])
def get_idol_ratings(idol_id: int, db: Session = Depends(get_db)):
    return db.query(Rating).filter(Rating.idol_id == idol_id).order_by(Rating.created_at.desc()).all()
