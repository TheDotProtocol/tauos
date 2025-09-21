-- TauCloud Database Schema - Ultimate File Storage System (FIXED)
-- This schema supports unlimited storage, real-time sync, sharing, and advanced features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (for multi-tenant support)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    storage_limit_gb INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (extends existing users table)
-- Note: Assuming users.id is UUID based on the error message
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS storage_used_bytes BIGINT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create default organization
INSERT INTO organizations (id, name, domain, storage_limit_gb) 
VALUES ('00000000-0000-0000-0000-000000000001', 'TauOS Default', 'tauos.org', 1000)
ON CONFLICT (id) DO NOTHING;

-- Folders table (create first without self-reference)
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_folder_id UUID, -- Will add foreign key constraint later
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for folder
    icon VARCHAR(50) DEFAULT 'folder', -- Icon identifier
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL -- Soft delete
);

-- Add self-reference constraint after table is created
ALTER TABLE folders ADD CONSTRAINT folders_parent_folder_id_fkey 
    FOREIGN KEY (parent_folder_id) REFERENCES folders(id) ON DELETE CASCADE;

-- Add unique constraint after foreign key is added
ALTER TABLE folders ADD CONSTRAINT folders_unique_name_per_parent 
    UNIQUE(user_id, parent_folder_id, name);

-- Files table (main file storage)
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    original_name VARCHAR(500) NOT NULL,
    filename VARCHAR(500) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for deduplication
    is_public BOOLEAN DEFAULT false,
    is_encrypted BOOLEAN DEFAULT true,
    encryption_key_id VARCHAR(100), -- For future encryption key management
    download_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- Soft delete
    version INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb -- Store additional file metadata
);

-- File shares table (for sharing files with specific users or public links)
CREATE TABLE IF NOT EXISTS file_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    shared_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for public shares
    share_token VARCHAR(64) UNIQUE, -- For public link sharing
    permission VARCHAR(20) DEFAULT 'view', -- view, edit, admin
    expires_at TIMESTAMP NULL, -- NULL for permanent shares
    password_hash VARCHAR(255), -- Optional password protection
    download_limit INTEGER NULL, -- NULL for unlimited downloads
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folder shares table (for sharing entire folders)
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

-- File versions table (for version control)
CREATE TABLE IF NOT EXISTS file_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    change_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_id, version_number)
);

-- Activity log table (for tracking all file operations)
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- upload, download, share, delete, move, rename, etc.
    resource_type VARCHAR(20) NOT NULL, -- file, folder, share
    resource_id UUID NOT NULL,
    resource_name VARCHAR(500) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync sessions table (for real-time sync tracking)
CREATE TABLE IF NOT EXISTS sync_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    device_name VARCHAR(255),
    last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(64) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File tags table (for organizing files with tags)
CREATE TABLE IF NOT EXISTS file_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280',
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_id, tag_name)
);

-- Comments table (for file comments and collaboration)
CREATE TABLE IF NOT EXISTS file_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES file_comments(id) ON DELETE CASCADE, -- For replies
    content TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_organization_id ON files(organization_id);
CREATE INDEX IF NOT EXISTS idx_files_parent_folder_id ON files(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_files_file_hash ON files(file_hash);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
CREATE INDEX IF NOT EXISTS idx_files_mime_type ON files(mime_type);
CREATE INDEX IF NOT EXISTS idx_files_is_public ON files(is_public);
CREATE INDEX IF NOT EXISTS idx_files_deleted_at ON files(deleted_at);

CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_folder_id ON folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_folders_deleted_at ON folders(deleted_at);

CREATE INDEX IF NOT EXISTS idx_file_shares_file_id ON file_shares(file_id);
CREATE INDEX IF NOT EXISTS idx_file_shares_shared_with_user_id ON file_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_file_shares_share_token ON file_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_file_shares_is_active ON file_shares(is_active);

CREATE INDEX IF NOT EXISTS idx_folder_shares_folder_id ON folder_shares(folder_id);
CREATE INDEX IF NOT EXISTS idx_folder_shares_shared_with_user_id ON folder_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_folder_shares_share_token ON folder_shares(share_token);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_organization_id ON activity_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);

CREATE INDEX IF NOT EXISTS idx_sync_sessions_user_id ON sync_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_sessions_device_id ON sync_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_sync_sessions_is_active ON sync_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_file_tags_file_id ON file_tags(file_id);
CREATE INDEX IF NOT EXISTS idx_file_tags_tag_name ON file_tags(tag_name);

CREATE INDEX IF NOT EXISTS idx_file_comments_file_id ON file_comments(file_id);
CREATE INDEX IF NOT EXISTS idx_file_comments_user_id ON file_comments(user_id);

-- Functions for storage quota management
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

-- Function to update storage usage
CREATE OR REPLACE FUNCTION update_storage_usage(user_id_param UUID, file_size_change BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET storage_used_bytes = storage_used_bytes + file_size_change
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to get user storage info
CREATE OR REPLACE FUNCTION get_user_storage_info(user_id_param UUID)
RETURNS TABLE(
    used_bytes BIGINT,
    limit_bytes BIGINT,
    used_percent NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.storage_used_bytes,
        o.storage_limit_gb * 1024 * 1024 * 1024,
        ROUND((u.storage_used_bytes::NUMERIC / (o.storage_limit_gb * 1024 * 1024 * 1024)) * 100, 2)
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to search files
CREATE OR REPLACE FUNCTION search_files(
    user_id_param UUID,
    search_query TEXT,
    limit_param INTEGER DEFAULT 50,
    offset_param INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    original_name VARCHAR(500),
    filename VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP,
    is_public BOOLEAN,
    download_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.original_name,
        f.filename,
        f.file_size,
        f.mime_type,
        f.created_at,
        f.is_public,
        f.download_count
    FROM files f
    WHERE f.user_id = user_id_param
    AND f.deleted_at IS NULL
    AND (
        f.original_name ILIKE '%' || search_query || '%'
        OR f.mime_type ILIKE '%' || search_query || '%'
        OR EXISTS (
            SELECT 1 FROM file_tags ft 
            WHERE ft.file_id = f.id 
            AND ft.tag_name ILIKE '%' || search_query || '%'
        )
    )
    ORDER BY f.created_at DESC
    LIMIT limit_param OFFSET offset_param;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_shares_updated_at BEFORE UPDATE ON file_shares
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folder_shares_updated_at BEFORE UPDATE ON folder_shares
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_comments_updated_at BEFORE UPDATE ON file_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
-- Note: Replace '00000000-0000-0000-0000-000000000001' with actual user UUID from your users table
INSERT INTO folders (id, user_id, organization_id, name, description, color, icon) 
VALUES 
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Documents', 'Important documents', '#3B82F6', 'folder'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Images', 'Photos and graphics', '#10B981', 'image'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Videos', 'Video files', '#F59E0B', 'video'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Music', 'Audio files', '#8B5CF6', 'music')
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;
