-- Check the structure of sent_emails table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sent_emails' 
ORDER BY ordinal_position;

-- Check the structure of incoming_emails table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'incoming_emails' 
ORDER BY ordinal_position;
