-- TauOS Mail Database Setup
-- Run this in Supabase SQL Editor

-- Create sent_emails table
CREATE TABLE IF NOT EXISTS sent_emails (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_to_email ON incoming_emails(to_email);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_received_at ON incoming_emails(received_at);

-- Add foreign key constraint (optional, for data integrity)
-- ALTER TABLE sent_emails ADD CONSTRAINT fk_sent_emails_user_id FOREIGN KEY (user_id) REFERENCES users(id);

-- Insert some sample data for testing (optional)
-- INSERT INTO sent_emails (user_id, to_email, subject, content, message_id, provider) 
-- VALUES ('d20c4746-30ca-4f57-81d1-6af839c5bc25', 'test@example.com', 'Test Email', 'This is a test email from TauOS Mail', 'test-123', 'SendGrid');

-- INSERT INTO incoming_emails (from_email, to_email, subject, content, message_id, provider)
-- VALUES ('welcome@tauos.org', 'saleena@tauos.org', 'Welcome to TauOS Mail!', 'Thank you for joining TauOS Mail. Your privacy-first email experience starts now.', 'welcome-123', 'webhook');

-- Verify tables were created
SELECT 'sent_emails table created successfully' as status;
SELECT 'incoming_emails table created successfully' as status;
