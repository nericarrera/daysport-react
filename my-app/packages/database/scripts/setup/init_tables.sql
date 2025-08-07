CREATE TABLE IF NOT EXISTS test_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Luego inserta los datos
INSERT INTO test_products (name, price) VALUES
    ('Camiseta Deportiva', 29.99),
    ('Short de Running', 24.50),
    ('Zapatillas Premium', 89.99);
