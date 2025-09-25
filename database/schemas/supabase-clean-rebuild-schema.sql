-- TauOS Clean Rebuild Database Schema
-- Optimized for production-ready email and cloud storage system
-- Run this in Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS email_attachments CASCADE;
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS apps CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Create organizations table (simplified and optimized)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    storage_limit_gb INTEGER DEFAULT 10,
    email_limit_per_day INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (optimized for email and cloud)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    email_quota_used INTEGER DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create files table (optimized for cloud storage)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64), -- For deduplication
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create apps table (for TauStore)
CREATE TABLE apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    downloads INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create emails table (optimized for email system)
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    cc_emails TEXT[], -- Array of CC emails
    bcc_emails TEXT[], -- Array of BCC emails
    subject VARCHAR(500),
    body TEXT,
    body_html TEXT,
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    is_draft BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    is_delivered BOOLEAN DEFAULT false,
    delivery_status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, failed, bounced
    error_message TEXT,
    reply_to_email VARCHAR(255),
    message_id VARCHAR(255) UNIQUE, -- SMTP Message-ID
    in_reply_to VARCHAR(255), -- For threading
    email_references TEXT[], -- For threading
    attachments JSONB, -- Store attachment metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create email_attachments table (for file attachments)
CREATE TABLE email_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    content_id VARCHAR(255), -- For inline attachments
    is_inline BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_files_user ON files(user_id);
CREATE INDEX idx_files_organization ON files(organization_id);
CREATE INDEX idx_emails_user ON emails(user_id);
CREATE INDEX idx_emails_sender ON emails(sender_id);
CREATE INDEX idx_emails_recipient ON emails(recipient_id);
CREATE INDEX idx_emails_created_at ON emails(created_at);
CREATE INDEX idx_emails_delivery_status ON emails(delivery_status);
CREATE INDEX idx_email_attachments_email ON email_attachments(email_id);

-- Insert default organization
INSERT INTO organizations (id, name, domain, storage_limit_gb, email_limit_per_day) 
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'TauOS Default', 
    'tauos.org',
    100, -- 100GB storage limit
    10000 -- 10,000 emails per day limit
) ON CONFLICT (id) DO NOTHING;

-- Insert test user (john@tauos.org / password123)
-- Password hash for 'password123' using bcrypt with salt rounds 12
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
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K',
    'John Doe',
    true,
    true
) ON CONFLICT (id) DO NOTHING;

-- Insert sample apps
INSERT INTO apps (name, description, category, price, rating, downloads, is_featured) VALUES
('TauMail', 'Secure email client with end-to-end encryption', 'productivity', 0.00, 4.8, 1250, true),
('TauCloud', 'Privacy-first cloud storage with zero-knowledge encryption', 'storage', 0.00, 4.9, 2100, true),
('TauBrowser', 'Privacy-focused browser with built-in VPN', 'internet', 0.00, 4.7, 1800, true),
('TauTalk', 'Secure video calling with end-to-end encryption', 'communication', 0.00, 4.6, 950, true),
('TauStore', 'Decentralized app marketplace', 'marketplace', 0.00, 4.5, 800, true),
('TauID', 'Identity management with biometric authentication', 'security', 0.00, 4.8, 1200, true)
ON CONFLICT DO NOTHING;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to check email quota
CREATE OR REPLACE FUNCTION check_email_quota(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_quota INTEGER;
    emails_sent_today INTEGER;
    org_quota INTEGER;
BEGIN
    -- Get user's daily email quota from organization
    SELECT o.email_limit_per_day INTO org_quota
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = user_uuid;
    
    -- Get emails sent today by this user
    SELECT COUNT(*) INTO emails_sent_today
    FROM emails
    WHERE sender_id = user_uuid
    AND DATE(created_at) = CURRENT_DATE
    AND is_sent = true;
    
    -- Check if under quota
    RETURN emails_sent_today < org_quota;
END;
$$ LANGUAGE plpgsql;

-- Create function to check storage quota
CREATE OR REPLACE FUNCTION check_storage_quota(user_uuid UUID, file_size BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    org_storage_limit BIGINT;
    user_storage_used BIGINT;
BEGIN
    -- Get organization storage limit in bytes
    SELECT (o.storage_limit_gb * 1024 * 1024 * 1024) INTO org_storage_limit
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = user_uuid;
    
    -- Get current storage used by user
    SELECT COALESCE(SUM(f.file_size), 0) INTO user_storage_used
    FROM files f
    WHERE f.user_id = user_uuid;
    
    -- Check if adding this file would exceed quota
    RETURN (user_storage_used + file_size) <= org_storage_limit;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your Supabase setup)
-- These might need to be adjusted based on your Supabase RLS policies

COMMENT ON TABLE organizations IS 'Organizations with storage and email quotas';
COMMENT ON TABLE users IS 'Users with email and storage usage tracking';
COMMENT ON TABLE files IS 'File storage with deduplication and usage tracking';
COMMENT ON TABLE emails IS 'Email system with delivery tracking and threading';
COMMENT ON TABLE email_attachments IS 'Email attachments with inline support';
COMMENT ON TABLE apps IS 'TauStore applications';

-- Success message
SELECT 'TauOS Clean Rebuild Schema Created Successfully!' as status;
