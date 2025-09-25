-- TauOS Add Missing Columns SQL
-- Use this if you want to keep existing data and just add missing columns

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add missing columns to existing tables
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS storage_limit_gb INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID;

-- Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    original_name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    downloads INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default organization if it doesn't exist
INSERT INTO organizations (id, name, storage_limit_gb) 
VALUES ('00000000-0000-0000-0000-000000000001', 'TauOS Default', 10)
ON CONFLICT (id) DO NOTHING;

-- Insert test user if it doesn't exist
INSERT INTO users (
    id,
    organization_id,
    username,
    email,
    password_hash,
    full_name,
    is_active
) VALUES (
    'e41f4185-cb88-4df1-9981-84cf723eb98e',
    '00000000-0000-0000-0000-000000000001',
    'john',
    'john@tauos.org',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K',
    'John Doe',
    true
) ON CONFLICT (id) DO NOTHING;

-- Insert sample apps if they don't exist
INSERT INTO apps (name, description, category, price, rating, downloads, is_featured) VALUES
('TauMail', 'Secure email client', 'productivity', 0.00, 4.8, 1250, true),
('TauCloud', 'Privacy-first cloud storage', 'storage', 0.00, 4.9, 2100, true),
('TauBrowser', 'Privacy-focused browser', 'internet', 0.00, 4.7, 1800, true),
('TauTalk', 'Secure video calling', 'communication', 0.00, 4.6, 950, true),
('TauStore', 'App marketplace', 'marketplace', 0.00, 4.5, 800, true),
('TauID', 'Identity management', 'security', 0.00, 4.8, 1200, true)
ON CONFLICT DO NOTHING;
