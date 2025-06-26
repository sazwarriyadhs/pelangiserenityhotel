-- schema.sql

-- Drop existing tables to start with a clean slate
-- The order is important due to foreign key constraints
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS attractions;
DROP TABLE IF EXISTS flights;


-- Create the rooms table to store hotel room information
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    ai_hint VARCHAR(255),
    price_per_night NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the guests table to store guest information
CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the bookings table to store reservation details
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
    guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'confirmed', -- e.g., confirmed, pending, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the payments table to track financial transactions
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(100), -- e.g., 'Credit Card', 'Bank Transfer'
    payment_status VARCHAR(50) DEFAULT 'completed', -- e.g., completed, pending, failed
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the attractions table for the AI concierge
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- e.g., 'Museum', 'Park', 'Restaurant'
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the flights table for the travel marketplace integration
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Insert sample data into the rooms table
-- This data mirrors what's in src/lib/constants.ts
INSERT INTO rooms (name, description, image_url, ai_hint, price_per_night) VALUES
('Deluxe Queen Room', 'A spacious room with a queen-sized bed, offering a stunning city view.', 'https://placehold.co/600x400.png', 'hotel room', 250.00),
('Luxury King Suite', 'Experience ultimate luxury in our suite with a king-sized bed and a separate living area.', 'https://placehold.co/600x400.png', 'luxury suite', 450.00),
('Presidential Suite', 'The pinnacle of luxury, this suite offers unparalleled amenities and panoramic views.', 'https://placehold.co/600x400.png', 'presidential suite', 1200.00);
