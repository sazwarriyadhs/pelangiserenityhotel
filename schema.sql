-- Drop tables if they exist to start with a clean state
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;

-- Create the rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    ai_hint VARCHAR(100),
    price_per_night NUMERIC(10, 2) NOT NULL
);

-- Create the bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dates CHECK (check_out_date > check_in_date)
);

-- Insert sample data into the rooms table
-- This data mirrors the content from src/lib/constants.ts
INSERT INTO rooms (name, description, image_url, ai_hint, price_per_night) VALUES
('Deluxe Queen Room', 'A spacious room with a queen-sized bed, offering a stunning city view.', 'https://placehold.co/600x400.png', 'hotel room', 250.00),
('Luxury King Suite', 'Experience ultimate luxury in our suite with a king-sized bed and a separate living area.', 'https://placehold.co/600x400.png', 'luxury suite', 450.00),
('Presidential Suite', 'The pinnacle of luxury, this suite offers unparalleled amenities and panoramic views.', 'https://placehold.co/600x400.png', 'presidential suite', 1200.00);
