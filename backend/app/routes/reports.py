from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate, ReportResponse
from app.utils.auth import get_current_user_optional, get_current_admin_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_in: ReportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    report = Report(
        idol_id=report_in.idol_id,
        reported_by=current_user.id if current_user else None,
        report_type=report_in.report_type,
        description=report_in.description,
        status="pending"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/admin", response_model=List[ReportResponse])
def get_all_reports(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.put("/admin/{id}/resolve")
def resolve_report(
    id: int,
    action: str = "resolved", # 'resolved' or 'dismissed'
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    report.status = action
    db.commit()
    return {"message": f"Report marked as {action}.", "id": id}
