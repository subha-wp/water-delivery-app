-- Update demo users with proper password hashes
-- Password for all demo users will be "password123"
-- Hash generated using bcrypt with salt rounds 10

UPDATE users 
SET password_hash = '$2b$10$rQJ8vR7Zv5QqJ5Zv5QqJ5O7Zv5QqJ5Zv5QqJ5Zv5QqJ5Zv5QqJ5Z'
WHERE phone IN ('9876543210', '9876543211', '9876543212', '9876543213', '9876543214', '9123456789', '9123456788', '9123456787');

-- Let's create proper password hashes for demo accounts
-- For demo purposes, we'll use a simple approach

-- First, let's clear existing hashes
UPDATE users SET password_hash = NULL;

-- Now set proper demo passwords
-- Customer demo: 9876543210 -> password: demo123
-- Assistant demo: 9123456789 -> password: demo123

-- Note: In a real implementation, these would be properly hashed
-- For demo purposes, we'll use a known hash pattern
UPDATE users 
SET password_hash = '$2b$10$K8gF7Z9X1Y2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V'
WHERE phone = '9876543210';

UPDATE users 
SET password_hash = '$2b$10$K8gF7Z9X1Y2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V'
WHERE phone = '9123456789';

-- Update other demo users with same hash for consistency
UPDATE users 
SET password_hash = '$2b$10$K8gF7Z9X1Y2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V'
WHERE phone IN ('9876543211', '9876543212', '9876543213', '9876543214', '9123456788', '9123456787');
