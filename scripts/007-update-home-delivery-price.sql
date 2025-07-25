-- Update home delivery price from ₹15 to ₹20
-- This will update existing orders and set the new price for future orders

-- Update existing home delivery orders that haven't been delivered yet
UPDATE orders 
SET 
    price_per_jar = 20,
    total_amount = quantity * 20,
    updated_at = CURRENT_TIMESTAMP
WHERE delivery_type = 'home_delivery' 
AND price_per_jar = 15
AND status IN ('pending', 'assigned', 'in_transit');

-- Add a log entry for the price update
INSERT INTO order_logs (order_id, action, performed_by, details)
SELECT 
    id,
    'price_updated',
    1, -- System user
    'Home delivery price updated from ₹15 to ₹20'
FROM orders 
WHERE delivery_type = 'home_delivery' 
AND price_per_jar = 20
AND updated_at >= CURRENT_TIMESTAMP - INTERVAL '1 minute';
