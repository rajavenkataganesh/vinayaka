from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate, SubmissionResponse
from app.services.geo import check_duplicate_location
from app.utils.auth import get_current_user_optional

router = APIRouter(prefix="/api/submissions", tags=["Submissions"])

@router.post("/check-duplicate")
def check_duplicate(latitude: float, longitude: float, db: Session = Depends(get_db)):
    result = check_duplicate_location(db, latitude, longitude, threshold_meters=100.0)
    return result

@router.post("", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def submit_new_idol(
    submission_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    # Check duplicate proximity
    dup_check = check_duplicate_location(db, submission_in.latitude, submission_in.longitude, threshold_meters=100.0)
    dup_warning = None
    if dup_check["is_duplicate"]:
        dup_warning = f"Possible duplicate idol detected ({dup_check['name']} - {dup_check['distance_meters']}m away)."

    sub = Submission(
        submitted_by=current_user.id if current_user else None,
        submitter_name=current_user.name if current_user else submission_in.submitter_name or "Anonymous Devotee",
        idol_name=submission_in.idol_name,
        area=submission_in.area,
        address=submission_in.address,
        latitude=submission_in.latitude,
        longitude=submission_in.longitude,
        organizer_name=submission_in.organizer_name,
        contact_number=submission_in.contact_number,
        start_date=submission_in.start_date,
        end_date=submission_in.end_date,
        opening_time=submission_in.opening_time,
        closing_time=submission_in.closing_time,
        description=submission_in.description,
        eco_status=submission_in.eco_status,
        image_url=submission_in.image_url,
        ai_detection_result=submission_in.ai_detection_result,
        ai_confidence=submission_in.ai_confidence or 0.0,
        is_ai_verified=submission_in.is_ai_verified or False,
        status="pending"
    )

    db.add(sub)
    db.commit()
    db.refresh(sub)

    resp = SubmissionResponse.from_orm(sub)
    resp.duplicate_warning = dup_warning
    return resp
