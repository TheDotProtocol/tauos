-- TauOS Mail Working Database Setup
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what's in the users table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public';

-- 2. Create sent_emails table (using INTEGER for user_id to match users.id)
CREATE TABLE IF NOT EXISTS sent_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id INTEGER NOT NULL,  -- This will reference users.id (SERIAL)
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    message_id VARCHAR(255),
    smtp_status VARCHAR(100),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create incoming_emails table
CREATE TABLE IF NOT EXISTS incoming_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id INTEGER NOT NULL,  -- This will reference users.id (SERIAL)
    from_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    message_id VARCHAR(255),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create drafts table
CREATE TABLE IF NOT EXISTS drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id INTEGER NOT NULL,  -- This will reference users.id (SERIAL)
    to_email VARCHAR(255) NOT NULL,
    cc_email VARCHAR(255),
    bcc_email VARCHAR(255),
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create trash_emails table
CREATE TABLE IF NOT EXISTS trash_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id INTEGER NOT NULL,  -- This will reference users.id (SERIAL)
    original_table VARCHAR(50) NOT NULL,
    original_id UUID NOT NULL,
    from_email VARCHAR(255),
    to_email VARCHAR(255),
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_user_id ON incoming_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_received_at ON incoming_emails(received_at);
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_last_modified ON drafts(last_modified);
CREATE INDEX IF NOT EXISTS idx_trash_emails_user_id ON trash_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_trash_emails_deleted_at ON trash_emails(deleted_at);

-- 7. Insert a test user (optional)
INSERT INTO users (username, email, password_hash, full_name) 
VALUES (
    'testuser', 
    'testuser@tauos.org', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', -- password: testpass123
    'Test User'
) ON CONFLICT (email) DO NOTHING;

-- 8. Verify all tables were created
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'sent_emails', 'incoming_emails', 'drafts', 'trash_emails')
ORDER BY table_name, ordinal_position;
