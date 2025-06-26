-- schema.sql

-- Rooms table to store information about different room types
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_usd NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populate the rooms table with initial data
INSERT INTO rooms (name, description, price_usd) VALUES
('Deluxe Queen Room', 'A spacious room with a queen-sized bed, offering a stunning city view.', 250.00),
('Luxury King Suite', 'Experience ultimate luxury in our suite with a king-sized bed and a separate living area.', 450.00),
('Presidential Suite', 'The pinnacle of luxury, this suite offers unparalleled amenities and panoramic views.', 1200.00);

-- Guests table to store information about guests
CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff table to manage hotel staff information
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100), -- e.g., Front Desk, Manager, Concierge
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Booking Sources table to track where bookings come from
CREATE TABLE booking_sources (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(255) UNIQUE NOT NULL -- e.g., Website, Phone, Travel Agency
);

INSERT INTO booking_sources (source_name) VALUES
('Website'),
('Phone'),
('Travel Agency'),
('Walk-in');

-- Bookings table to manage room reservations
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    guest_id INTEGER REFERENCES guests(id),
    staff_id INTEGER REFERENCES staff(id), -- Staff who made the booking
    booking_source_id INTEGER REFERENCES booking_sources(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- e.g., confirmed, cancelled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table to track payments for bookings
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- e.g., credit_card, bank_transfer
    payment_status VARCHAR(50) DEFAULT 'completed', -- e.g., pending, completed, failed
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table for guest feedback
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    guest_id INTEGER REFERENCES guests(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Attractions table for AI Concierge recommendations
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    category VARCHAR(100), -- e.g., Museum, Park, Restaurant
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Flights table for storing flight information from travel marketplace
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    origin_airport_code VARCHAR(10) NOT NULL,
    destination_airport_code VARCHAR(10) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Concierge Logs table for dashboard analytics
CREATE TABLE ai_concierge_logs (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id) NULL, -- Can be null for anonymous users
    session_id VARCHAR(255),
    query TEXT,
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Website Visits table for basic traffic analytics
CREATE TABLE website_visits (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    page_path VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    visit_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);