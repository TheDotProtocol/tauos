-- Function to check storage limits
CREATE OR REPLACE FUNCTION check_storage_limit(
    p_organization_id UUID,
    p_user_id UUID,
    p_file_size BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
    org_storage_limit BIGINT;
    org_storage_used BIGINT;
    user_storage_limit BIGINT;
    user_storage_used BIGINT;
BEGIN
    -- Get organization storage info
    SELECT storage_limit, storage_used INTO org_storage_limit, org_storage_used
    FROM organizations WHERE id = p_organization_id;
    
    -- Get user storage info
    SELECT storage_limit, storage_used INTO user_storage_limit, user_storage_used
    FROM users WHERE id = p_user_id;
    
    -- Check if upload would exceed limits
    IF (org_storage_used + p_file_size > org_storage_limit) OR
       (user_storage_used + p_file_size > user_storage_limit) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to update storage usage
CREATE OR REPLACE FUNCTION update_storage_usage(
    p_organization_id UUID,
    p_user_id UUID,
    p_bytes_change BIGINT
)
RETURNS VOID AS $$
BEGIN
    -- Update organization storage
    UPDATE organizations 
    SET storage_used = storage_used + p_bytes_change
    WHERE id = p_organization_id;
    
    -- Update user storage
    UPDATE users 
    SET storage_used = storage_used + p_bytes_change
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user storage stats
CREATE OR REPLACE FUNCTION get_user_storage_stats(p_user_id UUID)
RETURNS TABLE(
    user_storage_used BIGINT,
    user_storage_limit BIGINT,
    user_storage_percentage NUMERIC,
    org_storage_used BIGINT,
    org_storage_limit BIGINT,
    org_storage_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.storage_used,
        u.storage_limit,
        ROUND((u.storage_used::NUMERIC / u.storage_limit::NUMERIC) * 100, 2),
        o.storage_used,
        o.storage_limit,
        ROUND((o.storage_used::NUMERIC / o.storage_limit::NUMERIC) * 100, 2)
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to validate domain
CREATE OR REPLACE FUNCTION validate_domain(p_domain VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    -- Basic domain validation
    IF p_domain ~ '^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' THEN
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
