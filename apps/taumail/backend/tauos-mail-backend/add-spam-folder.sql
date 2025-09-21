-- Add spam folder support to incoming_emails table
ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS folder VARCHAR(50) DEFAULT 'inbox';
ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS is_spam BOOLEAN DEFAULT FALSE;

-- Add spam folder support to sent_emails table
ALTER TABLE sent_emails ADD COLUMN IF NOT EXISTS folder VARCHAR(50) DEFAULT 'sent';
ALTER TABLE sent_emails ADD COLUMN IF NOT EXISTS is_spam BOOLEAN DEFAULT FALSE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_incoming_emails_folder ON incoming_emails(folder);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_is_spam ON incoming_emails(is_spam);
CREATE INDEX IF NOT EXISTS idx_sent_emails_folder ON sent_emails(folder);
CREATE INDEX IF NOT EXISTS idx_sent_emails_is_spam ON sent_emails(is_spam);

-- Update existing emails to have proper folder assignments
UPDATE incoming_emails SET folder = 'inbox' WHERE folder IS NULL;
UPDATE sent_emails SET folder = 'sent' WHERE folder IS NULL;
