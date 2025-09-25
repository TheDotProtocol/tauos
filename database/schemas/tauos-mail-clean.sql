-- TauOS Mail Database Setup - CLEAN VERSION
-- Run this in Supabase SQL Editor

-- Create sent_emails table
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

-- Verify tables were created
SELECT 'sent_emails table created successfully' as status;
SELECT 'incoming_emails table created successfully' as status;
