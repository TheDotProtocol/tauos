-- TauOS Database Schema - Simplified Version
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    storage_limit BIGINT DEFAULT 5368709120, -- 5GB default
    user_limit INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    recovery_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emails table (for TauMail)
CREATE TABLE IF NOT EXISTS emails (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Files table (for TauCloud)
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    original_name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folders table (for TauCloud)
CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER REFERENCES folders(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_emails_organization_id ON emails(organization_id);
CREATE INDEX IF NOT EXISTS idx_emails_sender_id ON emails(sender_id);
CREATE INDEX IF NOT EXISTS idx_emails_recipient_id ON emails(recipient_id);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at);
CREATE INDEX IF NOT EXISTS idx_files_organization_id ON files(organization_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
CREATE INDEX IF NOT EXISTS idx_folders_organization_id ON folders(organization_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);

-- Function to update storage usage
CREATE OR REPLACE FUNCTION update_storage_usage(
    p_organization_id INTEGER,
    p_user_id INTEGER,
    p_size_change BIGINT
) RETURNS VOID AS $$
BEGIN
    -- Update organization storage usage
    UPDATE organizations 
    SET storage_limit = storage_limit - p_size_change
    WHERE id = p_organization_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check storage limits
CREATE OR REPLACE FUNCTION check_storage_limit(
    p_organization_id INTEGER,
    p_user_id INTEGER,
    p_file_size BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
    org_storage_limit BIGINT;
    current_usage BIGINT;
BEGIN
    -- Get organization storage limit
    SELECT storage_limit INTO org_storage_limit
    FROM organizations
    WHERE id = p_organization_id;
    
    -- Get current usage
    SELECT COALESCE(SUM(file_size), 0) INTO current_usage
    FROM files
    WHERE organization_id = p_organization_id AND is_deleted = FALSE;
    
    -- Check if adding the file would exceed the limit
    RETURN (current_usage + p_file_size) <= org_storage_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get user storage stats
CREATE OR REPLACE FUNCTION get_user_storage_stats(p_user_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
    user_usage BIGINT;
    user_limit BIGINT;
    org_usage BIGINT;
    org_limit BIGINT;
    org_id INTEGER;
BEGIN
    -- Get organization ID for the user
    SELECT organization_id INTO org_id
    FROM users
    WHERE id = p_user_id;
    
    -- Get user storage usage
    SELECT COALESCE(SUM(file_size), 0) INTO user_usage
    FROM files
    WHERE user_id = p_user_id AND is_deleted = FALSE;
    
    -- Get organization storage usage
    SELECT COALESCE(SUM(file_size), 0) INTO org_usage
    FROM files
    WHERE organization_id = org_id AND is_deleted = FALSE;
    
    -- Get limits (using organization limits for now)
    SELECT storage_limit INTO org_limit
    FROM organizations
    WHERE id = org_id;
    
    user_limit := org_limit; -- For now, user limit = org limit
    
    -- Build result JSON
    result := json_build_object(
        'user_storage_used', user_usage,
        'user_storage_limit', user_limit,
        'user_storage_percentage', CASE WHEN user_limit > 0 THEN (user_usage::FLOAT / user_limit::FLOAT) * 100 ELSE 0 END,
        'org_storage_used', org_usage,
        'org_storage_limit', org_limit,
        'org_storage_percentage', CASE WHEN org_limit > 0 THEN (org_usage::FLOAT / org_limit::FLOAT) * 100 ELSE 0 END
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then recreate
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_emails_updated_at ON emails;
DROP TRIGGER IF EXISTS update_files_updated_at ON files;
DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;

-- Create triggers for updated_at columns
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default organizations (ignore if they already exist)
INSERT INTO organizations (name, domain, storage_limit, user_limit) 
VALUES ('TauOS', 'tauos.org', 5368709120, 5) -- 5GB, 5 users
ON CONFLICT (domain) DO NOTHING;

INSERT INTO organizations (name, domain, storage_limit, user_limit) 
VALUES ('AR Holdings Group', 'arholdings.group', 107374182400, 100) -- 100GB, 100 users
ON CONFLICT (domain) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 