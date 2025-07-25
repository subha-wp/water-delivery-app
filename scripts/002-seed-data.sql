-- Insert sample data for testing

-- Insert sample customers
INSERT INTO users (phone, name, role, address) VALUES
('9876543210', 'Priya Sharma', 'customer', 'A-101, Green Valley Apartments, Sector 12, Noida'),
('9876543211', 'Rajesh Kumar', 'customer', 'B-205, Sunrise Complex, Lajpat Nagar, Delhi'),
('9876543212', 'Anita Patel', 'customer', 'C-45, Rose Garden Society, Ahmedabad'),
('9876543213', 'Suresh Reddy', 'customer', 'D-78, Tech Park Residency, Hyderabad'),
('9876543214', 'Meera Joshi', 'customer', 'E-12, Palm Heights, Pune');

-- Insert sample delivery assistants
INSERT INTO users (phone, name, role) VALUES
('9123456789', 'Ramesh Singh', 'delivery_assistant'),
('9123456788', 'Vikram Yadav', 'delivery_assistant'),
('9123456787', 'Amit Gupta', 'delivery_assistant');

-- Insert sample orders
INSERT INTO orders (customer_id, delivery_type, quantity, price_per_jar, total_amount, status, delivery_assistant_id) VALUES
(1, 'home_delivery', 2, 15, 30, 'delivered', 6),
(2, 'takeaway', 1, 10, 10, 'completed', NULL),
(3, 'home_delivery', 3, 15, 45, 'in_transit', 7),
(4, 'takeaway', 2, 10, 20, 'pending', NULL),
(5, 'home_delivery', 1, 15, 15, 'assigned', 8);

-- Insert sample deliveries
INSERT INTO deliveries (order_id, delivery_assistant_id, delivered_at, empty_jar_returned, delivery_notes) VALUES
(1, 6, CURRENT_TIMESTAMP - INTERVAL '2 hours', true, 'Delivered successfully, customer was home'),
(3, 7, NULL, false, 'On the way to delivery location');

-- Insert sample order logs
INSERT INTO order_logs (order_id, action, performed_by, details) VALUES
(1, 'order_placed', 1, 'Customer placed order via app'),
(1, 'order_assigned', 6, 'Order assigned to delivery assistant'),
(1, 'order_delivered', 6, 'Order delivered and marked complete'),
(3, 'order_placed', 3, 'Customer placed order via app'),
(3, 'order_assigned', 7, 'Order assigned to delivery assistant');
