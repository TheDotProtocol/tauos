-- Fix user passwords for TauMail
-- This script updates the password hashes for existing users

-- Update Saleena's password (Saleena@132)
UPDATE users 
SET password_hash = '$2b$10$wj10Arl4GN66gnO4t/OVme6nuXTCOExI0A1EvNxf/stidLtPF8Gdy' 
WHERE email = 'saleena@tauos.org';

-- Update Senthil's password (Senthil@132)  
UPDATE users 
SET password_hash = '$2b$10$XXpGJRHyxvXkUQ5LWhTqL.u2cOoTeeoiBNq1bmyKi5kNnY8vPZFjS' 
WHERE email = 'senthil@tauos.org';

-- Verify the updates
SELECT id, username, email, full_name, is_active, created_at 
FROM users 
WHERE email IN ('saleena@tauos.org', 'senthil@tauos.org');

-- Test password verification (this will show if the hashes work)
SELECT 
    email,
    CASE 
        WHEN password_hash IS NOT NULL THEN 'Password hash exists'
        ELSE 'No password hash'
    END as password_status
FROM users 
WHERE email IN ('saleena@tauos.org', 'senthil@tauos.org');
