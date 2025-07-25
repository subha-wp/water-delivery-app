-- Add password field to users table
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);

-- Update existing users with default passwords for testing
UPDATE users SET password_hash = '$2b$10$rQJ8vR7Zv5QqJ5Zv5QqJ5O7Zv5QqJ5Zv5QqJ5Zv5QqJ5Zv5QqJ5Z' WHERE role = 'customer';
UPDATE users SET password_hash = '$2b$10$rQJ8vR7Zv5QqJ5Zv5QqJ5O7Zv5QqJ5Zv5QqJ5Zv5QqJ5Zv5QqJ5Z' WHERE role = 'delivery_assistant';

-- Add index for better performance
CREATE INDEX idx_users_password_hash ON users(password_hash);
