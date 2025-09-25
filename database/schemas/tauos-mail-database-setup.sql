-- TauOS Mail Database Setup
-- Run this in Supabase SQL Editor

-- First, let's check the structure of the existing users table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Create sent_emails table (using id instead of user_id to match your users table)
CREATE TABLE IF NOT EXISTS sent_emails (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    message_id VARCHAR(255),
    provider VARCHAR(50),
    sent_at TIMESTAMP DEFAULT NOW()
);

-- Create incoming_emails table
CREATE TABLE IF NOT EXISTS incoming_emails (
    id SERIAL PRIMARY KEY,
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    content TEXT,
    html_content TEXT,
    message_id VARCHAR(255),
    provider VARCHAR(50),
    received_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_to_email ON incoming_emails(to_email);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_received_at ON incoming_emails(received_at);

-- Verify tables were created
SELECT 'sent_emails table created successfully' as status;
SELECT 'incoming_emails table created successfully' as status;
