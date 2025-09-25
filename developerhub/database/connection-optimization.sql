-- TauCore™ Database Connection Optimization
-- Production-ready database configuration for high performance

-- =====================================================
-- CONNECTION POOLING CONFIGURATION
-- =====================================================

-- Set optimal connection pool settings (commented out - requires superuser privileges)
-- ALTER SYSTEM SET max_connections = 200;
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';
-- ALTER SYSTEM SET checkpoint_completion_target = 0.9;
-- ALTER SYSTEM SET wal_buffers = '16MB';
-- ALTER SYSTEM SET default_statistics_target = 100;

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- =====================================================

-- Enable query optimization (commented out - requires superuser privileges)
-- ALTER SYSTEM SET random_page_cost = 1.1;
-- ALTER SYSTEM SET effective_io_concurrency = 200;
-- ALTER SYSTEM SET work_mem = '4MB';
-- ALTER SYSTEM SET hash_mem_multiplier = 1.0;

-- =====================================================
-- INDEXING OPTIMIZATION
-- =====================================================

-- Create composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_emails_user_folder_created 
ON emails(user_id, folder, created_at DESC);

CREATE INDEX CONCURRENTLY idx_emails_sender_recipient_created 
ON emails(sender_id, recipient_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_cloud_files_user_folder_created 
ON cloud_files(user_id, folder_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_projects_user_status_created 
ON projects(user_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY idx_pipeline_runs_pipeline_status_created 
ON pipeline_runs(pipeline_id, status, created_at DESC);

-- =====================================================
-- PARTITIONING FOR LARGE TABLES
-- =====================================================

-- Partition emails table by date for better performance
CREATE TABLE emails_2024 PARTITION OF emails
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE emails_2025 PARTITION OF emails
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Partition security_events table by date
CREATE TABLE security_events_2024 PARTITION OF security_events
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE security_events_2025 PARTITION OF security_events
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- =====================================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- =====================================================

-- User activity summary
CREATE MATERIALIZED VIEW user_activity_summary AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    COUNT(DISTINCT e.id) as email_count,
    COUNT(DISTINCT cf.id) as file_count,
    COUNT(DISTINCT p.id) as project_count,
    MAX(e.created_at) as last_email_at,
    MAX(cf.created_at) as last_file_at,
    MAX(p.created_at) as last_project_at
FROM users u
LEFT JOIN emails e ON u.id = e.user_id
LEFT JOIN cloud_files cf ON u.id = cf.user_id
LEFT JOIN projects p ON u.id = p.user_id
GROUP BY u.id, u.username, u.email;

-- Organization usage summary
CREATE MATERIALIZED VIEW organization_usage_summary AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT e.id) as email_count,
    COUNT(DISTINCT cf.id) as file_count,
    SUM(cf.file_size) as total_storage_used,
    SUM(u.email_quota_used) as total_email_used
FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id
LEFT JOIN emails e ON u.id = e.user_id
LEFT JOIN cloud_files cf ON u.id = cf.user_id
GROUP BY o.id, o.name;

-- =====================================================
-- FUNCTIONS FOR PERFORMANCE
-- =====================================================

-- Function to get user dashboard data efficiently
CREATE OR REPLACE FUNCTION get_user_dashboard_data(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'user', (SELECT row_to_json(u) FROM users u WHERE u.id = user_id_param),
        'recent_emails', (SELECT json_agg(row_to_json(e)) FROM (
            SELECT * FROM emails 
            WHERE user_id = user_id_param 
            ORDER BY created_at DESC 
            LIMIT 10
        ) e),
        'recent_files', (SELECT json_agg(row_to_json(cf)) FROM (
            SELECT * FROM cloud_files 
            WHERE user_id = user_id_param 
            ORDER BY created_at DESC 
            LIMIT 10
        ) cf),
        'recent_projects', (SELECT json_agg(row_to_json(p)) FROM (
            SELECT * FROM projects 
            WHERE user_id = user_id_param 
            ORDER BY created_at DESC 
            LIMIT 5
        ) p),
        'notifications', (SELECT json_agg(row_to_json(n)) FROM (
            SELECT * FROM notifications 
            WHERE user_id = user_id_param 
            AND is_read = FALSE 
            ORDER BY created_at DESC 
            LIMIT 10
        ) n)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get organization analytics
CREATE OR REPLACE FUNCTION get_organization_analytics(org_id_param UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'organization', (SELECT row_to_json(o) FROM organizations o WHERE o.id = org_id_param),
        'user_count', (SELECT COUNT(*) FROM users WHERE organization_id = org_id_param),
        'storage_used', (SELECT SUM(storage_used_bytes) FROM users WHERE organization_id = org_id_param),
        'email_quota_used', (SELECT SUM(email_quota_used) FROM users WHERE organization_id = org_id_param),
        'active_users', (SELECT COUNT(*) FROM users WHERE organization_id = org_id_param AND last_login_at > NOW() - INTERVAL '7 days'),
        'recent_activity', (SELECT json_agg(row_to_json(activity)) FROM (
            SELECT 'email' as type, created_at, 'New email' as description
            FROM emails 
            WHERE user_id IN (SELECT id FROM users WHERE organization_id = org_id_param)
            UNION ALL
            SELECT 'file' as type, created_at, 'New file uploaded' as description
            FROM cloud_files 
            WHERE user_id IN (SELECT id FROM users WHERE organization_id = org_id_param)
            ORDER BY created_at DESC 
            LIMIT 20
        ) activity)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CLEANUP FUNCTIONS
-- =====================================================

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Clean up expired sessions
    DELETE FROM user_sessions WHERE expires_at < NOW();
    
    -- Clean up old login attempts
    DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '24 hours';
    
    -- Clean up old security events
    DELETE FROM security_events WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Clean up old notifications
    DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '30 days' AND is_read = TRUE;
    
    -- Clean up old browser history
    DELETE FROM browser_history WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Clean up old pipeline runs
    DELETE FROM pipeline_runs WHERE created_at < NOW() - INTERVAL '30 days' AND status IN ('success', 'failed');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MONITORING FUNCTIONS
-- =====================================================

-- Function to get database performance metrics
CREATE OR REPLACE FUNCTION get_database_metrics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM users),
        'total_emails', (SELECT COUNT(*) FROM emails),
        'total_files', (SELECT COUNT(*) FROM cloud_files),
        'total_projects', (SELECT COUNT(*) FROM projects),
        'active_sessions', (SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()),
        'database_size', (SELECT pg_size_pretty(pg_database_size(current_database()))),
        'table_sizes', (SELECT json_agg(row_to_json(t)) FROM (
            SELECT 
                schemaname,
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
        ) t)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECURITY FUNCTIONS
-- =====================================================

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permissions(user_id_param UUID, resource_type VARCHAR, resource_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN := FALSE;
BEGIN
    -- Check if user exists and is active
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id_param AND is_active = TRUE) THEN
        RETURN FALSE;
    END IF;
    
    -- Check resource-specific permissions
    CASE resource_type
        WHEN 'email' THEN
            SELECT EXISTS (
                SELECT 1 FROM emails 
                WHERE id = resource_id 
                AND (user_id = user_id_param OR sender_id = user_id_param)
            ) INTO has_permission;
            
        WHEN 'file' THEN
            SELECT EXISTS (
                SELECT 1 FROM cloud_files 
                WHERE id = resource_id 
                AND user_id = user_id_param
            ) INTO has_permission;
            
        WHEN 'project' THEN
            SELECT EXISTS (
                SELECT 1 FROM projects p
                LEFT JOIN project_collaborators pc ON p.id = pc.project_id
                WHERE p.id = resource_id 
                AND (p.user_id = user_id_param OR pc.user_id = user_id_param)
            ) INTO has_permission;
            
        ELSE
            has_permission := FALSE;
    END CASE;
    
    RETURN has_permission;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SCHEDULED TASKS
-- =====================================================

-- Create a function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_activity_summary;
    REFRESH MATERIALIZED VIEW organization_usage_summary;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CONNECTION POOLING SETUP
-- =====================================================

-- Create connection pool configuration (commented out - requires superuser privileges)
CREATE OR REPLACE FUNCTION setup_connection_pooling()
RETURNS void AS $$
BEGIN
    -- Note: These settings require superuser privileges
    -- Uncomment and run as superuser if needed:
    
    -- Set connection limits
    -- ALTER SYSTEM SET max_connections = 200;
    -- ALTER SYSTEM SET shared_buffers = '256MB';
    -- ALTER SYSTEM SET effective_cache_size = '1GB';
    
    -- Optimize for read-heavy workloads
    -- ALTER SYSTEM SET random_page_cost = 1.1;
    -- ALTER SYSTEM SET effective_io_concurrency = 200;
    
    -- Optimize for write-heavy workloads
    -- ALTER SYSTEM SET wal_buffers = '16MB';
    -- ALTER SYSTEM SET checkpoint_completion_target = 0.9;
    
    -- Optimize for mixed workloads
    -- ALTER SYSTEM SET work_mem = '4MB';
    -- ALTER SYSTEM SET maintenance_work_mem = '64MB';
    
    -- Reload configuration
    -- PERFORM pg_reload_conf();
    
    RAISE NOTICE 'Connection pooling setup completed (settings require superuser privileges)';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- OPTIMIZATION COMPLETE
-- =====================================================

-- Run optimization setup
SELECT setup_connection_pooling();

-- Create initial materialized views
REFRESH MATERIALIZED VIEW user_activity_summary;
REFRESH MATERIALIZED VIEW organization_usage_summary;

-- Run initial cleanup
SELECT cleanup_old_data();

-- Database optimization complete
SELECT 'TauCore™ Database Connection Optimization completed successfully!' as status;
