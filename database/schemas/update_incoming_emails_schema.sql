-- Update incoming_emails table to support SendGrid webhook data
-- This adds the necessary columns for proper email handling

-- Add new columns if they don't exist
ALTER TABLE incoming_emails 
ADD COLUMN IF NOT EXISTS sender_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS body_text TEXT,
ADD COLUMN IF NOT EXISTS body_html TEXT,
ADD COLUMN IF NOT EXISTS headers JSONB,
ADD COLUMN IF NOT EXISTS attachments JSONB;

-- Update existing records to have default values
UPDATE incoming_emails 
SET 
  sender_name = COALESCE(sender_name, sender_email),
  body_text = COALESCE(body_text, ''),
  body_html = COALESCE(body_html, ''),
  headers = COALESCE(headers, '{}'),
  attachments = COALESCE(attachments, '[]')
WHERE 
  sender_name IS NULL OR 
  body_text IS NULL OR 
  body_html IS NULL OR 
  headers IS NULL OR 
  attachments IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_incoming_emails_sender_email ON incoming_emails(sender_email);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_received_at ON incoming_emails(received_at);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_is_spam ON incoming_emails(is_spam);

-- Verify the schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'incoming_emails' 
ORDER BY ordinal_position;
