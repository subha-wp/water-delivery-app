-- Create villages table for delivery areas
CREATE TABLE villages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert available villages
INSERT INTO villages (name) VALUES
('JADAB NAGAR'),
('D/RAJARAMPUR'),
('CHAKDULAL PUR'),
('Dakshin Sukdebpur'),
('Andinagar'),
('Dakshin Damodarpur'),
('Krishnachandrapur'),
('SINGHERHAT'),
('GARANKATI'),
('RAMTANU NAGAR'),
('KARANJALI');

-- Add village_id to users table for customer addresses
ALTER TABLE users ADD COLUMN village_id INTEGER REFERENCES villages(id);

-- Add village_id to orders table to track delivery location
ALTER TABLE orders ADD COLUMN village_id INTEGER REFERENCES villages(id);

-- Update existing customers with village selection (for demo purposes)
-- You can update these manually or leave them NULL for new village selection
UPDATE users SET village_id = 1 WHERE phone = '9876543210'; -- JADAB NAGAR
UPDATE users SET village_id = 2 WHERE phone = '9876543211'; -- D/RAJARAMPUR
UPDATE users SET village_id = 3 WHERE phone = '9876543212'; -- CHAKDULAL PUR
UPDATE users SET village_id = 4 WHERE phone = '9876543213'; -- Dakshin Sukdebpur
UPDATE users SET village_id = 5 WHERE phone = '9876543214'; -- Andinagar

-- Update existing orders with village information
UPDATE orders SET village_id = (
    SELECT village_id FROM users WHERE users.id = orders.customer_id
) WHERE village_id IS NULL;

-- Create index for better performance
CREATE INDEX idx_users_village_id ON users(village_id);
CREATE INDEX idx_orders_village_id ON orders(village_id);
CREATE INDEX idx_villages_active ON villages(is_active);
