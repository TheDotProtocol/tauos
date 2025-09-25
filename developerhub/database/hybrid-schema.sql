-- TauCore™ Hybrid Database Schema - Production Ready
-- Integrates all TauOS applications into a unified, scalable database
-- PostgreSQL Database Schema for Complete TauOS Ecosystem

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE SCHEMA (Centralized - High Performance)
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS email_attachments CASCADE;
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS cloud_files CASCADE;
DROP TABLE IF EXISTS cloud_folders CASCADE;
DROP TABLE IF EXISTS store_apps CASCADE;
DROP TABLE IF EXISTS store_categories CASCADE;
DROP TABLE IF EXISTS browser_bookmarks CASCADE;
DROP TABLE IF EXISTS browser_history CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;
DROP TABLE IF EXISTS ai_models CASCADE;
DROP TABLE IF EXISTS pipeline_runs CASCADE;
DROP TABLE IF EXISTS pipelines CASCADE;
DROP TABLE IF EXISTS git_repositories CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS project_collaborators CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS login_attempts CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- CORE TABLES (Centralized Schema)
-- =====================================================

-- Organizations table (for enterprise features)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
    max_users INTEGER DEFAULT 10,
    storage_quota_bytes BIGINT DEFAULT 1073741824, -- 1GB
    email_quota_daily INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (enhanced with enterprise features)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires_at TIMESTAMP WITH TIME ZONE,
    is_two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    custom_domain VARCHAR(255),
    email_quota_used INTEGER DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table (enhanced)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info JSONB,
    remember_me BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Login attempts table (enhanced security)
CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security events table (comprehensive security logging)
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- login, logout, password_change, etc.
    event_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    severity VARCHAR(20) DEFAULT 'info', -- info, warning, error, critical
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table (unified preferences)
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL,
    preference_value JSONB,
    app_name VARCHAR(50) NOT NULL, -- taumail, taucloud, taustore, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_key, app_name)
);

-- =====================================================
-- TAUMAIL SCHEMA (Email System)
-- =====================================================

-- Emails table (comprehensive email system)
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    cc_emails TEXT[],
    bcc_emails TEXT[],
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    html_body TEXT,
    message_id VARCHAR(255) UNIQUE NOT NULL,
    reply_to_email VARCHAR(255),
    in_reply_to VARCHAR(255),
    email_references TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    is_draft BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    is_spam BOOLEAN DEFAULT FALSE,
    is_trash BOOLEAN DEFAULT FALSE,
    folder VARCHAR(50) DEFAULT 'inbox',
    priority VARCHAR(20) DEFAULT 'normal',
    delivery_status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email attachments table
CREATE TABLE email_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TAUCLOUD SCHEMA (Cloud Storage)
-- =====================================================

-- Cloud folders table
CREATE TABLE cloud_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_folder_id UUID REFERENCES cloud_folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(255),
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cloud files table
CREATE TABLE cloud_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES cloud_folders(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    file_hash VARCHAR(255),
    is_shared BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(255),
    permissions JSONB,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TAUSTORE SCHEMA (App Store)
-- =====================================================

-- Store categories table
CREATE TABLE store_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    parent_category_id UUID REFERENCES store_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store apps table
CREATE TABLE store_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES store_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    version VARCHAR(50) NOT NULL,
    app_icon VARCHAR(255),
    screenshots TEXT[],
    download_url TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    tags TEXT[],
    requirements JSONB,
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TAUBROWSER SCHEMA (Browser)
-- =====================================================

-- Browser bookmarks table
CREATE TABLE browser_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    favicon VARCHAR(255),
    folder_id UUID REFERENCES browser_bookmarks(id),
    is_folder BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Browser history table
CREATE TABLE browser_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    favicon VARCHAR(255),
    visit_count INTEGER DEFAULT 1,
    last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TAUAI SCHEMA (AI Platform)
-- =====================================================

-- AI models table
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    model_type VARCHAR(100) NOT NULL, -- text, image, audio, etc.
    provider VARCHAR(100) NOT NULL, -- openai, anthropic, local, etc.
    model_id VARCHAR(255) NOT NULL,
    capabilities JSONB,
    pricing JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversations table
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id UUID REFERENCES ai_models(id),
    title VARCHAR(255),
    context JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DEVELOPER PORTAL SCHEMA
-- =====================================================

-- Projects table (enhanced)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    repository_url VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    project_type VARCHAR(50) DEFAULT 'web', -- web, mobile, desktop, api
    framework VARCHAR(50), -- react, vue, angular, etc.
    language VARCHAR(50), -- javascript, python, etc.
    status VARCHAR(50) DEFAULT 'active', -- active, archived, deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project collaborators table
CREATE TABLE project_collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- owner, admin, developer, viewer
    permissions JSONB,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Files table (enhanced)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    content TEXT,
    file_type VARCHAR(100),
    size_bytes INTEGER DEFAULT 0,
    is_binary BOOLEAN DEFAULT FALSE,
    encoding VARCHAR(50) DEFAULT 'utf8',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Git repositories table
CREATE TABLE git_repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    repository_url VARCHAR(500) NOT NULL,
    branch VARCHAR(255) DEFAULT 'main',
    is_private BOOLEAN DEFAULT TRUE,
    last_commit_hash VARCHAR(255),
    last_commit_message TEXT,
    last_commit_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CI/CD pipelines table
CREATE TABLE pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pipeline_config JSONB NOT NULL,
    trigger_type VARCHAR(50) DEFAULT 'manual', -- manual, webhook, schedule
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pipeline runs table
CREATE TABLE pipeline_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- pending, running, success, failed, cancelled
    trigger_type VARCHAR(50) NOT NULL,
    trigger_data JSONB,
    logs TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    error_message TEXT
);

-- =====================================================
-- API & INTEGRATION SCHEMA
-- =====================================================

-- API keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    permissions JSONB,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- info, warning, error, success
    app_name VARCHAR(50), -- taumail, taucloud, etc.
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Core indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_user_id ON login_attempts(user_id);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);

-- Email indexes
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_emails_sender_id ON emails(sender_id);
CREATE INDEX idx_emails_recipient_id ON emails(recipient_id);
CREATE INDEX idx_emails_to_email ON emails(to_email);
CREATE INDEX idx_emails_folder ON emails(folder);
CREATE INDEX idx_emails_created_at ON emails(created_at);
CREATE INDEX idx_email_attachments_email_id ON email_attachments(email_id);

-- Cloud storage indexes
CREATE INDEX idx_cloud_folders_user_id ON cloud_folders(user_id);
CREATE INDEX idx_cloud_folders_parent_folder_id ON cloud_folders(parent_folder_id);
CREATE INDEX idx_cloud_files_user_id ON cloud_files(user_id);
CREATE INDEX idx_cloud_files_folder_id ON cloud_files(folder_id);

-- Store indexes
CREATE INDEX idx_store_apps_developer_id ON store_apps(developer_id);
CREATE INDEX idx_store_apps_category_id ON store_apps(category_id);
CREATE INDEX idx_store_apps_is_active ON store_apps(is_active);

-- Browser indexes
CREATE INDEX idx_browser_bookmarks_user_id ON browser_bookmarks(user_id);
CREATE INDEX idx_browser_history_user_id ON browser_history(user_id);

-- AI indexes
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_model_id ON ai_conversations(model_id);

-- Developer portal indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_project_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX idx_project_collaborators_user_id ON project_collaborators(user_id);
CREATE INDEX idx_files_project_id ON files(project_id);
CREATE INDEX idx_git_repositories_project_id ON git_repositories(project_id);
CREATE INDEX idx_pipelines_project_id ON pipelines(project_id);
CREATE INDEX idx_pipeline_runs_pipeline_id ON pipeline_runs(pipeline_id);

-- API indexes
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cloud_folders_updated_at BEFORE UPDATE ON cloud_folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cloud_files_updated_at BEFORE UPDATE ON cloud_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_store_apps_updated_at BEFORE UPDATE ON store_apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_browser_bookmarks_updated_at BEFORE UPDATE ON browser_bookmarks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_git_repositories_updated_at BEFORE UPDATE ON git_repositories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON pipelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default user preferences
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default preferences for all apps
    INSERT INTO user_preferences (user_id, preference_key, preference_value, app_name) VALUES
    (NEW.id, 'theme', '{"mode": "light", "primary": "#3b82f6"}', 'global'),
    (NEW.id, 'language', '{"code": "en", "name": "English"}', 'global'),
    (NEW.id, 'notifications', '{"email": true, "push": true, "sms": false}', 'global'),
    (NEW.id, 'privacy', '{"data_collection": false, "analytics": false, "marketing": false}', 'global'),
    (NEW.id, 'email_signature', '{"text": "", "html": ""}', 'taumail'),
    (NEW.id, 'email_auto_reply', '{"enabled": false, "message": ""}', 'taumail'),
    (NEW.id, 'cloud_sync', '{"enabled": true, "frequency": "realtime"}', 'taucloud'),
    (NEW.id, 'browser_default_search', '{"engine": "tauos", "url": "https://search.tauos.org"}', 'taubrowser');
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default preferences
CREATE TRIGGER create_default_user_preferences_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_preferences();

-- Function to clean up old sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '24 hours';
    DELETE FROM security_events WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ language 'plpgsql';

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS check_email_quota(UUID);

-- Function to check email quota
CREATE OR REPLACE FUNCTION check_email_quota(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_quota INTEGER;
    user_used INTEGER;
    org_quota INTEGER;
    org_used INTEGER;
BEGIN
    -- Get user's daily quota and usage
    SELECT email_quota_used INTO user_used FROM users WHERE id = user_id_param;
    
    -- Get organization quota
    SELECT o.email_quota_daily INTO org_quota 
    FROM organizations o 
    JOIN users u ON u.organization_id = o.id 
    WHERE u.id = user_id_param;
    
    -- Check if user is within quota
    RETURN user_used < org_quota;
END;
$$ language 'plpgsql';

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Create default organization
INSERT INTO organizations (id, name, domain, plan, max_users, storage_quota_bytes, email_quota_daily) VALUES
('00000000-0000-0000-0000-000000000001', 'TauOS Foundation', 'tauos.org', 'enterprise', 1000000, 1099511627776, 10000);

-- Create default store categories
INSERT INTO store_categories (name, description, icon) VALUES
('Productivity', 'Apps to boost your productivity', 'briefcase'),
('Development', 'Tools for developers', 'code'),
('Communication', 'Messaging and communication apps', 'message-circle'),
('Entertainment', 'Games and entertainment', 'gamepad2'),
('Utilities', 'System utilities and tools', 'settings'),
('Education', 'Learning and educational apps', 'book-open');

-- Create default AI models
INSERT INTO ai_models (name, description, model_type, provider, model_id, capabilities) VALUES
('TauGPT-4', 'TauOS AI Assistant', 'text', 'tauos', 'taugpt-4', '{"text_generation": true, "code_assistance": true, "translation": true}'),
('TauVision', 'Image analysis and generation', 'image', 'tauos', 'tauvision-1', '{"image_analysis": true, "image_generation": true, "object_detection": true}'),
('TauVoice', 'Speech recognition and synthesis', 'audio', 'tauos', 'tauvoice-1', '{"speech_to_text": true, "text_to_speech": true, "voice_cloning": true}');

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Schema creation complete
SELECT 'TauCore™ Hybrid Database Schema created successfully!' as status;
