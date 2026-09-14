import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base, SessionLocal
from app.config import settings
from app.services.seed_data import seed_database

# Routers
from app.routes import auth, idols, submissions, ai, admin, reports, ratings

# Create DB tables
Base.metadata.create_all(bind=engine)

# Seed database on initial startup
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="GaneshMap API",
    description="Backend API for GaneshMap - Find Ganesh Idols Near You",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev & mobile testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded static files
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(idols.router)
app.include_router(submissions.router)
app.include_router(ai.router)
app.include_router(admin.router)
app.include_router(reports.router)
app.include_router(ratings.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "GaneshMap Backend API",
        "version": "1.0.0",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
