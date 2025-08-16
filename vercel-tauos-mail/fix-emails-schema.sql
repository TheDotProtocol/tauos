-- Fix TauMail Emails Table Schema
-- Run this in Supabase SQL Editor

-- Add message_id column to emails table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'emails' 
        AND column_name = 'message_id'
    ) THEN
        ALTER TABLE emails ADD COLUMN message_id VARCHAR(255);
        RAISE NOTICE 'Added message_id column to emails table';
    ELSE
        RAISE NOTICE 'message_id column already exists in emails table';
    END IF;
END $$;

-- Verify the emails table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'emails' 
ORDER BY ordinal_position;

-- Check if there are any emails in the table
SELECT COUNT(*) as total_emails FROM emails;

-- Check if the TauOS organization exists
SELECT id, name, domain FROM organizations WHERE domain = 'tauos.org';

-- Check if there are any users
SELECT COUNT(*) as total_users FROM users; 