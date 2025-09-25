-- Fix incoming_emails table schema to handle null values properly
-- This script ensures all required fields have proper defaults

-- First, let's check the current schema
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'incoming_emails' 
ORDER BY ordinal_position;

-- Update the table to allow nulls where appropriate and set defaults
ALTER TABLE incoming_emails 
ALTER COLUMN body_text SET DEFAULT 'No text content',
ALTER COLUMN body_html SET DEFAULT '<p>No HTML content</p>',
ALTER COLUMN sender_name SET DEFAULT 'Unknown Sender',
ALTER COLUMN subject SET DEFAULT 'No Subject',
ALTER COLUMN from_email SET DEFAULT 'unknown@example.com';

-- If the columns don't exist, create them with proper defaults
DO $$
BEGIN
    -- Add body_text column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'body_text') THEN
        ALTER TABLE incoming_emails ADD COLUMN body_text TEXT DEFAULT 'No text content';
    END IF;
    
    -- Add body_html column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'body_html') THEN
        ALTER TABLE incoming_emails ADD COLUMN body_html TEXT DEFAULT '<p>No HTML content</p>';
    END IF;
    
    -- Add sender_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'sender_name') THEN
        ALTER TABLE incoming_emails ADD COLUMN sender_name TEXT DEFAULT 'Unknown Sender';
    END IF;
    
    -- Add subject column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'subject') THEN
        ALTER TABLE incoming_emails ADD COLUMN subject TEXT DEFAULT 'No Subject';
    END IF;
    
    -- Add from_email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'from_email') THEN
        ALTER TABLE incoming_emails ADD COLUMN from_email TEXT DEFAULT 'unknown@example.com';
    END IF;
    
    -- Add headers column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'headers') THEN
        ALTER TABLE incoming_emails ADD COLUMN headers JSONB DEFAULT '{}';
    END IF;
    
    -- Add attachments column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'attachments') THEN
        ALTER TABLE incoming_emails ADD COLUMN attachments JSONB DEFAULT '[]';
    END IF;
    
    -- Add is_spam column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'is_spam') THEN
        ALTER TABLE incoming_emails ADD COLUMN is_spam BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add received_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incoming_emails' AND column_name = 'received_at') THEN
        ALTER TABLE incoming_emails ADD COLUMN received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Now make the columns nullable where appropriate
ALTER TABLE incoming_emails 
ALTER COLUMN body_text DROP NOT NULL,
ALTER COLUMN body_html DROP NOT NULL,
ALTER COLUMN sender_name DROP NOT NULL,
ALTER COLUMN subject DROP NOT NULL,
ALTER COLUMN from_email DROP NOT NULL,
ALTER COLUMN headers DROP NOT NULL,
ALTER COLUMN attachments DROP NOT NULL;

-- Verify the final schema
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'incoming_emails' 
ORDER BY ordinal_position;

-- Test insert to verify it works
INSERT INTO incoming_emails (user_id, from_email, subject, body_text, body_html) 
VALUES (
    (SELECT id FROM users WHERE email = 'saleena@tauos.org' LIMIT 1),
    'test@example.com',
    'Test Email',
    'Test body text',
    '<p>Test HTML body</p>'
);

-- Clean up test data
DELETE FROM incoming_emails WHERE from_email = 'test@example.com';

SELECT 'Incoming emails schema fixed successfully!' as status;
