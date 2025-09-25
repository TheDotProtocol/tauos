-- Add message_id column to sent_emails table for tracking SMTP message IDs
-- This helps with email delivery tracking and debugging

-- Add message_id column if it doesn't exist
ALTER TABLE sent_emails 
ADD COLUMN IF NOT EXISTS message_id TEXT;

-- Add index for better performance when searching by message_id
CREATE INDEX IF NOT EXISTS idx_sent_emails_message_id ON sent_emails(message_id);

-- Update existing records to have a placeholder message_id
UPDATE sent_emails 
SET message_id = 'legacy-' || id::text 
WHERE message_id IS NULL;

-- Make message_id NOT NULL after updating existing records
ALTER TABLE sent_emails 
ALTER COLUMN message_id SET NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sent_emails' 
ORDER BY ordinal_position;
