-- Add Sent Emails Table for TauMail
-- Run this in Supabase SQL Editor

-- Create sent_emails table to track all sent emails
CREATE TABLE IF NOT EXISTS sent_emails (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
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
CREATE INDEX IF NOT EXISTS idx_sent_emails_organization_id ON sent_emails(organization_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sender_id ON sent_emails(sender_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_created_at ON sent_emails(created_at);

-- Add trigger for updated_at column
CREATE TRIGGER update_sent_emails_updated_at BEFORE UPDATE ON sent_emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'sent_emails' 
ORDER BY ordinal_position; 