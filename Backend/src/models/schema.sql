-- Create mappings table
CREATE TABLE IF NOT EXISTS column_mappings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mapping_config JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sustainability_data table
CREATE TABLE IF NOT EXISTS sustainability_data (
    id SERIAL PRIMARY KEY,
    date DATE,
    emission_kg DECIMAL,
    energy_consumption_kwh DECIMAL,
    water_usage_liters DECIMAL,
    waste_kg DECIMAL,
    renewable_energy_percentage DECIMAL,
    notes TEXT,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 