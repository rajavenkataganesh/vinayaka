from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.idol import Idol
from app.models.rating import Rating
from app.models.activity import Activity
from app.schemas.idol import IdolResponse
from app.services.geo import haversine_distance, format_distance

router = APIRouter(prefix="/api/idols", tags=["Idols"])

def calculate_ratings(db: Session, idol_id: int):
    result = db.query(
        func.avg(Rating.rating).label("avg_rating"),
        func.count(Rating.id).label("total_reviews")
    ).filter(Rating.idol_id == idol_id).first()
    
    avg_r = round(float(result.avg_rating), 1) if result and result.avg_rating else 4.8
    tot_rev = int(result.total_reviews) if result and result.total_reviews else 0
    return avg_r, tot_rev

def get_activity_flags(db: Session, idol_id: int):
    acts = db.query(Activity.activity_type).filter(
        Activity.idol_id == idol_id,
        Activity.verification_status == "approved"
    ).all()
    types = set([a.activity_type for a in acts])
    return ("prasadam" in types), ("annadanam" in types), ("uregimpu" in types)

@router.get("", response_model=List[IdolResponse])
def get_all_idols(
    area: Optional[str] = None,
    eco_status: Optional[str] = None,
    activity_type: Optional[str] = Query(None, description="Filter: 'prasadam', 'annadanam', 'uregimpu'"),
    db: Session = Depends(get_db)
):
    query = db.query(Idol).filter(Idol.verification_status == "verified")
    if area:
        query = query.filter(Idol.area.ilike(f"%{area}%"))
    if eco_status:
        query = query.filter(Idol.eco_status == eco_status)
    if activity_type:
        query = query.join(Activity, Activity.idol_id == Idol.id).filter(
            Activity.activity_type == activity_type,
            Activity.verification_status == "approved"
        ).distinct()

    idols = query.all()
    res = []
    for idol in idols:
        avg_r, tot_rev = calculate_ratings(db, idol.id)
        has_p, has_a, has_u = get_activity_flags(db, idol.id)
        resp = IdolResponse.from_orm(idol)
        resp.avg_rating = avg_r
        resp.total_reviews = tot_rev
        resp.has_prasadam = has_p
        resp.has_annadanam = has_a
        resp.has_uregimpu = has_u
        res.append(resp)
    return res

@router.get("/stats")
def get_public_stats(db: Session = Depends(get_db)):
    verified_count = db.query(Idol).filter(Idol.verification_status == "verified").count()
    areas_count = db.query(func.count(func.distinct(Idol.area))).scalar() or 0
    eco_count = db.query(Idol).filter(Idol.verification_status == "verified", Idol.eco_status == "Eco-Friendly").count()
    activities_count = db.query(Activity).filter(Activity.verification_status == "approved").count()

    return {
        "verified_idols": verified_count,
        "registered_areas": areas_count,
        "eco_friendly_idols": eco_count,
        "total_activities": activities_count
    }

@router.get("/nearby", response_model=List[IdolResponse])
def get_nearby_idols(
    latitude: float = Query(..., description="User current latitude"),
    longitude: float = Query(..., description="User current longitude"),
    radius_km: float = Query(50.0, description="Max radius in kilometers"),
    activity_type: Optional[str] = Query(None, description="Filter: 'prasadam', 'annadanam', 'uregimpu'"),
    db: Session = Depends(get_db)
):
    query = db.query(Idol).filter(Idol.verification_status == "verified")
    if activity_type:
        query = query.join(Activity, Activity.idol_id == Idol.id).filter(
            Activity.activity_type == activity_type,
            Activity.verification_status == "approved"
        ).distinct()

    idols = query.all()
    results = []

    for idol in idols:
        dist_m = haversine_distance(latitude, longitude, idol.latitude, idol.longitude)
        if dist_m <= (radius_km * 1000.0):
            avg_r, tot_rev = calculate_ratings(db, idol.id)
            has_p, has_a, has_u = get_activity_flags(db, idol.id)
            resp = IdolResponse.from_orm(idol)
            resp.distance_meters = round(dist_m, 1)
            resp.avg_rating = avg_r
            resp.total_reviews = tot_rev
            resp.has_prasadam = has_p
            resp.has_annadanam = has_a
            resp.has_uregimpu = has_u
            results.append(resp)

    results.sort(key=lambda x: x.distance_meters or 9999999)
    return results

@router.get("/search", response_model=List[IdolResponse])
def search_idols(
    q: str = Query(..., min_length=1, description="Search area or idol name"),
    db: Session = Depends(get_db)
):
    search_pattern = f"%{q}%"
    idols = db.query(Idol).filter(
        Idol.verification_status == "verified",
        (Idol.area.ilike(search_pattern) | Idol.name.ilike(search_pattern) | Idol.address.ilike(search_pattern))
    ).all()

    res = []
    for idol in idols:
        avg_r, tot_rev = calculate_ratings(db, idol.id)
        has_p, has_a, has_u = get_activity_flags(db, idol.id)
        resp = IdolResponse.from_orm(idol)
        resp.avg_rating = avg_r
        resp.total_reviews = tot_rev
        resp.has_prasadam = has_p
        resp.has_annadanam = has_a
        resp.has_uregimpu = has_u
        res.append(resp)
    return res

@router.get("/{id}", response_model=IdolResponse)
def get_idol_by_id(id: int, user_lat: Optional[float] = None, user_lng: Optional[float] = None, db: Session = Depends(get_db)):
    idol = db.query(Idol).filter(Idol.id == id).first()
    if not idol:
        raise HTTPException(status_code=404, detail="Lord Ganesh idol not found.")

    avg_r, tot_rev = calculate_ratings(db, idol.id)
    has_p, has_a, has_u = get_activity_flags(db, idol.id)
    resp = IdolResponse.from_orm(idol)
    resp.avg_rating = avg_r
    resp.total_reviews = tot_rev
    resp.has_prasadam = has_p
    resp.has_annadanam = has_a
    resp.has_uregimpu = has_u

    if user_lat is not None and user_lng is not None:
        dist_m = haversine_distance(user_lat, user_lng, idol.latitude, idol.longitude)
        resp.distance_meters = round(dist_m, 1)

    return resp
