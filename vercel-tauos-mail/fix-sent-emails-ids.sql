-- Fix Sent Emails Table ID Type
-- Run this in Supabase SQL Editor

-- First, let's see the current structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'sent_emails' 
ORDER BY ordinal_position;

-- Drop the existing sent_emails table and recreate with UUID
DROP TABLE IF EXISTS sent_emails CASCADE;

-- Recreate sent_emails table with UUID primary key
CREATE TABLE sent_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    message_id VARCHAR(255),
    smtp_status VARCHAR(50) DEFAULT 'sent',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for sent_emails table
CREATE INDEX idx_sent_emails_organization_id ON sent_emails(organization_id);
CREATE INDEX idx_sent_emails_sender_id ON sent_emails(sender_id);
CREATE INDEX idx_sent_emails_created_at ON sent_emails(created_at);

-- Add trigger for updated_at column
CREATE TRIGGER update_sent_emails_updated_at BEFORE UPDATE ON sent_emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the new structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'sent_emails' 
ORDER BY ordinal_position; 