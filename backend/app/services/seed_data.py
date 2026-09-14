from sqlalchemy.orm import Session
from app.models.user import User
from app.models.idol import Idol
from app.models.submission import Submission
from app.models.rating import Rating
from app.utils.auth import get_password_hash

DEMO_IDOLS = [
    {
        "name": "Sri Vinayaka Maha Pandal",
        "description": "A magnificent 30ft clay Ganesh idol crafted by traditional artisans. Features daily evening Mahamangala Harati and cultural programs.",
        "address": "Benz Circle, Near M.G. Road",
        "area": "Vijayawada",
        "latitude": 16.5062,
        "longitude": 80.6480,
        "image_url": "https://images.unsplash.com/photo-1567591377030-de198b9d5186?auto=format&fit=crop&w=800&q=80",
        "organizer_name": "Benz Circle Youth Association",
        "contact_number": "+91 98480 12345",
        "start_date": "2026-09-07",
        "end_date": "2026-09-17",
        "opening_time": "06:00 AM",
        "closing_time": "11:00 PM",
        "crowd_status": "Medium",
        "eco_status": "Eco-Friendly",
        "verification_status": "verified",
        "is_demo": True,
        "avg_rating": 4.9,
        "total_reviews": 128
    },
    {
        "name": "Maha Ganapati Pandal",
        "description": "Grand eco-friendly Ganesha installed on Kanaka Durga Temple road. Special Laddu auction on Nimajjanam day.",
        "address": "Indrakeeladri Temple Road, One Town",
        "area": "Vijayawada",
        "latitude": 16.5168,
        "longitude": 80.6090,
        "image_url": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80",
        "organizer_name": "One Town Utsav Committee",
        "contact_number": "+91 98480 23456",
        "start_date": "2026-09-07",
        "end_date": "2026-09-17",
        "opening_time": "05:30 AM",
        "closing_time": "10:30 PM",
        "crowd_status": "High",
        "eco_status": "Eco-Friendly",
        "verification_status": "verified",
        "is_demo": True,
        "avg_rating": 4.8,
        "total_reviews": 94
    },
    {
        "name": "Mangalagiri Raja Vinayaka",
        "description": "Famous eco-clay Ganesha decorated with handwoven sarees and marigold flowers. Located near Panakala Narasimha Swamy temple area.",
        "address": "Main Bazaar Road, Near Bus Stand",
        "area": "Mangalagiri",
        "latitude": 16.4350,
        "longitude": 80.5540,
        "image_url": "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&w=800&q=80",
        "organizer_name": "Mangalagiri Merchants Sangam",
        "contact_number": "+91 98480 34567",
        "start_date": "2026-09-07",
        "end_date": "2026-09-17",
        "opening_time": "06:00 AM",
        "closing_time": "10:00 PM",
        "crowd_status": "Low",
        "eco_status": "Eco-Friendly",
        "verification_status": "verified",
        "is_demo": True,
        "avg_rating": 4.7,
        "total_reviews": 42
    },
    {
        "name": "Brodipet Eco Ganesha",
        "description": "100% organic seed Ganesha that grows into a plant post immersion. Organized by local college students.",
        "address": "4th Line, Brodipet",
        "area": "Guntur",
        "latitude": 16.3067,
        "longitude": 80.4365,
        "image_url": "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=800&q=80",
        "organizer_name": "Guntur Green Youth Club",
        "contact_number": "+91 98480 45678",
        "start_date": "2026-09-07",
        "end_date": "2026-09-17",
        "opening_time": "07:00 AM",
        "closing_time": "09:30 PM",
        "crowd_status": "Low",
        "eco_status": "Eco-Friendly",
        "verification_status": "verified",
        "is_demo": True,
        "avg_rating": 4.9,
        "total_reviews": 65
    },
    {
        "name": "Capital Amaravati Siddhi Vinayaka",
        "description": "Modern pandal with digital lighting show, free prasadam distribution, and security monitoring.",
        "address": "Rayapudi Main Road, Near Secretariat",
        "area": "Amaravati",
        "latitude": 16.5417,
        "longitude": 80.5158,
        "image_url": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80",
        "organizer_name": "Capital Region Cultural Trust",
        "contact_number": "+91 98480 56789",
        "start_date": "2026-09-07",
        "end_date": "2026-09-17",
        "opening_time": "06:00 AM",
        "closing_time": "11:00 PM",
        "crowd_status": "Medium",
        "eco_status": "Eco-Friendly",
        "verification_status": "verified",
        "is_demo": True,
        "avg_rating": 4.8,
        "total_reviews": 51
    },
    {
        "name": "Khairatabad Maha Ganapati",
        "description": "World famous gigantic Ganesha idol standing over 60 feet tall. Millions of devotees visit every festival season.",
        "address": "Khairatabad Signal, Near Railway Station",
        "area": "Hyderabad",
        "latitude": 17.4116,
        "longitude": 78.4619,
        "image_url": "https://images.unsplash.com/photo-1567591377030-de198b9d5186?auto=format&fit=crop&w=800&q=80",
        "organizer_name": "Khairatabad Ganesh Utsav Samithi",
        "contact_number": "+91 94400 11223",
        "start_date": "2026-09-07",
        "end_date": "2026-09-17",
        "opening_time": "04:00 AM",
        "closing_time": "12:00 AM",
        "crowd_status": "High",
        "eco_status": "Eco-Friendly",
        "verification_status": "verified",
        "is_demo": True,
        "avg_rating": 5.0,
        "total_reviews": 520
    },
    {
        "name": "Lalbaugcha Raja Pandal",
        "description": "Iconic Ganesh idol of Mumbai, known as the Navsacha Ganpati (the fulfiller of all wishes).",
        "address": "Lalbaug, Parel",
        "area": "Mumbai",
        "latitude": 18.9917,
        "longitude": 72.8378,
        "image_url": "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&w=800&q=80",
        "organizer_name": "Lalbaugcha Raja Sarvajanik Ganeshotsav Mandal",
        "contact_number": "+91 98200 99887",
        "start_date": "2026-09-07",
        "end_date": "2026-09-17",
        "opening_time": "24 Hours",
        "closing_time": "24 Hours",
        "crowd_status": "High",
        "eco_status": "Eco-Friendly",
        "verification_status": "verified",
        "is_demo": True,
        "avg_rating": 5.0,
        "total_reviews": 890
    }
]

def seed_database(db: Session):
    # Check if admin user exists
    admin = db.query(User).filter(User.email == "admin@ganeshmap.com").first()
    if not admin:
        admin_user = User(
            name="GaneshMap Admin",
            email="admin@ganeshmap.com",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin_user)

    # Check if demo user exists
    user = db.query(User).filter(User.email == "devotee@ganeshmap.com").first()
    if not user:
        demo_user = User(
            name="Anand Sharma",
            email="devotee@ganeshmap.com",
            password_hash=get_password_hash("user123"),
            role="user"
        )
        db.add(demo_user)

    db.commit()

    # Check if idols exist
    existing_idols_count = db.query(Idol).count()
    if existing_idols_count == 0:
        for data in DEMO_IDOLS:
            avg_rating = data.pop("avg_rating", 4.8)
            total_reviews = data.pop("total_reviews", 10)
            idol = Idol(**data)
            db.add(idol)
            db.flush()

            # Add sample ratings
            rating1 = Rating(
                idol_id=idol.id,
                user_name="Devotee Priya",
                rating=5.0,
                review="Blessed atmosphere! Very disciplined queue and peaceful darshan."
            )
            rating2 = Rating(
                idol_id=idol.id,
                user_name="Ramesh Babu",
                rating=4.5,
                review="Beautiful eco-friendly idol decoration and excellent prasadam."
            )
            db.add(rating1)
            db.add(rating2)

        db.commit()

    # Check sample pending submission
    pending_count = db.query(Submission).count()
    if pending_count == 0:
        sample_sub = Submission(
            idol_name="Siddhendra Vinayaka Pandal",
            area="Vijayawada",
            address="Gunadala Center, Near Eluru Road",
            latitude=16.5250,
            longitude=80.6550,
            organizer_name="Gunadala Youth Club",
            contact_number="+91 98480 99999",
            start_date="2026-09-07",
            end_date="2026-09-17",
            opening_time="06:00 AM",
            closing_time="10:00 PM",
            description="Beautiful traditional clay Ganesha idol with sugarcane archway.",
            eco_status="Eco-Friendly",
            image_url="https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=800&q=80",
            ai_detection_result="Ganesh idol detected with high confidence",
            ai_confidence=0.92,
            is_ai_verified=True,
            status="pending",
            submitter_name="Suresh Varma"
        )
        db.add(sample_sub)
        db.commit()
