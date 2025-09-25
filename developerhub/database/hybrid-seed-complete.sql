-- TauCore™ Complete Hybrid Database Seed Data - Production Ready
-- Sample data for complete TauOS ecosystem with master user

-- =====================================================
-- ORGANIZATIONS
-- =====================================================

-- Create TauOS Foundation organization
INSERT INTO organizations (id, name, domain, plan, max_users, storage_quota_bytes, email_quota_daily) VALUES
('00000000-0000-0000-0000-000000000001', 'TauOS Foundation', 'tauos.org', 'enterprise', 1000000, 1099511627776, 10000);

-- Add sample organizations
INSERT INTO organizations (id, name, domain, plan, max_users, storage_quota_bytes, email_quota_daily) VALUES
('00000000-0000-0000-0000-000000000002', 'Acme Corporation', 'acme.com', 'pro', 100, 107374182400, 1000),
('00000000-0000-0000-0000-000000000003', 'TechStart Inc', 'techstart.io', 'free', 10, 10737418240, 100);

-- =====================================================
-- USERS (Master User: saleena@tauos.org)
-- =====================================================

-- Create master user (saleena@tauos.org)
INSERT INTO users (id, organization_id, email, username, full_name, password_hash, avatar, bio, location, website, is_email_verified, is_two_factor_enabled, custom_domain, email_quota_used, storage_used_bytes, last_login_at, is_active) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'saleena@tauos.org', 'saleena', 'Saleena Falcon', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://tauos.org/avatars/saleena.jpg', 'TauOS Founder and CEO', 'San Francisco, CA', 'https://tauos.org', TRUE, TRUE, 'tauos.org', 0, 0, NOW() - INTERVAL '1 hour', TRUE);

-- Create additional sample users
INSERT INTO users (id, organization_id, email, username, full_name, password_hash, avatar, bio, location, website, is_email_verified, is_two_factor_enabled, custom_domain, email_quota_used, storage_used_bytes, last_login_at, is_active) VALUES
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'developer@tauos.org', 'developer', 'TauOS Developer', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://tauos.org/avatars/developer.jpg', 'Senior Developer at TauOS', 'San Francisco, CA', 'https://github.com/tauos', TRUE, FALSE, 'tauos.org', 5, 1048576, NOW() - INTERVAL '2 hours', TRUE),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'user@tauos.org', 'user', 'TauOS User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://tauos.org/avatars/user.jpg', 'Happy TauOS user', 'New York, NY', 'https://user.tauos.org', TRUE, FALSE, 'tauos.org', 2, 524288, NOW() - INTERVAL '1 day', TRUE),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000002', 'ceo@acme.com', 'ceo', 'John Smith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://acme.com/avatars/ceo.jpg', 'CEO of Acme Corporation', 'Los Angeles, CA', 'https://acme.com', TRUE, TRUE, 'acme.com', 10, 5242880, NOW() - INTERVAL '30 minutes', TRUE);

-- =====================================================
-- USER SESSIONS
-- =====================================================

-- Create active sessions
INSERT INTO user_sessions (user_id, session_id, ip_address, user_agent, device_info, remember_me, expires_at, last_activity_at) VALUES
('11111111-1111-1111-1111-111111111111', 'sess_saleena_123', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '{"os": "macOS", "browser": "Chrome", "device": "desktop"}', TRUE, NOW() + INTERVAL '7 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'sess_dev_456', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '{"os": "macOS", "browser": "Firefox", "device": "desktop"}', FALSE, NOW() + INTERVAL '1 day', NOW() - INTERVAL '30 minutes');

-- =====================================================
-- SMTP CONFIGURATION (Vultr + SendGrid)
-- =====================================================

-- Create SMTP server configuration
INSERT INTO smtp_servers (organization_id, name, host, port, username, use_tls, rate_limit_per_hour, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'TauOS SMTP (Vultr)', 'smtp.tauos.org', 587, 'saleena@tauos.org', TRUE, 1000, TRUE),
('00000000-0000-0000-0000-000000000001', 'TauOS SMTP (SendGrid)', 'smtp.sendgrid.net', 587, 'apikey', TRUE, 10000, TRUE);

-- Create email domain
INSERT INTO email_domains (domain, organization_id, is_verified, smtp_config) VALUES
('tauos.org', '00000000-0000-0000-0000-000000000001', TRUE, '{"host": "smtp.tauos.org", "port": 587, "use_tls": true, "sendgrid": true}');

-- Create email templates
INSERT INTO email_templates (organization_id, name, subject, html_body, text_body, template_type, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'Welcome Email', 'Welcome to TauOS!', '<h1>Welcome to TauOS!</h1><p>Thank you for joining our privacy-first ecosystem.</p><p>Best regards,<br>The TauOS Team</p>', 'Welcome to TauOS!\n\nThank you for joining our privacy-first ecosystem.\n\nBest regards,\nThe TauOS Team', 'welcome', TRUE),
('00000000-0000-0000-0000-000000000001', 'Password Reset', 'Reset Your TauOS Password', '<h1>Password Reset</h1><p>Click the link below to reset your password.</p><p>If you did not request this, please ignore this email.</p>', 'Password Reset\n\nClick the link below to reset your password.\n\nIf you did not request this, please ignore this email.', 'notification', TRUE),
('00000000-0000-0000-0000-000000000001', 'Email Verification', 'Verify Your Email Address', '<h1>Email Verification</h1><p>Please verify your email address by clicking the link below.</p><p>This link will expire in 24 hours.</p>', 'Email Verification\n\nPlease verify your email address by clicking the link below.\n\nThis link will expire in 24 hours.', 'notification', TRUE);

-- =====================================================
-- EMAILS (Sample Emails)
-- =====================================================

-- Create sample emails
INSERT INTO emails (user_id, sender_id, recipient_id, from_email, to_email, subject, body, html_body, message_id, is_read, is_sent, folder, priority, delivery_status, sent_at, created_at) VALUES
-- Welcome email from Saleena
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'saleena@tauos.org', 'developer@tauos.org', 'Welcome to TauOS Development Team!', 'Welcome to the TauOS development team. We are excited to have you on board!', '<h1>Welcome to TauOS Development Team!</h1><p>Welcome to the TauOS development team. We are excited to have you on board!</p><p>Best regards,<br>Saleena Falcon<br>CEO, TauOS</p>', '<welcome-dev@tauos.org>', TRUE, TRUE, 'sent', 'normal', 'sent', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'saleena@tauos.org', 'developer@tauos.org', 'Welcome to TauOS Development Team!', 'Welcome to the TauOS development team. We are excited to have you on board!', '<h1>Welcome to TauOS Development Team!</h1><p>Welcome to the TauOS development team. We are excited to have you on board!</p><p>Best regards,<br>Saleena Falcon<br>CEO, TauOS</p>', '<welcome-dev-inbox@tauos.org>', TRUE, TRUE, 'inbox', 'normal', 'sent', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'saleena@tauos.org', 'user@tauos.org', 'Welcome to TauOS!', 'Welcome to the TauOS ecosystem. We are excited to have you on board!', '<h1>Welcome to TauOS!</h1><p>Welcome to the TauOS ecosystem. We are excited to have you on board!</p><p>Best regards,<br>Saleena Falcon<br>CEO, TauOS</p>', '<welcome-user@tauos.org>', FALSE, TRUE, 'inbox', 'normal', 'sent', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- =====================================================
-- CLOUD STORAGE (TauCloud)
-- =====================================================

-- Create sample folders
INSERT INTO cloud_folders (user_id, name, path, is_shared, share_token, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Documents', '/Documents', FALSE, NULL, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'Projects', '/Documents/Projects', FALSE, NULL, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'Shared', '/Shared', TRUE, 'share_abc123', NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'Development', '/Development', FALSE, NULL, NOW() - INTERVAL '3 days'),
('22222222-2222-2222-2222-222222222222', 'Code', '/Development/Code', FALSE, NULL, NOW() - INTERVAL '3 days');

-- Create sample files
INSERT INTO cloud_files (user_id, folder_id, filename, original_name, file_path, file_size, mime_type, file_hash, is_shared, share_token, version, created_at) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM cloud_folders WHERE name = 'Documents' AND user_id = '11111111-1111-1111-1111-111111111111'), 'tauos_whitepaper.pdf', 'TauOS Whitepaper.pdf', '/Documents/tauos_whitepaper.pdf', 2097152, 'application/pdf', 'sha256:abc123', FALSE, NULL, 1, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM cloud_folders WHERE name = 'Projects' AND user_id = '11111111-1111-1111-1111-111111111111'), 'roadmap.md', 'TauOS Roadmap.md', '/Documents/Projects/roadmap.md', 4096, 'text/markdown', 'sha256:def456', FALSE, NULL, 1, NOW() - INTERVAL '12 hours'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM cloud_folders WHERE name = 'Code' AND user_id = '22222222-2222-2222-2222-222222222222'), 'app.js', 'TauOS App.js', '/Development/Code/app.js', 8192, 'application/javascript', 'sha256:ghi789', FALSE, NULL, 1, NOW() - INTERVAL '6 hours');

-- =====================================================
-- APP STORE (TauStore)
-- =====================================================

-- Create store categories
INSERT INTO store_categories (name, description, icon) VALUES
('Productivity', 'Apps to boost your productivity', 'briefcase'),
('Development', 'Tools for developers', 'code'),
('Communication', 'Messaging and communication apps', 'message-circle'),
('Entertainment', 'Games and entertainment', 'gamepad2'),
('Utilities', 'System utilities and tools', 'settings'),
('Education', 'Learning and educational apps', 'book-open');

-- Create sample apps
INSERT INTO store_apps (developer_id, category_id, name, description, short_description, version, app_icon, screenshots, download_url, price, is_free, is_featured, is_active, download_count, rating, review_count, tags, requirements, permissions, created_at) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM store_categories WHERE name = 'Productivity'), 'TauOffice', 'Complete office suite for TauOS', 'Professional office suite with word processor, spreadsheet, and presentation tools', '1.0.0', 'https://store.tauos.org/icons/tauoffice.png', ARRAY['https://store.tauos.org/screenshots/tauoffice1.png', 'https://store.tauos.org/screenshots/tauoffice2.png'], 'https://store.tauos.org/downloads/tauoffice-1.0.0.tau', 0.00, TRUE, TRUE, TRUE, 1500, 4.8, 120, ARRAY['office', 'productivity', 'business'], '{"os": "TauOS", "ram": "4GB", "storage": "2GB"}', '{"files": "read_write", "network": "internet"}', NOW() - INTERVAL '7 days'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM store_categories WHERE name = 'Development'), 'TauStudio', 'Integrated development environment', 'Full-featured IDE for TauScript and other languages', '2.1.0', 'https://store.tauos.org/icons/taustudio.png', ARRAY['https://store.tauos.org/screenshots/taustudio1.png'], 'https://store.tauos.org/downloads/taustudio-2.1.0.tau', 0.00, TRUE, TRUE, TRUE, 800, 4.9, 95, ARRAY['ide', 'development', 'tauscript'], '{"os": "TauOS", "ram": "8GB", "storage": "5GB"}', '{"files": "read_write", "network": "internet", "system": "debug"}', NOW() - INTERVAL '5 days');

-- =====================================================
-- BROWSER (TauBrowser)
-- =====================================================

-- Create sample bookmarks
INSERT INTO browser_bookmarks (user_id, title, url, favicon, is_folder, sort_order, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'TauOS', NULL, NULL, TRUE, 1, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'TauOS Home', 'https://tauos.org', 'https://tauos.org/favicon.ico', FALSE, 1, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'TauOS Docs', 'https://docs.tauos.org', 'https://docs.tauos.org/favicon.ico', FALSE, 2, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'TauOS GitHub', 'https://github.com/tauos', 'https://github.com/favicon.ico', FALSE, 3, NOW() - INTERVAL '1 day');

-- Create sample browser history
INSERT INTO browser_history (user_id, title, url, favicon, visit_count, last_visited_at, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'TauOS - Privacy-First Operating System', 'https://tauos.org', 'https://tauos.org/favicon.ico', 25, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'TauOS Documentation', 'https://docs.tauos.org', 'https://docs.tauos.org/favicon.ico', 15, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 'TauOS GitHub Repository', 'https://github.com/tauos/tauos', 'https://github.com/favicon.ico', 8, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '1 day');

-- =====================================================
-- AI (TauAI)
-- =====================================================

-- Create AI models
INSERT INTO ai_models (name, description, model_type, provider, model_id, capabilities) VALUES
('TauGPT-4', 'TauOS AI Assistant', 'text', 'tauos', 'taugpt-4', '{"text_generation": true, "code_assistance": true, "translation": true}'),
('TauVision', 'Image analysis and generation', 'image', 'tauos', 'tauvision-1', '{"image_analysis": true, "image_generation": true, "object_detection": true}'),
('TauVoice', 'Speech recognition and synthesis', 'audio', 'tauos', 'tauvoice-1', '{"speech_to_text": true, "text_to_speech": true, "voice_cloning": true}');

-- Create AI conversations
INSERT INTO ai_conversations (user_id, model_id, title, context, is_active, created_at) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM ai_models WHERE name = 'TauGPT-4'), 'TauOS Development Discussion', '{"topic": "TauOS Development", "language": "en", "expertise": "expert"}', TRUE, NOW() - INTERVAL '2 hours'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM ai_models WHERE name = 'TauGPT-4'), 'TauScript Development Help', '{"topic": "TauScript", "language": "en", "expertise": "intermediate"}', TRUE, NOW() - INTERVAL '1 hour');

-- =====================================================
-- DEVELOPER PORTAL
-- =====================================================

-- Create sample projects
INSERT INTO projects (user_id, name, description, repository_url, is_public, project_type, framework, language, status, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'TauOS Core', 'Core operating system for TauOS', 'https://github.com/tauos/tauos-core', TRUE, 'system', 'TauOS', 'tauscript', 'active', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222222', 'TauScript Web App', 'A web application built with TauScript', 'https://github.com/tauos/tauscript-web-app', TRUE, 'web', 'TauScript', 'tauscript', 'active', NOW() - INTERVAL '3 days');

-- Create project collaborators
INSERT INTO project_collaborators (project_id, user_id, role, permissions, invited_at, accepted_at, is_active) VALUES
((SELECT id FROM projects WHERE name = 'TauOS Core'), '11111111-1111-1111-1111-111111111111', 'owner', '{"read": true, "write": true, "admin": true}', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', TRUE),
((SELECT id FROM projects WHERE name = 'TauOS Core'), '22222222-2222-2222-2222-222222222222', 'admin', '{"read": true, "write": true, "admin": true}', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', TRUE);

-- Create sample files
INSERT INTO files (project_id, filename, file_path, content, file_type, size_bytes, is_binary, encoding, created_at) VALUES
((SELECT id FROM projects WHERE name = 'TauOS Core'), 'main.tau', '/main.tau', 'import { System } from "tauos/core";\n\nclass TauOS extends System {\n  start() {\n    console.log("TauOS starting...");\n  }\n}', 'tauscript', 150, FALSE, 'utf8', NOW() - INTERVAL '5 days'),
((SELECT id FROM projects WHERE name = 'TauScript Web App'), 'app.tau', '/app.tau', 'import { Component } from "tauos/web";\n\nclass App extends Component {\n  render() {\n    return <div>Hello TauOS!</div>;\n  }\n}', 'tauscript', 120, FALSE, 'utf8', NOW() - INTERVAL '3 days');

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Create sample notifications
INSERT INTO notifications (user_id, title, message, type, app_name, is_read, action_url, metadata, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Welcome to TauOS!', 'Your TauOS account has been created successfully', 'success', 'global', FALSE, '/dashboard', '{"welcome": true}', NOW() - INTERVAL '1 hour'),
('11111111-1111-1111-1111-111111111111', 'New Email Received', 'You have received a new email from developer@tauos.org', 'info', 'taumail', FALSE, '/taumail/inbox', '{"email_id": "123", "sender": "developer@tauos.org"}', NOW() - INTERVAL '30 minutes'),
('22222222-2222-2222-2222-222222222222', 'Project Update', 'Your project TauScript Web App has been updated', 'info', 'developer', TRUE, '/projects/tauscript-web-app', '{"project": "TauScript Web App"}', NOW() - INTERVAL '2 hours');

-- =====================================================
-- SECURITY EVENTS
-- =====================================================

-- Create sample security events
INSERT INTO security_events (user_id, event_type, event_data, ip_address, user_agent, severity, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'login', '{"success": true, "method": "password"}', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'info', NOW() - INTERVAL '1 hour'),
('11111111-1111-1111-1111-111111111111', 'password_change', '{"success": true, "method": "self_service"}', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'info', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'login', '{"success": true, "method": "password"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'info', NOW() - INTERVAL '2 hours');

-- =====================================================
-- LOGIN ATTEMPTS
-- =====================================================

-- Create sample login attempts
INSERT INTO login_attempts (user_id, email, ip_address, user_agent, success, failure_reason, attempted_at) VALUES
('11111111-1111-1111-1111-111111111111', 'saleena@tauos.org', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', TRUE, NULL, NOW() - INTERVAL '1 hour'),
('22222222-2222-2222-2222-222222222222', 'developer@tauos.org', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', TRUE, NULL, NOW() - INTERVAL '2 hours');

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================

-- Seed data creation complete
SELECT 'TauCore™ Complete Hybrid Database Seed Data created successfully!' as status;
