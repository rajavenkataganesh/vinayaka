from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.database import get_db
from app.models.activity import Activity
from app.models.idol import Idol
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityResponse, ActivityUpdate
from app.services.geo import haversine_distance
from app.utils.auth import get_current_user_optional, get_current_admin_user

router = APIRouter(prefix="/api/activities", tags=["Festival Activities"])

@router.get("/idol/{idol_id}", response_model=List[ActivityResponse])
def get_activities_for_idol(idol_id: int, db: Session = Depends(get_db)):
    idol = db.query(Idol).filter(Idol.id == idol_id).first()
    if not idol:
        raise HTTPException(status_code=404, detail="Ganesh idol not found.")

    activities = db.query(Activity).filter(
        Activity.idol_id == idol_id,
        Activity.verification_status == "approved"
    ).order_by(Activity.created_at.asc()).all()

    res = []
    for act in activities:
        resp = ActivityResponse.from_orm(act)
        resp.idol_name = idol.name
        resp.idol_area = idol.area
        resp.idol_image_url = idol.image_url
        res.append(resp)
    return res

@router.get("/nearby", response_model=List[ActivityResponse])
def get_nearby_activities(
    latitude: float = Query(..., description="User latitude"),
    longitude: float = Query(..., description="User longitude"),
    activity_type: Optional[str] = Query(None, description="Filter by 'prasadam', 'annadanam', 'uregimpu'"),
    radius_km: float = Query(50.0),
    db: Session = Depends(get_db)
):
    query = db.query(Activity).filter(Activity.verification_status == "approved")
    if activity_type:
        query = query.filter(Activity.activity_type == activity_type)

    activities = query.all()
    results = []

    for act in activities:
        idol = db.query(Idol).filter(Idol.id == act.idol_id).first()
        if not idol:
            continue

        act_lat = act.latitude or idol.latitude
        act_lng = act.longitude or idol.longitude
        dist_m = haversine_distance(latitude, longitude, act_lat, act_lng)

        if dist_m <= (radius_km * 1000.0):
            resp = ActivityResponse.from_orm(act)
            resp.idol_name = idol.name
            resp.idol_area = idol.area
            resp.idol_image_url = idol.image_url
            resp.distance_meters = round(dist_m, 1)
            results.append(resp)

    # Sort by nearest distance first
    results.sort(key=lambda x: x.distance_meters or 9999999)
    return results

@router.get("", response_model=List[ActivityResponse])
def get_all_activities(
    type: Optional[str] = Query(None, description="Filter: 'prasadam', 'annadanam', 'uregimpu'"),
    db: Session = Depends(get_db)
):
    query = db.query(Activity).filter(Activity.verification_status == "approved")
    if type:
        query = query.filter(Activity.activity_type == type)

    activities = query.order_by(Activity.created_at.desc()).all()
    res = []
    for act in activities:
        idol = db.query(Idol).filter(Idol.id == act.idol_id).first()
        resp = ActivityResponse.from_orm(act)
        if idol:
            resp.idol_name = idol.name
            resp.idol_area = idol.area
            resp.idol_image_url = idol.image_url
        res.append(resp)
    return res

@router.post("/idol/{idol_id}", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity_for_idol(
    idol_id: int,
    act_in: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    idol = db.query(Idol).filter(Idol.id == idol_id).first()
    if not idol:
        raise HTTPException(status_code=404, detail="Ganesh idol not found.")

    # Validate activity type
    if act_in.activity_type not in ["prasadam", "annadanam", "uregimpu"]:
        raise HTTPException(status_code=400, detail="Invalid activity type. Must be 'prasadam', 'annadanam', or 'uregimpu'.")

    # If logged in as admin, auto approve, otherwise pending admin review
    v_status = "approved" if (current_user and current_user.role == "admin") else "pending"

    new_act = Activity(
        idol_id=idol_id,
        activity_type=act_in.activity_type,
        title=act_in.title,
        description=act_in.description,
        date=act_in.date,
        start_time=act_in.start_time,
        end_time=act_in.end_time,
        location=act_in.location or idol.address,
        latitude=act_in.latitude or idol.latitude,
        longitude=act_in.longitude or idol.longitude,
        organizer_name=act_in.organizer_name or idol.organizer_name,
        contact_number=act_in.contact_number or idol.contact_number,
        status=act_in.status or "Upcoming",
        verification_status=v_status,
        start_location=act_in.start_location,
        end_location=act_in.end_location,
        route_coordinates=act_in.route_coordinates,
        crowd_status=act_in.crowd_status or "Medium",
        created_by=current_user.id if current_user else None
    )

    db.add(new_act)
    db.commit()
    db.refresh(new_act)

    resp = ActivityResponse.from_orm(new_act)
    resp.idol_name = idol.name
    resp.idol_area = idol.area
    resp.idol_image_url = idol.image_url
    return resp

@router.put("/admin/{id}/approve", response_model=ActivityResponse)
def approve_activity(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    act = db.query(Activity).filter(Activity.id == id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found.")

    act.verification_status = "approved"
    db.commit()
    db.refresh(act)
    return act

@router.put("/{id}", response_model=ActivityResponse)
def update_activity(
    id: int,
    act_in: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    act = db.query(Activity).filter(Activity.id == id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found.")

    update_data = act_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(act, field, val)

    db.commit()
    db.refresh(act)
    return act

@router.delete("/{id}")
def delete_activity(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    act = db.query(Activity).filter(Activity.id == id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found.")

    db.delete(act)
    db.commit()
    return {"message": "Activity deleted successfully.", "id": id}
