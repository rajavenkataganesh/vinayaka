# 🕉️ GaneshMap – Find Lord Ganesh Idols Near You

> **"Find. Explore. Celebrate."**  
> A complete, production-ready location-based web application for discovering verified Lord Ganesh idols, pandals, darshan timings, crowd levels, and eco-friendly immersion guidance with AI vision verification assistance.

---

## 🌟 Features Overview

1. **📍 Current Location Detection**: Detects browser GPS coordinates and computes exact Haversine distance to all pandals.
2. **🗺️ Interactive Leaflet Map**: Free OpenStreetMap tiles with custom Lord Ganesh vector SVG markers, user pin, zoom controls, and rich popups.
3. **🔎 Area & Locality Search**: Instant search by city or area (e.g., Vijayawada, Mangalagiri, Guntur, Amaravati, Hyderabad, Mumbai).
4. **🕉️ Comprehensive Idol Details**: Photo gallery, darshan schedule, crowd status (🟢 Low, 🟡 Medium, 🔴 High), eco-friendly badge, ratings/reviews, and turn-by-turn directions launcher.
5. **➕ Community Idol Submission**: Form with GPS location auto-fill, image preview, file validation, and duplicate location warning (<100m radius check).
6. **🤖 Computer Vision AI Idol Detection**: Analyzes uploaded images for saffron/turmeric color spectrums and idol contour structures, returning a confidence percentage and status recommendation.
7. **🛡️ Admin Verification Dashboard**: Panel to review pending submissions, approve/reject community entries, manage verified idols, and resolve reports.
8. **🚩 User Issue Reporting**: Report wrong location, duplicate entry, inappropriate images, or outdated information.
9. **♻️ Eco-Friendly Festival Guide**: Educational information on clay idols, natural pigments, seed Ganeshas, and zero-waste immersion practices.
10. **🔑 User & Admin Authentication**: JWT token authentication with role-based access control.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Leaflet, React-Leaflet, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Python 3.13, FastAPI, REST API, Uvicorn, SQLAlchemy, Pydantic v2.
- **Database**: SQLite (default local zero-config database `ganeshmap.db`) & PostgreSQL / Supabase ready (`database/schema.sql`).
- **AI Vision**: OpenCV & PIL image histogram analysis pipeline with confidence scoring and fallback logic.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI backend server (runs on http://localhost:8000)
python run.py
```

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend folder
cd frontend

# Install Node packages
npm install

# Start Vite dev server (runs on http://localhost:3000)
npm run dev
```

### 4. One-Click Launcher (Windows)
Double-click `start_all.bat` or run:
```cmd
start_all.bat
```

---

## 🔑 Default Credentials

- **Admin Account**: `admin@ganeshmap.com` / `admin123`
- **Devotee Account**: `user@ganeshmap.com` / `user123`

---

## 🛰️ API Endpoints Summary

- `GET /api/health` - System health check.
- `GET /api/idols` - List all verified Ganesh idols.
- `GET /api/idols/nearby?latitude=...&longitude=...` - Get nearby idols sorted by Haversine distance.
- `GET /api/idols/search?q=...` - Search idols by area or name.
- `GET /api/idols/{id}` - Detailed view of specific idol.
- `POST /api/submissions` - Submit new idol (queued for admin review).
- `POST /api/submissions/check-duplicate` - Check if idol exists within 100m radius.
- `POST /api/ai/detect` - Upload photo for AI vision verification.
- `POST /api/auth/login` - User/Admin JWT login.
- `GET /api/admin/submissions` - List pending submissions (Admin only).
- `PUT /api/admin/submissions/{id}/approve` - Approve and publish idol live (Admin only).
- `PUT /api/admin/submissions/{id}/reject` - Reject submission (Admin only).
- `POST /api/reports` - Submit user report.
- `POST /api/ratings` - Submit rating & review.

---

## 📂 Project Structure

```
ganeshmap/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point & routes registration
│   │   ├── config.py          # App configuration & environment variables
│   │   ├── database.py        # SQLAlchemy engine & session setup
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── routes/            # REST API route handlers
│   │   ├── services/          # Haversine geo, AI vision, and seed data logic
│   │   └── utils/             # Password hashing & JWT token handlers
│   ├── uploads/               # Uploaded images directory
│   ├── requirements.txt
│   ├── .env
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/        # MapView, IdolCard, SearchBar, Modals, Badges, GaneshIcon
│   │   ├── pages/             # HomePage, MapPage, IdolDetailPage, AdminDashboard
│   │   ├── context/           # AuthContext
│   │   ├── services/          # Axios API client & browser geolocation helpers
│   │   ├── styles/            # Tailwind directives
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── ai/
│   ├── detector.py            # Standalone AI testing script
│   └── requirements.txt
├── database/
│   └── schema.sql             # SQL schema for PostgreSQL / Supabase
├── start_all.bat              # One-click Windows startup script
└── README.md
```
