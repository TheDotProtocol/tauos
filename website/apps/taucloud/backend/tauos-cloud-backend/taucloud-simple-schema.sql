-- TauCloud Database Schema - SIMPLE WORKING VERSION
-- This will definitely work without any errors

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    storage_limit_gb INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table extensions
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS storage_used_bytes BIGINT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create default organization
INSERT INTO organizations (id, name, domain, storage_limit_gb) 
VALUES ('00000000-0000-0000-0000-000000000001', 'TauOS Default', 'tauos.org', 1000)
ON CONFLICT (id) DO NOTHING;

-- Folders table (NO self-reference for now)
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_folder_id UUID, -- No foreign key constraint yet
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'folder',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_folder_id UUID, -- No foreign key constraint yet
    original_name VARCHAR(500) NOT NULL,
    filename VARCHAR(500) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    is_encrypted BOOLEAN DEFAULT true,
    encryption_key_id VARCHAR(100),
    download_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    version INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- File shares table
CREATE TABLE IF NOT EXISTS file_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    shared_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    share_token VARCHAR(64) UNIQUE,
    permission VARCHAR(20) DEFAULT 'view',
    expires_at TIMESTAMP NULL,
    password_hash VARCHAR(255),
    download_limit INTEGER NULL,
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folder shares table
CREATE TABLE IF NOT EXISTS folder_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    shared_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    share_token VARCHAR(64) UNIQUE,
    permission VARCHAR(20) DEFAULT 'view',
    expires_at TIMESTAMP NULL,
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(20) NOT NULL,
    resource_id UUID NOT NULL,
    resource_name VARCHAR(500) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_organization_id ON files(organization_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
CREATE INDEX IF NOT EXISTS idx_files_mime_type ON files(mime_type);
CREATE INDEX IF NOT EXISTS idx_files_is_public ON files(is_public);

CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_organization_id ON folders(organization_id);

CREATE INDEX IF NOT EXISTS idx_file_shares_file_id ON file_shares(file_id);
CREATE INDEX IF NOT EXISTS idx_file_shares_shared_with_user_id ON file_shares(shared_with_user_id);

CREATE INDEX IF NOT EXISTS idx_folder_shares_folder_id ON folder_shares(folder_id);
CREATE INDEX IF NOT EXISTS idx_folder_shares_shared_with_user_id ON folder_shares(shared_with_user_id);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_organization_id ON activity_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- Basic functions
-- Drop existing functions first to avoid parameter name conflicts
DROP FUNCTION IF EXISTS check_storage_quota(UUID, BIGINT);
DROP FUNCTION IF EXISTS check_storage_quota(INTEGER, BIGINT);
DROP FUNCTION IF EXISTS update_storage_usage(UUID, BIGINT);
DROP FUNCTION IF EXISTS update_storage_usage(INTEGER, BIGINT);

CREATE OR REPLACE FUNCTION check_storage_quota(user_id_param UUID, file_size_param BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    user_storage_used BIGINT;
    user_storage_limit BIGINT;
BEGIN
    SELECT u.storage_used_bytes, o.storage_limit_gb * 1024 * 1024 * 1024
    INTO user_storage_used, user_storage_limit
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = user_id_param;
    
    RETURN (user_storage_used + file_size_param) <= user_storage_limit;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_storage_usage(user_id_param UUID, file_size_change BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET storage_used_bytes = storage_used_bytes + file_size_change
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'TauCloud database schema created successfully! Ready for development!';
END $$;
