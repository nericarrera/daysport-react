CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_products (name, price) VALUES
('camiseta Deportiva', 29.99),
('Short de Runnig', 24.500),
('Zapatillas premium', 89.99);
