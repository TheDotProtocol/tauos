-- Fix sent_emails table by adding missing user_id column
ALTER TABLE sent_emails ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);

-- Also add sent_at column if it doesn't exist
ALTER TABLE sent_emails ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP DEFAULT NOW();

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sent_emails' 
ORDER BY ordinal_position;
