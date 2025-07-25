-- Add instant_jar_received column to deliveries table
ALTER TABLE deliveries ADD COLUMN instant_jar_received BOOLEAN DEFAULT FALSE;

-- Update existing deliveries to have instant_jar_received = false
UPDATE deliveries SET instant_jar_received = false WHERE instant_jar_received IS NULL;

-- Add index for better performance
CREATE INDEX idx_deliveries_instant_jar_received ON deliveries(instant_jar_received);
