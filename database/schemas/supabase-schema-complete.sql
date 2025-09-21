-- TauOS Complete Database Schema for Supabase
-- This file contains all necessary tables and data for the TauOS ecosystem

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    storage_limit_gb INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for TauCloud, TauID, TauMail)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    recovery_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Files table (for TauCloud)
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    file_type VARCHAR(50),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Apps table (for TauStore)
CREATE TABLE IF NOT EXISTS apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50),
    category VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    downloads INTEGER DEFAULT 0,
    icon_url TEXT,
    download_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emails table (for TauMail)
CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT,
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sent emails table (for TauMail)
CREATE TABLE IF NOT EXISTS sent_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Storage usage tracking
CREATE TABLE IF NOT EXISTS storage_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    used_bytes BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_organization_id ON files(organization_id);
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_to_email ON emails(to_email);
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_category ON apps(category);
CREATE INDEX IF NOT EXISTS idx_apps_featured ON apps(is_featured);

-- Create functions for storage management
CREATE OR REPLACE FUNCTION check_storage_limit(
    org_id UUID,
    user_id UUID,
    file_size BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
    org_limit BIGINT;
    current_usage BIGINT;
BEGIN
    -- Get organization storage limit
    SELECT storage_limit_gb * 1024 * 1024 * 1024 INTO org_limit
    FROM organizations WHERE id = org_id;
    
    -- Get current usage
    SELECT COALESCE(SUM(file_size), 0) INTO current_usage
    FROM files WHERE organization_id = org_id;
    
    -- Check if adding this file would exceed limit
    RETURN (current_usage + file_size) <= org_limit;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_storage_usage(
    org_id UUID,
    user_id UUID,
    file_size BIGINT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO storage_usage (organization_id, user_id, used_bytes)
    VALUES (org_id, user_id, file_size)
    ON CONFLICT (organization_id, user_id)
    DO UPDATE SET 
        used_bytes = storage_usage.used_bytes + file_size,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Insert default organization
INSERT INTO organizations (id, name, domain, storage_limit_gb) 
VALUES ('00000000-0000-0000-0000-000000000001', 'TauOS Default', 'tauos.org', 10)
ON CONFLICT (id) DO NOTHING;

-- Insert test user (john@tauos.org / password123)
INSERT INTO users (
    id,
    organization_id,
    username,
    email,
    password_hash,
    full_name,
    is_active,
    is_verified
) VALUES (
    'e41f4185-cb88-4df1-9981-84cf723eb98e',
    '00000000-0000-0000-0000-000000000001',
    'john',
    'john@tauos.org',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', -- password123
    'John Doe',
    true,
    true
) ON CONFLICT (id) DO NOTHING;

-- Insert sample apps for TauStore
INSERT INTO apps (name, description, version, category, price, rating, downloads, icon_url, is_featured) VALUES
('TauMail', 'Secure email client with end-to-end encryption', '1.0.0', 'productivity', 0.00, 4.8, 1250, '📧', true),
('TauCloud', 'Privacy-first cloud storage and file sync', '1.0.0', 'storage', 0.00, 4.9, 2100, '☁️', true),
('TauBrowser', 'Privacy-focused web browser', '1.0.0', 'internet', 0.00, 4.7, 1800, '🌐', true),
('TauTalk', 'Secure video calling app', '1.0.0', 'communication', 0.00, 4.6, 950, '📹', true),
('TauStore', 'App marketplace for TauOS ecosystem', '1.0.0', 'marketplace', 0.00, 4.5, 800, '🛍️', true),
('TauID', 'Identity management and authentication', '1.0.0', 'security', 0.00, 4.8, 1200, '🆔', true),
('TauCalendar', 'Smart calendar and scheduling', '1.0.0', 'productivity', 0.00, 4.4, 650, '📅', false),
('TauNotes', 'Secure note-taking app', '1.0.0', 'productivity', 0.00, 4.3, 720, '📝', false),
('TauMusic', 'Music streaming and player', '1.0.0', 'media', 0.00, 4.2, 580, '🎵', false),
('TauMaps', 'Navigation and maps', '1.0.0', 'navigation', 0.00, 4.1, 420, '🗺️', false)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your Supabase setup)
-- These might need to be adjusted based on your Supabase project settings
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
