-- TauMail Complete Database Fix
-- Run this in your Supabase SQL Editor to fix all TauMail issues
-- This will work with existing database and add missing columns/tables

-- 1. First, let's check what we currently have
SELECT 'Current Database Structure:' as info;
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check if users table exists and what the id column type is
SELECT 'Users table id column type:' as info;
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'id';

-- 2. Add missing columns to users table if they don't exist
DO $$ 
BEGIN
    -- Add full_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'full_name') THEN
        ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
    END IF;
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
    
    -- Add last_login column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'last_login') THEN
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- 3. Create sent_emails table if it doesn't exist
CREATE TABLE IF NOT EXISTS sent_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,  -- References users.id (UUID)
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    message_id VARCHAR(255),
    smtp_status VARCHAR(100),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create incoming_emails table if it doesn't exist
CREATE TABLE IF NOT EXISTS incoming_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,  -- References users.id (UUID)
    from_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    message_id VARCHAR(255),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create drafts table if it doesn't exist
CREATE TABLE IF NOT EXISTS drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,  -- References users.id (UUID)
    to_email VARCHAR(255) NOT NULL,
    cc_email VARCHAR(255),
    bcc_email VARCHAR(255),
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create trash_emails table if it doesn't exist
CREATE TABLE IF NOT EXISTS trash_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,  -- References users.id (UUID)
    original_table VARCHAR(50) NOT NULL, -- 'sent_emails' or 'incoming_emails'
    original_id UUID NOT NULL,
    from_email VARCHAR(255),
    to_email VARCHAR(255),
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_user_id ON incoming_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_received_at ON incoming_emails(received_at);
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_last_modified ON drafts(last_modified);
CREATE INDEX IF NOT EXISTS idx_trash_emails_user_id ON trash_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_trash_emails_deleted_at ON trash_emails(deleted_at);

-- 8. Create the test user saleena@tauos.org if it doesn't exist
INSERT INTO users (username, email, password_hash, full_name, is_active) 
VALUES (
    'saleena', 
    'saleena@tauos.org', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', -- password: Saleena@132
    'Saleena User',
    TRUE
) ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- 9. Create additional test users for testing
INSERT INTO users (username, email, password_hash, full_name, is_active) 
VALUES 
    ('testuser1', 'test1@tauos.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', 'Test User 1', TRUE),
    ('testuser2', 'test2@tauos.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', 'Test User 2', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 10. Insert some sample emails for testing (only if user exists)
INSERT INTO incoming_emails (user_id, from_email, subject, body, message_id, is_read)
SELECT 
    CASE 
        WHEN u.id::text ~ '^[0-9]+$' THEN u.id::text::UUID
        ELSE u.id::UUID
    END,
    'noreply@example.com',
    'Welcome to TauMail!',
    'This is a test email to verify your TauMail setup is working correctly.',
    'msg-' || gen_random_uuid()::text,
    FALSE
FROM users u 
WHERE u.email = 'saleena@tauos.org'
AND EXISTS (SELECT 1 FROM users WHERE email = 'saleena@tauos.org')
ON CONFLICT DO NOTHING;

INSERT INTO incoming_emails (user_id, from_email, subject, body, message_id, is_read)
SELECT 
    CASE 
        WHEN u.id::text ~ '^[0-9]+$' THEN u.id::text::UUID
        ELSE u.id::UUID
    END,
    'support@tauos.org',
    'TauCore System Update',
    'Your TauCore system has been updated with the latest security patches.',
    'msg-' || gen_random_uuid()::text,
    FALSE
FROM users u 
WHERE u.email = 'saleena@tauos.org'
AND EXISTS (SELECT 1 FROM users WHERE email = 'saleena@tauos.org')
ON CONFLICT DO NOTHING;

-- 11. Verify the final database structure
SELECT 'Final Database Structure:' as info;
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'sent_emails', 'incoming_emails', 'drafts', 'trash_emails')
ORDER BY table_name, ordinal_position;

-- 12. Show all users
SELECT 'Users in database:' as info;
SELECT id, username, email, full_name, is_active, created_at, last_login
FROM users
ORDER BY created_at;

-- 13. Show sample emails
SELECT 'Sample emails:' as info;
SELECT 
    ie.id,
    u.email as user_email,
    ie.from_email,
    ie.subject,
    ie.received_at,
    ie.is_read
FROM incoming_emails ie
JOIN users u ON ie.user_id::text = u.id::text
ORDER BY ie.received_at DESC
LIMIT 5;

-- 14. Final verification message
SELECT 'TauMail database setup completed successfully!' as status;
