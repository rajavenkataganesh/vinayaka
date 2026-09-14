import json
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.idol import Idol
from app.models.submission import Submission
from app.models.rating import Rating
from app.models.activity import Activity
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
        "is_demo": False,
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
        "is_demo": False,
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
        "is_demo": False,
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
        "is_demo": False,
        "avg_rating": 4.9,
        "total_reviews": 65
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
        "is_demo": False,
        "avg_rating": 5.0,
        "total_reviews": 520
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

    user = db.query(User).filter(User.email == "user@ganeshmap.com").first()
    if not user:
        demo_user = User(
            name="Ramesh Sharma",
            email="user@ganeshmap.com",
            password_hash=get_password_hash("user123"),
            role="user"
        )
        db.add(demo_user)

    db.commit()

    # Check if idols exist
    existing_idols_count = db.query(Idol).count()
    if existing_idols_count == 0:
        created_idols = []
        for data in DEMO_IDOLS:
            avg_rating = data.pop("avg_rating", 4.8)
            total_reviews = data.pop("total_reviews", 10)
            idol = Idol(**data)
            db.add(idol)
            db.flush()
            created_idols.append(idol)

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

        # Seed realistic Activities & Seva Information for created idols
        idol1 = created_idols[0] # Sri Vinayaka Maha Pandal (Benz Circle Vijayawada)
        act1 = Activity(
            idol_id=idol1.id,
            activity_type="prasadam",
            title="Tirupati Special Laddu Prasadam",
            description="Fresh Laddu Prasadam distributed to all devotees post evening Mahamangala Harati.",
            date="Today",
            start_time="12:30 PM",
            end_time="02:00 PM",
            location="Near Main Gate Prasadam Counter",
            latitude=idol1.latitude,
            longitude=idol1.longitude,
            organizer_name=idol1.organizer_name,
            contact_number=idol1.contact_number,
            status="Available Now",
            verification_status="approved"
        )

        act2 = Activity(
            idol_id=idol1.id,
            activity_type="annadanam",
            title="Maha Annadanam Lunch Seva",
            description="Free traditional South Indian meals (Sambar Rice, Curd Rice, Sweet Pongal) served to 2000+ devotees.",
            date="Today",
            start_time="01:00 PM",
            end_time="03:30 PM",
            location="Behind Benz Circle Pandal Seva Hall",
            latitude=idol1.latitude,
            longitude=idol1.longitude,
            organizer_name=idol1.organizer_name,
            contact_number=idol1.contact_number,
            status="Upcoming",
            verification_status="approved"
        )

        # Benz Circle Procession with Route Coordinates
        benz_route = [
            [16.5062, 80.6480],
            [16.5075, 80.6495],
            [16.5090, 80.6510],
            [16.5110, 80.6530]
        ]
        act3 = Activity(
            idol_id=idol1.id,
            activity_type="uregimpu",
            title="Grand Vinayaka Uregimpu & Dhol Tasha Procession",
            description="Vibrant procession featuring traditional Nashik Dhol, Chenda Melam, and flower showers.",
            date="September 17",
            start_time="05:00 PM",
            end_time="09:00 PM",
            location="Benz Circle to Krishna River Ghat",
            latitude=idol1.latitude,
            longitude=idol1.longitude,
            start_location="Sri Vinayaka Pandal, Benz Circle",
            end_location="Krishna River Nimajjanam Ghat",
            route_coordinates=json.dumps(benz_route),
            crowd_status="High",
            status="Upcoming",
            verification_status="approved",
            organizer_name=idol1.organizer_name,
            contact_number=idol1.contact_number
        )

        idol2 = created_idols[1] # Maha Ganapati Pandal (Kanaka Durga Temple Rd)
        act4 = Activity(
            idol_id=idol2.id,
            activity_type="annadanam",
            title="Temple Road Annadanam Seva",
            description="Hot meal distribution for pilgrims visiting Indrakeeladri.",
            date="Today",
            start_time="12:00 PM",
            end_time="03:00 PM",
            location="Indrakeeladri Temple Road Seva Pandal",
            latitude=idol2.latitude,
            longitude=idol2.longitude,
            status="Available Now",
            verification_status="approved"
        )

        idol5 = created_idols[4] # Khairatabad Maha Ganapati (Hyderabad)
        khairatabad_route = [
            [17.4116, 78.4619],
            [17.4135, 78.4635],
            [17.4170, 78.4680],
            [17.4210, 78.4730]
        ]
        act5 = Activity(
            idol_id=idol5.id,
            activity_type="uregimpu",
            title="Maha Ganapati Grand Shobha Yatra",
            description="Famous Khairatabad Ganesh Nimajjanam procession towards Hussain Sagar Lake.",
            date="September 17",
            start_time="06:00 AM",
            end_time="02:00 PM",
            location="Khairatabad to Hussain Sagar Lake",
            latitude=idol5.latitude,
            longitude=idol5.longitude,
            start_location="Khairatabad Ganesh Pandal",
            end_location="Hussain Sagar Lake Crane No. 4",
            route_coordinates=json.dumps(khairatabad_route),
            crowd_status="High",
            status="Starting Soon",
            verification_status="approved"
        )

        db.add_all([act1, act2, act3, act4, act5])
        db.commit()
