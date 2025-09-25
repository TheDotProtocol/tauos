-- TauCore™ Hybrid Database Seed Data - Production Ready
-- Sample data for complete TauOS ecosystem testing

-- =====================================================
-- ORGANIZATIONS
-- =====================================================

-- Update default organization with more details (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM organizations WHERE id = '00000000-0000-0000-0000-000000000001') THEN
        UPDATE organizations SET 
            name = 'TauOS Foundation',
            domain = 'tauos.org',
            max_users = 1000000,
            storage_quota_bytes = 1099511627776, -- 1TB
            email_quota_daily = 10000
        WHERE id = '00000000-0000-0000-0000-000000000001';
    END IF;
END $$;

-- Add sample organizations (with conflict handling)
INSERT INTO organizations (id, name, domain, plan, max_users, storage_quota_bytes, email_quota_daily) VALUES
('00000000-0000-0000-0000-000000000002', 'Acme Corporation', 'acme.com', 'pro', 100, 107374182400, 1000),
('00000000-0000-0000-0000-000000000003', 'TechStart Inc', 'techstart.io', 'free', 10, 10737418240, 100)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    domain = EXCLUDED.domain,
    plan = EXCLUDED.plan,
    max_users = EXCLUDED.max_users,
    storage_quota_bytes = EXCLUDED.storage_quota_bytes,
    email_quota_daily = EXCLUDED.email_quota_daily;

-- =====================================================
-- USERS
-- =====================================================

-- Create sample users
INSERT INTO users (id, organization_id, email, username, full_name, password_hash, avatar, bio, location, website, is_email_verified, is_two_factor_enabled, custom_domain, email_quota_used, storage_used_bytes, last_login_at, is_active) VALUES
-- TauOS Foundation users
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'admin@tauos.org', 'admin', 'TauOS Administrator', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://tauos.org/avatars/admin.jpg', 'TauOS System Administrator', 'San Francisco, CA', 'https://tauos.org', TRUE, TRUE, 'tauos.org', 0, 0, NOW() - INTERVAL '1 hour', TRUE),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'developer@tauos.org', 'developer', 'TauOS Developer', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://tauos.org/avatars/developer.jpg', 'Senior Developer at TauOS', 'San Francisco, CA', 'https://github.com/tauos', TRUE, FALSE, 'tauos.org', 5, 1048576, NOW() - INTERVAL '2 hours', TRUE),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'user@tauos.org', 'user', 'TauOS User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://tauos.org/avatars/user.jpg', 'Happy TauOS user', 'New York, NY', 'https://user.tauos.org', TRUE, FALSE, 'tauos.org', 2, 524288, NOW() - INTERVAL '1 day', TRUE),

-- Acme Corporation users
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000002', 'ceo@acme.com', 'ceo', 'John Smith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://acme.com/avatars/ceo.jpg', 'CEO of Acme Corporation', 'Los Angeles, CA', 'https://acme.com', TRUE, TRUE, 'acme.com', 10, 5242880, NOW() - INTERVAL '30 minutes', TRUE),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000002', 'dev@acme.com', 'dev', 'Jane Developer', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://acme.com/avatars/dev.jpg', 'Lead Developer at Acme', 'Los Angeles, CA', 'https://github.com/acme', TRUE, FALSE, 'acme.com', 3, 2097152, NOW() - INTERVAL '1 hour', TRUE),

-- TechStart Inc users
('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000003', 'founder@techstart.io', 'founder', 'Alex Johnson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'https://techstart.io/avatars/founder.jpg', 'Founder of TechStart', 'Austin, TX', 'https://techstart.io', TRUE, FALSE, 'techstart.io', 1, 1048576, NOW() - INTERVAL '3 hours', TRUE);

-- =====================================================
-- USER SESSIONS
-- =====================================================

-- Create active sessions
INSERT INTO user_sessions (user_id, session_id, ip_address, user_agent, device_info, remember_me, expires_at, last_activity_at) VALUES
('11111111-1111-1111-1111-111111111111', 'sess_admin_123', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '{"os": "macOS", "browser": "Chrome", "device": "desktop"}', TRUE, NOW() + INTERVAL '7 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'sess_dev_456', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '{"os": "macOS", "browser": "Firefox", "device": "desktop"}', FALSE, NOW() + INTERVAL '1 day', NOW() - INTERVAL '30 minutes'),
('44444444-4444-4444-4444-444444444444', 'sess_ceo_789', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"os": "Windows", "browser": "Edge", "device": "desktop"}', TRUE, NOW() + INTERVAL '7 days', NOW() - INTERVAL '5 minutes');

-- =====================================================
-- EMAILS (TauMail)
-- =====================================================

-- Create sample emails
INSERT INTO emails (user_id, sender_id, recipient_id, from_email, to_email, subject, body, html_body, message_id, is_read, is_sent, folder, priority, delivery_status, sent_at, created_at) VALUES
-- Inbox emails
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'admin@tauos.org', 'developer@tauos.org', 'Welcome to TauOS!', 'Welcome to the TauOS ecosystem. We are excited to have you on board!', '<h1>Welcome to TauOS!</h1><p>Welcome to the TauOS ecosystem. We are excited to have you on board!</p>', '<welcome@tauos.org>', TRUE, TRUE, 'inbox', 'normal', 'sent', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'admin@tauos.org', 'user@tauos.org', 'TauOS Update Available', 'A new update is available for your TauOS system. Please update when convenient.', '<h1>TauOS Update Available</h1><p>A new update is available for your TauOS system. Please update when convenient.</p>', '<update@tauos.org>', FALSE, TRUE, 'inbox', 'normal', 'sent', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'dev@acme.com', 'ceo@acme.com', 'Project Status Update', 'The new feature is ready for testing. Please review the attached files.', '<h1>Project Status Update</h1><p>The new feature is ready for testing. Please review the attached files.</p>', '<project@acme.com>', TRUE, TRUE, 'inbox', 'high', 'sent', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),

-- Sent emails
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'admin@tauos.org', 'developer@tauos.org', 'Welcome to TauOS!', 'Welcome to the TauOS ecosystem. We are excited to have you on board!', '<h1>Welcome to TauOS!</h1><p>Welcome to the TauOS ecosystem. We are excited to have you on board!</p>', '<welcome@tauos.org>', TRUE, TRUE, 'sent', 'normal', 'sent', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'dev@acme.com', 'ceo@acme.com', 'Project Status Update', 'The new feature is ready for testing. Please review the attached files.', '<h1>Project Status Update</h1><p>The new feature is ready for testing. Please review the attached files.</p>', '<project@acme.com>', TRUE, TRUE, 'sent', 'high', 'sent', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes');

-- =====================================================
-- CLOUD STORAGE (TauCloud)
-- =====================================================

-- Create sample folders
INSERT INTO cloud_folders (user_id, name, path, is_shared, share_token, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'Documents', '/Documents', FALSE, NULL, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'Projects', '/Documents/Projects', FALSE, NULL, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'Shared', '/Shared', TRUE, 'share_abc123', NOW() - INTERVAL '2 days'),
('44444444-4444-4444-4444-444444444444', 'Company Files', '/Company Files', FALSE, NULL, NOW() - INTERVAL '3 days'),
('44444444-4444-4444-4444-444444444444', 'Reports', '/Company Files/Reports', FALSE, NULL, NOW() - INTERVAL '3 days');

-- Create sample files
INSERT INTO cloud_files (user_id, folder_id, filename, original_name, file_path, file_size, mime_type, file_hash, is_shared, share_token, version, created_at) VALUES
('22222222-2222-2222-2222-222222222222', (SELECT id FROM cloud_folders WHERE name = 'Documents' AND user_id = '22222222-2222-2222-2222-222222222222'), 'project_proposal.pdf', 'Project Proposal.pdf', '/Documents/project_proposal.pdf', 1048576, 'application/pdf', 'sha256:abc123', FALSE, NULL, 1, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM cloud_folders WHERE name = 'Projects' AND user_id = '22222222-2222-2222-2222-222222222222'), 'code_review.md', 'Code Review.md', '/Documents/Projects/code_review.md', 2048, 'text/markdown', 'sha256:def456', FALSE, NULL, 1, NOW() - INTERVAL '12 hours'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM cloud_folders WHERE name = 'Shared' AND user_id = '22222222-2222-2222-2222-222222222222'), 'team_meeting.mp4', 'Team Meeting.mp4', '/Shared/team_meeting.mp4', 52428800, 'video/mp4', 'sha256:ghi789', TRUE, 'share_file_xyz789', 1, NOW() - INTERVAL '6 hours'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM cloud_folders WHERE name = 'Company Files' AND user_id = '44444444-4444-4444-4444-444444444444'), 'quarterly_report.pdf', 'Q4 2024 Report.pdf', '/Company Files/quarterly_report.pdf', 2097152, 'application/pdf', 'sha256:jkl012', FALSE, NULL, 1, NOW() - INTERVAL '3 days'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM cloud_folders WHERE name = 'Reports' AND user_id = '44444444-4444-4444-4444-444444444444'), 'sales_data.xlsx', 'Sales Data Q4.xlsx', '/Company Files/Reports/sales_data.xlsx', 1048576, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'sha256:mno345', FALSE, NULL, 1, NOW() - INTERVAL '2 days');

-- =====================================================
-- APP STORE (TauStore)
-- =====================================================

-- Create sample apps
INSERT INTO store_apps (developer_id, category_id, name, description, short_description, version, app_icon, screenshots, download_url, price, is_free, is_featured, is_active, download_count, rating, review_count, tags, requirements, permissions, created_at) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM store_categories WHERE name = 'Productivity'), 'TauOffice', 'Complete office suite for TauOS', 'Professional office suite with word processor, spreadsheet, and presentation tools', '1.0.0', 'https://store.tauos.org/icons/tauoffice.png', ARRAY['https://store.tauos.org/screenshots/tauoffice1.png', 'https://store.tauos.org/screenshots/tauoffice2.png'], 'https://store.tauos.org/downloads/tauoffice-1.0.0.tau', 0.00, TRUE, TRUE, TRUE, 1500, 4.8, 120, ARRAY['office', 'productivity', 'business'], '{"os": "TauOS", "ram": "4GB", "storage": "2GB"}', '{"files": "read_write", "network": "internet"}', NOW() - INTERVAL '7 days'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM store_categories WHERE name = 'Development'), 'TauStudio', 'Integrated development environment', 'Full-featured IDE for TauScript and other languages', '2.1.0', 'https://store.tauos.org/icons/taustudio.png', ARRAY['https://store.tauos.org/screenshots/taustudio1.png'], 'https://store.tauos.org/downloads/taustudio-2.1.0.tau', 0.00, TRUE, TRUE, TRUE, 800, 4.9, 95, ARRAY['ide', 'development', 'tauscript'], '{"os": "TauOS", "ram": "8GB", "storage": "5GB"}', '{"files": "read_write", "network": "internet", "system": "debug"}', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM store_categories WHERE name = 'Communication'), 'TauChat', 'Secure messaging app', 'End-to-end encrypted messaging for TauOS', '1.5.2', 'https://store.tauos.org/icons/tauchat.png', ARRAY['https://store.tauos.org/screenshots/tauchat1.png', 'https://store.tauos.org/screenshots/tauchat2.png'], 'https://store.tauos.org/downloads/tauchat-1.5.2.tau', 0.00, TRUE, FALSE, TRUE, 2000, 4.7, 180, ARRAY['messaging', 'security', 'encryption'], '{"os": "TauOS", "ram": "2GB", "storage": "500MB"}', '{"network": "internet", "contacts": "read"}', NOW() - INTERVAL '3 days'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM store_categories WHERE name = 'Entertainment'), 'TauGames', 'Gaming platform', 'Collection of games for TauOS', '1.0.0', 'https://store.tauos.org/icons/taugames.png', ARRAY['https://store.tauos.org/screenshots/taugames1.png'], 'https://store.tauos.org/downloads/taugames-1.0.0.tau', 9.99, FALSE, FALSE, TRUE, 500, 4.5, 45, ARRAY['games', 'entertainment', 'multiplayer'], '{"os": "TauOS", "ram": "8GB", "storage": "10GB", "gpu": "dedicated"}', '{"files": "read", "network": "internet", "audio": "playback"}', NOW() - INTERVAL '1 day');

-- =====================================================
-- BROWSER (TauBrowser)
-- =====================================================

-- Create sample bookmarks
INSERT INTO browser_bookmarks (user_id, title, url, favicon, is_folder, sort_order, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'Development', NULL, NULL, TRUE, 1, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'GitHub', 'https://github.com', 'https://github.com/favicon.ico', FALSE, 1, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'Stack Overflow', 'https://stackoverflow.com', 'https://stackoverflow.com/favicon.ico', FALSE, 2, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'TauOS Docs', 'https://docs.tauos.org', 'https://docs.tauos.org/favicon.ico', FALSE, 3, NOW() - INTERVAL '1 day'),
('44444444-4444-4444-4444-444444444444', 'Business', NULL, NULL, TRUE, 1, NOW() - INTERVAL '3 days'),
('44444444-4444-4444-4444-444444444444', 'Acme Corp', 'https://acme.com', 'https://acme.com/favicon.ico', FALSE, 1, NOW() - INTERVAL '3 days'),
('44444444-4444-4444-4444-444444444444', 'LinkedIn', 'https://linkedin.com', 'https://linkedin.com/favicon.ico', FALSE, 2, NOW() - INTERVAL '3 days');

-- Create sample browser history
INSERT INTO browser_history (user_id, title, url, favicon, visit_count, last_visited_at, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'GitHub - TauOS Repository', 'https://github.com/tauos/tauos', 'https://github.com/favicon.ico', 15, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'TauOS Documentation', 'https://docs.tauos.org', 'https://docs.tauos.org/favicon.ico', 8, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'Stack Overflow - TauScript Question', 'https://stackoverflow.com/questions/tauscript', 'https://stackoverflow.com/favicon.ico', 3, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '1 day'),
('44444444-4444-4444-4444-444444444444', 'Acme Corporation - Home', 'https://acme.com', 'https://acme.com/favicon.ico', 25, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '3 days'),
('44444444-4444-4444-4444-444444444444', 'LinkedIn - Professional Network', 'https://linkedin.com', 'https://linkedin.com/favicon.ico', 12, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '5 days');

-- =====================================================
-- AI CONVERSATIONS (TauAI)
-- =====================================================

-- Create sample AI conversations
INSERT INTO ai_conversations (user_id, model_id, title, context, is_active, created_at) VALUES
('22222222-2222-2222-2222-222222222222', (SELECT id FROM ai_models WHERE name = 'TauGPT-4'), 'TauScript Development Help', '{"topic": "TauScript", "language": "en", "expertise": "intermediate"}', TRUE, NOW() - INTERVAL '2 hours'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM ai_models WHERE name = 'TauVision'), 'Image Analysis Project', '{"topic": "Computer Vision", "language": "en", "expertise": "beginner"}', TRUE, NOW() - INTERVAL '1 hour'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM ai_models WHERE name = 'TauGPT-4'), 'Business Strategy Discussion', '{"topic": "Business", "language": "en", "expertise": "expert"}', TRUE, NOW() - INTERVAL '30 minutes');

-- =====================================================
-- DEVELOPER PORTAL
-- =====================================================

-- Create sample projects
INSERT INTO projects (user_id, name, description, repository_url, is_public, project_type, framework, language, status, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'TauScript Web App', 'A web application built with TauScript', 'https://github.com/tauos/tauscript-web-app', TRUE, 'web', 'TauScript', 'tauscript', 'active', NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222222', 'TauOS Mobile App', 'Mobile application for TauOS', 'https://github.com/tauos/tauos-mobile', TRUE, 'mobile', 'TauScript', 'tauscript', 'active', NOW() - INTERVAL '3 days'),
('55555555-5555-5555-5555-555555555555', 'Acme CRM', 'Customer relationship management system', 'https://github.com/acme/acme-crm', FALSE, 'web', 'React', 'javascript', 'active', NOW() - INTERVAL '7 days');

-- Create project collaborators
INSERT INTO project_collaborators (project_id, user_id, role, permissions, invited_at, accepted_at, is_active) VALUES
((SELECT id FROM projects WHERE name = 'TauScript Web App'), '11111111-1111-1111-1111-111111111111', 'admin', '{"read": true, "write": true, "admin": true}', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', TRUE),
((SELECT id FROM projects WHERE name = 'TauOS Mobile App'), '11111111-1111-1111-1111-111111111111', 'owner', '{"read": true, "write": true, "admin": true}', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', TRUE),
((SELECT id FROM projects WHERE name = 'Acme CRM'), '44444444-4444-4444-4444-444444444444', 'admin', '{"read": true, "write": true, "admin": true}', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', TRUE);

-- Create sample files
INSERT INTO files (project_id, filename, file_path, content, file_type, size_bytes, is_binary, encoding, created_at) VALUES
((SELECT id FROM projects WHERE name = 'TauScript Web App'), 'app.tau', '/app.tau', 'import { Component } from "tauos/web";\n\nclass App extends Component {\n  render() {\n    return <div>Hello TauOS!</div>;\n  }\n}', 'tauscript', 150, FALSE, 'utf8', NOW() - INTERVAL '5 days'),
((SELECT id FROM projects WHERE name = 'TauScript Web App'), 'package.json', '/package.json', '{\n  "name": "tauscript-web-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "tauos": "^1.0.0"\n  }\n}', 'json', 200, FALSE, 'utf8', NOW() - INTERVAL '5 days'),
((SELECT id FROM projects WHERE name = 'Acme CRM'), 'index.js', '/index.js', 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Acme CRM");\n});\n\napp.listen(3000);', 'javascript', 120, FALSE, 'utf8', NOW() - INTERVAL '7 days');

-- Create git repositories
INSERT INTO git_repositories (project_id, name, description, repository_url, branch, is_private, last_commit_hash, last_commit_message, last_commit_at, created_at) VALUES
((SELECT id FROM projects WHERE name = 'TauScript Web App'), 'tauscript-web-app', 'TauScript Web Application', 'https://github.com/tauos/tauscript-web-app', 'main', FALSE, 'abc123def456', 'Initial commit', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
((SELECT id FROM projects WHERE name = 'TauOS Mobile App'), 'tauos-mobile', 'TauOS Mobile Application', 'https://github.com/tauos/tauos-mobile', 'main', FALSE, 'def456ghi789', 'Add mobile components', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
((SELECT id FROM projects WHERE name = 'Acme CRM'), 'acme-crm', 'Acme CRM System', 'https://github.com/acme/acme-crm', 'main', TRUE, 'ghi789jkl012', 'Implement user authentication', NOW() - INTERVAL '1 day', NOW() - INTERVAL '7 days');

-- Create CI/CD pipelines
INSERT INTO pipelines (project_id, name, description, pipeline_config, trigger_type, is_active, last_run_at, created_at) VALUES
((SELECT id FROM projects WHERE name = 'TauScript Web App'), 'Build and Deploy', 'Automated build and deployment pipeline', '{"steps": [{"name": "build", "command": "tau build"}, {"name": "test", "command": "tau test"}, {"name": "deploy", "command": "tau deploy"}]}', 'webhook', TRUE, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '5 days'),
((SELECT id FROM projects WHERE name = 'Acme CRM'), 'Test Pipeline', 'Run tests and quality checks', '{"steps": [{"name": "install", "command": "npm install"}, {"name": "test", "command": "npm test"}, {"name": "lint", "command": "npm run lint"}]}', 'manual', TRUE, NOW() - INTERVAL '1 day', NOW() - INTERVAL '7 days');

-- Create pipeline runs
INSERT INTO pipeline_runs (pipeline_id, status, trigger_type, trigger_data, logs, started_at, completed_at, duration_seconds) VALUES
((SELECT id FROM pipelines WHERE name = 'Build and Deploy'), 'success', 'webhook', '{"commit": "abc123def456", "branch": "main"}', 'Build completed successfully\nTests passed\nDeployment successful', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes', 900),
((SELECT id FROM pipelines WHERE name = 'Test Pipeline'), 'success', 'manual', '{"user": "dev@acme.com"}', 'Installation completed\nAll tests passed\nLinting successful', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours 30 minutes', 1800);

-- =====================================================
-- API KEYS
-- =====================================================

-- Create sample API keys
INSERT INTO api_keys (user_id, name, key_hash, key_prefix, permissions, last_used_at, expires_at, is_active, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'TauOS API Key', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'tau_', '{"read": true, "write": true}', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '365 days', TRUE, NOW() - INTERVAL '5 days'),
('44444444-4444-4444-4444-444444444444', 'Acme API Key', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/4KzqK2O', 'acme_', '{"read": true, "write": false}', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '30 days', TRUE, NOW() - INTERVAL '7 days');

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Create sample notifications
INSERT INTO notifications (user_id, title, message, type, app_name, is_read, action_url, metadata, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'New Email Received', 'You have received a new email from admin@tauos.org', 'info', 'taumail', FALSE, '/taumail/inbox', '{"email_id": "123", "sender": "admin@tauos.org"}', NOW() - INTERVAL '30 minutes'),
('22222222-2222-2222-2222-222222222222', 'Pipeline Success', 'Your build pipeline completed successfully', 'success', 'developer', TRUE, '/projects/tauscript-web-app', '{"pipeline_id": "456", "project": "TauScript Web App"}', NOW() - INTERVAL '2 hours'),
('44444444-4444-4444-4444-444444444444', 'Storage Quota Warning', 'You are using 80% of your storage quota', 'warning', 'taucloud', FALSE, '/taucloud/storage', '{"usage": "80%", "quota": "1GB"}', NOW() - INTERVAL '1 hour'),
('44444444-4444-4444-4444-444444444444', 'Security Alert', 'Unusual login activity detected', 'error', 'security', FALSE, '/security/alerts', '{"ip": "192.168.1.200", "location": "Unknown"}', NOW() - INTERVAL '15 minutes');

-- =====================================================
-- SECURITY EVENTS
-- =====================================================

-- Create sample security events
INSERT INTO security_events (user_id, event_type, event_data, ip_address, user_agent, severity, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'login', '{"success": true, "method": "password"}', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'info', NOW() - INTERVAL '1 hour'),
('22222222-2222-2222-2222-222222222222', 'login', '{"success": true, "method": "password"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'info', NOW() - INTERVAL '2 hours'),
('44444444-4444-4444-4444-444444444444', 'login', '{"success": true, "method": "password"}', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'info', NOW() - INTERVAL '30 minutes'),
('44444444-4444-4444-4444-444444444444', 'failed_login', '{"success": false, "method": "password", "reason": "invalid_password"}', '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'warning', NOW() - INTERVAL '15 minutes'),
('44444444-4444-4444-4444-444444444444', 'password_change', '{"success": true, "method": "self_service"}', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'info', NOW() - INTERVAL '1 day');

-- =====================================================
-- LOGIN ATTEMPTS
-- =====================================================

-- Create sample login attempts
INSERT INTO login_attempts (user_id, email, ip_address, user_agent, success, failure_reason, attempted_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@tauos.org', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', TRUE, NULL, NOW() - INTERVAL '1 hour'),
('22222222-2222-2222-2222-222222222222', 'developer@tauos.org', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', TRUE, NULL, NOW() - INTERVAL '2 hours'),
('44444444-4444-4444-4444-444444444444', 'ceo@acme.com', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', TRUE, NULL, NOW() - INTERVAL '30 minutes'),
('44444444-4444-4444-4444-444444444444', 'ceo@acme.com', '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', FALSE, 'invalid_password', NOW() - INTERVAL '15 minutes'),
('66666666-6666-6666-6666-666666666666', 'founder@techstart.io', '192.168.1.103', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', TRUE, NULL, NOW() - INTERVAL '3 hours');

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================

-- Update statistics
UPDATE organizations SET 
    storage_quota_bytes = 1099511627776, -- 1TB
    email_quota_daily = 10000
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Seed data creation complete
SELECT 'TauCore™ Hybrid Database Seed Data created successfully!' as status;
