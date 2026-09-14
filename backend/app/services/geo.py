import math

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance in meters between two points
    on the earth specified in decimal degrees.
    """
    # Convert decimal degrees to radians
    phi1, lambda1 = math.radians(lat1), math.radians(lon1)
    phi2, lambda2 = math.radians(lat2), math.radians(lon2)

    # Haversine formula
    dphi = phi2 - phi1
    dlambda = lambda2 - lambda1

    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    # Radius of earth in meters
    r = 6371000.0
    return r * c

def format_distance(meters: float) -> str:
    if meters < 1000:
        return f"{int(round(meters))} m away"
    else:
        return f"{round(meters / 1000.0, 1)} km away"

def check_duplicate_location(db, lat: float, lon: float, threshold_meters: float = 100.0):
    """
    Checks if an existing verified idol or pending submission exists within threshold_meters.
    """
    from app.models.idol import Idol
    from app.models.submission import Submission

    # Check verified idols
    idols = db.query(Idol).all()
    for idol in idols:
        dist = haversine_distance(lat, lon, idol.latitude, idol.longitude)
        if dist <= threshold_meters:
            return {
                "is_duplicate": True,
                "type": "verified_idol",
                "existing_id": idol.id,
                "name": idol.name,
                "distance_meters": round(dist, 1)
            }

    # Check pending submissions
    submissions = db.query(Submission).filter(Submission.status == "pending").all()
    for sub in submissions:
        dist = haversine_distance(lat, lon, sub.latitude, sub.longitude)
        if dist <= threshold_meters:
            return {
                "is_duplicate": True,
                "type": "pending_submission",
                "existing_id": sub.id,
                "name": sub.idol_name,
                "distance_meters": round(dist, 1)
            }

    return {"is_duplicate": False}
