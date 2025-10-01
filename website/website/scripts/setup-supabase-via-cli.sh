#!/bin/bash

echo "🗄️ Setting up Supabase Database via CLI..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    brew install supabase/tap/supabase
fi

echo "✅ Supabase CLI installed"

# Initialize Supabase project if not already done
if [ ! -f "supabase/config.toml" ]; then
    echo "🔧 Initializing Supabase project..."
    supabase init
fi

# Create migrations directory
mkdir -p supabase/migrations

# Create the initial migration
echo "📝 Creating database migration..."

cat > supabase/migrations/001_initial_schema.sql << 'EOF'
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table (multi-tenant)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    subdomain VARCHAR(255) UNIQUE,
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#667eea',
    secondary_color VARCHAR(7) DEFAULT '#764ba2',
    storage_limit BIGINT DEFAULT 5368709120, -- 5GB free
    storage_used BIGINT DEFAULT 0,
    plan_type VARCHAR(20) DEFAULT 'free', -- free, basic, pro, enterprise
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (multi-tenant)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    recovery_email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user', -- user, admin, owner
    storage_limit BIGINT DEFAULT 5368709120, -- 5GB free
    storage_used BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, username),
    UNIQUE(organization_id, email)
);

-- Domains table for custom domain management
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    verification_token VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    ssl_certificate TEXT,
    dns_records JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emails table (TauMail)
CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    html_body TEXT,
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    labels TEXT[] DEFAULT '{}',
    thread_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email attachments
CREATE TABLE IF NOT EXISTS email_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Files table (TauCloud)
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
    parent_folder_id UUID,
    is_folder BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    public_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    parent_folder_id UUID,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table for billing
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_type VARCHAR(20) NOT NULL, -- basic, pro, enterprise
    status VARCHAR(20) DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage tracking
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- upload, download, email_sent, etc.
    resource_type VARCHAR(50), -- file, email, etc.
    resource_id UUID,
    bytes_used BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_emails_organization_id ON emails(organization_id);
CREATE INDEX IF NOT EXISTS idx_emails_sender_id ON emails(sender_id);
CREATE INDEX IF NOT EXISTS idx_emails_recipient_id ON emails(recipient_id);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at);
CREATE INDEX IF NOT EXISTS idx_files_organization_id ON files(organization_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_file_type ON files(file_type);
CREATE INDEX IF NOT EXISTS idx_domains_organization_id ON domains(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_organization_id ON usage_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO organizations (name, domain, subdomain, plan_type) VALUES
('TauOS', 'tauos.org', 'tauos', 'free'),
('AR Holdings Group', 'arholdings.group', 'arholdings', 'pro')
ON CONFLICT (domain) DO NOTHING;

-- Insert sample users (password: password123)
INSERT INTO users (organization_id, username, email, password_hash, role) VALUES
((SELECT id FROM organizations WHERE domain = 'tauos.org'), 'admin', 'admin@tauos.org', crypt('password123', gen_salt('bf')), 'owner'),
((SELECT id FROM organizations WHERE domain = 'tauos.org'), 'testuser', 'testuser@tauos.org', crypt('password123', gen_salt('bf')), 'user')
ON CONFLICT (organization_id, username) DO NOTHING;
EOF

echo "✅ Migration file created"

# Create business functions migration
cat > supabase/migrations/002_business_functions.sql << 'EOF'
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
EOF

echo "✅ Business functions migration created"

# Link to your Supabase project
echo "🔗 Linking to your Supabase project..."
echo "Please run the following command to link your project:"
echo "supabase link --project-ref tviqcormikopltejomkc"
echo ""
echo "Then run:"
echo "supabase db push"
echo ""
echo "This will apply the migrations to your Supabase database."

echo ""
echo "🎉 Supabase setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Run: supabase link --project-ref tviqcormikopltejomkc"
echo "2. Run: supabase db push"
echo "3. Get your API keys from the Supabase dashboard"
echo "4. Update config/env.local with your API keys"
echo ""
echo "📚 Supabase Dashboard: https://supabase.com/dashboard/project/tviqcormikopltejomkc" 