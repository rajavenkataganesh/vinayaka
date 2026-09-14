-- GaneshMap PostgreSQL / Supabase Schema Definition

-- Enable PostGIS extension if available for advanced geospatial indexing
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Ganesh Idols Table
CREATE TABLE IF NOT EXISTS idols (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    area VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    image_url VARCHAR(500),
    organizer_name VARCHAR(255),
    contact_number VARCHAR(50),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    opening_time VARCHAR(50),
    closing_time VARCHAR(50),
    crowd_status VARCHAR(50) DEFAULT 'Low',
    eco_status VARCHAR(50) DEFAULT 'Eco-Friendly',
    verification_status VARCHAR(50) DEFAULT 'verified',
    is_demo BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_idols_area ON idols(area);
CREATE INDEX IF NOT EXISTS idx_idols_status ON idols(verification_status);

-- 3. Festival Activities & Seva Information Table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    idol_id INTEGER NOT NULL REFERENCES idols(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'prasadam', 'annadanam', 'uregimpu'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date VARCHAR(50) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50),
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    organizer_name VARCHAR(255),
    contact_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Upcoming', -- 'Upcoming', 'Available Now', 'In Progress', 'Completed', 'Cancelled'
    verification_status VARCHAR(50) DEFAULT 'approved',
    start_location VARCHAR(255),
    end_location VARCHAR(255),
    route_coordinates TEXT, -- JSON array of [[lat, lng], ...]
    crowd_status VARCHAR(50) DEFAULT 'Medium',
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activities_idol_id ON activities(idol_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);

-- 4. Community Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    submitter_name VARCHAR(255),
    idol_name VARCHAR(255) NOT NULL,
    area VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    organizer_name VARCHAR(255),
    contact_number VARCHAR(50),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    opening_time VARCHAR(50),
    closing_time VARCHAR(50),
    description TEXT,
    eco_status VARCHAR(50) DEFAULT 'Eco-Friendly',
    image_url VARCHAR(500),
    ai_detection_result VARCHAR(255),
    ai_confidence DOUBLE PRECISION DEFAULT 0.0,
    is_ai_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. User Issue Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    idol_id INTEGER NOT NULL REFERENCES idols(id) ON DELETE CASCADE,
    reported_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    report_type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Ratings and Reviews Table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    idol_id INTEGER NOT NULL REFERENCES idols(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) DEFAULT 'Devotee',
    rating DOUBLE PRECISION NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
