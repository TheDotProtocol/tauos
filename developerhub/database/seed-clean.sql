-- TauCore™ Developer Hub Database Seed Data - Clean Version
-- Sample data for development and testing

-- Insert sample users
INSERT INTO users (
    id, email, username, full_name, password_hash, 
    is_email_verified, bio, location, website
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@tauos.org',
    'admin',
    'TauCore™ Administrator',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4j4j4j4j4j', -- password: admin123
    true,
    'TauCore™ System Administrator',
    'San Francisco, CA',
    'https://tauos.org'
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'developer@tauos.org',
    'developer',
    'TauCore™ Developer',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4j4j4j4j4j', -- password: developer123
    true,
    'TauCore™ Core Developer',
    'San Francisco, CA',
    'https://github.com/taucore'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'user@example.com',
    'testuser',
    'Test User',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4j4j4j4j4j', -- password: user123
    true,
    'Test user for development',
    'New York, NY',
    'https://example.com'
);

-- Insert sample projects
INSERT INTO projects (
    id, user_id, name, description, repository_url, is_public
) VALUES 
(
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'TauCore™ OS',
    'The next-generation operating system with AI-native architecture',
    'https://github.com/taucore/tauos',
    true
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'TauScript Language',
    'The powerful programming language for TauCore™',
    'https://github.com/taucore/tauscript',
    true
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'My Test Project',
    'A test project for development',
    'https://github.com/testuser/test-project',
    false
);

-- Insert sample files
INSERT INTO files (
    id, project_id, filename, file_path, content, file_type, size_bytes
) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    'README.md',
    '/README.md',
    '# TauCore™ OS\n\nThe next-generation operating system with AI-native architecture.\n\n## Features\n- Universal compatibility\n- AI-native design\n- Enterprise security\n- Mobile-ready',
    'text/markdown',
    150
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'main.tau',
    '/src/main.tau',
    'import std.io;\n\nfn main() {\n    io.println("Hello, TauCore™!");\n}',
    'text/plain',
    50
);

-- Insert sample Git operations
INSERT INTO git_operations (
    id, user_id, project_id, operation_type, repository_url, branch_name, status
) VALUES 
(
    '880e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440000',
    'clone',
    'https://github.com/taucore/tauos',
    'main',
    'success'
),
(
    '880e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'push',
    'https://github.com/taucore/tauscript',
    'main',
    'success'
);

-- Insert sample CI/CD pipelines
INSERT INTO ci_cd_pipelines (
    id, user_id, project_id, name, description, pipeline_config, is_active
) VALUES 
(
    '990e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440000',
    'TauCore™ Build Pipeline',
    'Automated build and test pipeline for TauCore™ OS',
    '{"steps": ["build", "test", "deploy"], "triggers": ["push", "pr"]}',
    true
),
(
    '990e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'TauScript CI/CD',
    'Continuous integration for TauScript language',
    '{"steps": ["compile", "test", "package"], "triggers": ["push"]}',
    true
);

-- Insert sample pipeline runs
INSERT INTO pipeline_runs (
    id, pipeline_id, status, trigger_type, started_at, completed_at, duration_seconds
) VALUES 
(
    'aa0e8400-e29b-41d4-a716-446655440000',
    '990e8400-e29b-41d4-a716-446655440000',
    'success',
    'push',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '45 minutes',
    900
),
(
    'aa0e8400-e29b-41d4-a716-446655440001',
    '990e8400-e29b-41d4-a716-446655440001',
    'running',
    'manual',
    NOW() - INTERVAL '10 minutes',
    NULL,
    NULL
);

-- Insert sample sessions
INSERT INTO sessions (
    id, user_id, session_id, ip_address, user_agent, remember_me, expires_at
) VALUES 
(
    'bb0e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    'session_admin_123',
    '192.168.1.100',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    true,
    NOW() + INTERVAL '30 days'
),
(
    'bb0e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'session_developer_456',
    '192.168.1.101',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    false,
    NOW() + INTERVAL '7 days'
);

-- Insert sample login attempts
INSERT INTO login_attempts (
    id, user_id, email, ip_address, user_agent, success, failure_reason
) VALUES 
(
    'cc0e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@tauos.org',
    '192.168.1.100',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    true,
    NULL
),
(
    'cc0e8400-e29b-41d4-a716-446655440001',
    NULL,
    'hacker@evil.com',
    '192.168.1.999',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    false,
    'USER_NOT_FOUND'
);
