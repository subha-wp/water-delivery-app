-- Create database schema for water jar delivery app

-- Users table (customers and delivery assistants)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'delivery_assistant')),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('takeaway', 'home_delivery')),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_per_jar INTEGER NOT NULL, -- in rupees
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'completed')),
    placed_by_assistant_id INTEGER REFERENCES users(id), -- NULL if placed by customer
    delivery_assistant_id INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries table (tracks delivery completion and jar returns)
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    delivery_assistant_id INTEGER REFERENCES users(id),
    delivered_at TIMESTAMP,
    empty_jar_returned BOOLEAN DEFAULT FALSE,
    delivery_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order logs for audit trail
CREATE TABLE order_logs (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    action VARCHAR(50) NOT NULL,
    performed_by INTEGER REFERENCES users(id),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_delivery_assistant_id ON orders(delivery_assistant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
