-- Fix database schema for TauOS Mail
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (to recreate with correct schema)
DROP TABLE IF EXISTS incoming_emails CASCADE;
DROP TABLE IF EXISTS sent_emails CASCADE;

-- Create sent_emails table with correct schema
CREATE TABLE sent_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    message_id VARCHAR(255),
    smtp_status VARCHAR(100),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create incoming_emails table with correct schema
CREATE TABLE incoming_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    message_id VARCHAR(255),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX idx_sent_emails_sent_at ON sent_emails(sent_at);
CREATE INDEX idx_incoming_emails_user_id ON incoming_emails(user_id);
CREATE INDEX idx_incoming_emails_received_at ON incoming_emails(received_at);

-- Verify tables were created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('sent_emails', 'incoming_emails')
ORDER BY table_name, ordinal_position;
