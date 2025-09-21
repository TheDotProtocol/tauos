-- TauOS Fixed SQL Schema for Supabase
-- This version works with existing database structure

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS apps CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Create organizations table (simplified)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create files table
CREATE TABLE files (
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

-- Create apps table
CREATE TABLE apps (
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

-- Create emails table
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default organization
INSERT INTO organizations (id, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'TauOS Default')
ON CONFLICT (id) DO NOTHING;

-- Insert test user (john@tauos.org / password123)
-- Password hash for 'password123' using bcrypt with salt rounds 12
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

-- Insert sample apps
INSERT INTO apps (name, description, category, price, rating, downloads, is_featured) VALUES
('TauMail', 'Secure email client', 'productivity', 0.00, 4.8, 1250, true),
('TauCloud', 'Privacy-first cloud storage', 'storage', 0.00, 4.9, 2100, true),
('TauBrowser', 'Privacy-focused browser', 'internet', 0.00, 4.7, 1800, true),
('TauTalk', 'Secure video calling', 'communication', 0.00, 4.6, 950, true),
('TauStore', 'App marketplace', 'marketplace', 0.00, 4.5, 800, true),
('TauID', 'Identity management', 'security', 0.00, 4.8, 1200, true)
ON CONFLICT DO NOTHING;
