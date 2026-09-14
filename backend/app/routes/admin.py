from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.idol import Idol
from app.models.submission import Submission
from app.models.report import Report
from app.schemas.submission import SubmissionResponse
from app.schemas.idol import IdolResponse, IdolUpdate
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    total_verified = db.query(Idol).filter(Idol.verification_status == "verified").count()
    pending_submissions = db.query(Submission).filter(Submission.status == "pending").count()
    rejected_submissions = db.query(Submission).filter(Submission.status == "rejected").count()
    total_reports = db.query(Report).filter(Report.status == "pending").count()
    registered_users = db.query(User).count()

    # Eco status distribution
    eco_dist = db.query(Idol.eco_status, func.count(Idol.id)).filter(Idol.verification_status == "verified").group_by(Idol.eco_status).all()
    eco_data = {status or "Unknown": count for status, count in eco_dist}

    # Crowd status distribution
    crowd_dist = db.query(Idol.crowd_status, func.count(Idol.id)).filter(Idol.verification_status == "verified").group_by(Idol.crowd_status).all()
    crowd_data = {status or "Low": count for status, count in crowd_dist}

    # Idols by area
    area_dist = db.query(Idol.area, func.count(Idol.id)).filter(Idol.verification_status == "verified").group_by(Idol.area).all()
    area_data = {area: count for area, count in area_dist}

    return {
        "total_verified_idols": total_verified,
        "pending_submissions": pending_submissions,
        "rejected_submissions": rejected_submissions,
        "pending_reports": total_reports,
        "registered_users": registered_users,
        "eco_distribution": eco_data,
        "crowd_distribution": crowd_data,
        "area_distribution": area_data
    }

@router.get("/submissions", response_model=List[SubmissionResponse])
def get_submissions(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    query = db.query(Submission)
    if status_filter:
        query = query.filter(Submission.status == status_filter)
    else:
        query = query.order_by(Submission.created_at.desc())
    
    return query.all()

@router.put("/submissions/{id}/approve", response_model=IdolResponse)
def approve_submission(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found.")

    if sub.status == "approved":
        raise HTTPException(status_code=400, detail="Submission is already approved.")

    sub.status = "approved"
    sub.admin_notes = "Approved by admin."

    # Create new verified Idol entry
    new_idol = Idol(
        name=sub.idol_name,
        description=sub.description,
        address=sub.address,
        area=sub.area,
        latitude=sub.latitude,
        longitude=sub.longitude,
        image_url=sub.image_url,
        organizer_name=sub.organizer_name,
        contact_number=sub.contact_number,
        start_date=sub.start_date,
        end_date=sub.end_date,
        opening_time=sub.opening_time,
        closing_time=sub.closing_time,
        crowd_status="Low",
        eco_status=sub.eco_status or "Eco-Friendly",
        verification_status="verified",
        is_demo=False,
        created_by=sub.submitted_by
    )

    db.add(new_idol)
    db.commit()
    db.refresh(new_idol)

    resp = IdolResponse.from_orm(new_idol)
    resp.avg_rating = 5.0
    resp.total_reviews = 0
    return resp

@router.put("/submissions/{id}/reject")
def reject_submission(
    id: int,
    notes: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found.")

    sub.status = "rejected"
    sub.admin_notes = notes or "Rejected by admin."
    db.commit()
    return {"message": "Submission rejected successfully.", "id": id}

@router.put("/idols/{id}", response_model=IdolResponse)
def update_idol_info(
    id: int,
    idol_in: IdolUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    idol = db.query(Idol).filter(Idol.id == id).first()
    if not idol:
        raise HTTPException(status_code=404, detail="Ganesh idol not found.")

    update_data = idol_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(idol, field, val)

    db.commit()
    db.refresh(idol)
    return idol

@router.delete("/idols/{id}")
def delete_idol(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    idol = db.query(Idol).filter(Idol.id == id).first()
    if not idol:
        raise HTTPException(status_code=404, detail="Ganesh idol not found.")

    db.delete(idol)
    db.commit()
    return {"message": "Ganesh idol entry deleted successfully.", "id": id}
