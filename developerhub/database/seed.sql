-- TauCore™ Developer Hub Database Seed Data
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
    'The core operating system for TauCore™',
    'https://github.com/taucore/taucore-os',
    true
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'TauScript Language',
    'The TauScript programming language implementation',
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

-- Insert project collaborators
INSERT INTO project_collaborators (
    project_id, user_id, role, joined_at
) VALUES 
(
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    'owner',
    CURRENT_TIMESTAMP
),
(
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'admin',
    CURRENT_TIMESTAMP
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'owner',
    CURRENT_TIMESTAMP
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'owner',
    CURRENT_TIMESTAMP
);

-- Insert sample files
INSERT INTO files (
    id, project_id, user_id, name, path, content, is_directory
) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'README.md',
    '/README.md',
    '# TauCore™ OS\n\nThe core operating system for TauCore™\n\n## Features\n\n- Privacy-first design\n- Modern architecture\n- Developer-friendly\n',
    false
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'src',
    '/src',
    null,
    true
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'main.tau',
    '/main.tau',
    '// TauScript Hello World\nprint("Hello, TauCore™!");\n',
    false
);

-- Insert sample git repositories
INSERT INTO git_repositories (
    id, project_id, name, remote_url, default_branch, last_commit_hash, last_commit_message, last_commit_author, last_commit_date
) VALUES 
(
    '880e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    'taucore-os',
    'https://github.com/taucore/taucore-os.git',
    'main',
    'a1b2c3d4e5f6789012345678901234567890abcd',
    'feat: implement privacy selection interface',
    'TauCore™ Developer <developer@tauos.org>',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
),
(
    '880e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'tauscript',
    'https://github.com/taucore/tauscript.git',
    'main',
    'b2c3d4e5f6789012345678901234567890abcde',
    'feat: complete TauScript language implementation',
    'TauCore™ Developer <developer@tauos.org>',
    CURRENT_TIMESTAMP - INTERVAL '1 hour'
);

-- Insert sample pipelines
INSERT INTO pipelines (
    id, project_id, name, description, config_yaml, is_active
) VALUES 
(
    '990e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    'TauCore™ OS Build',
    'Build and test TauCore™ OS',
    'name: TauCore OS Build
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build TauCore OS
      run: |
        echo "Building TauCore OS..."
        # Add build commands here
    - name: Run Tests
      run: |
        echo "Running tests..."
        # Add test commands here',
    true
),
(
    '990e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'TauScript Tests',
    'Test TauScript language implementation',
    'name: TauScript Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Test TauScript
      run: |
        echo "Testing TauScript..."
        # Add test commands here',
    true
);

-- Insert sample pipeline runs
INSERT INTO pipeline_runs (
    id, pipeline_id, status, trigger_type, started_at, completed_at
) VALUES 
(
    'aa0e8400-e29b-41d4-a716-446655440000',
    '990e8400-e29b-41d4-a716-446655440000',
    'success',
    'push',
    CURRENT_TIMESTAMP - INTERVAL '3 hours',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
),
(
    'aa0e8400-e29b-41d4-a716-446655440001',
    '990e8400-e29b-41d4-a716-446655440001',
    'running',
    'push',
    CURRENT_TIMESTAMP - INTERVAL '30 minutes',
    null
);

-- Insert sample notifications
INSERT INTO notifications (
    id, user_id, type, title, message, data
) VALUES 
(
    'bb0e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'build_success',
    'Build Successful',
    'TauCore™ OS build completed successfully',
    '{"projectId": "660e8400-e29b-41d4-a716-446655440000", "pipelineId": "990e8400-e29b-41d4-a716-446655440000"}'
),
(
    'bb0e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'pull_request',
    'New Pull Request',
    'New pull request #42: "Add privacy selection interface"',
    '{"projectId": "660e8400-e29b-41d4-a716-446655440000", "pullRequestId": "42"}'
);

-- Insert sample API keys
INSERT INTO api_keys (
    id, user_id, name, key_hash, permissions, expires_at
) VALUES 
(
    'cc0e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'GitHub Integration',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4j4j4j4j4j',
    '{"repositories": "read", "pull_requests": "write"}',
    CURRENT_TIMESTAMP + INTERVAL '1 year'
);

-- Insert sample security events
INSERT INTO security_events (
    id, user_id, event_type, description, ip_address, user_agent
) VALUES 
(
    'dd0e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'login',
    'Successful login from San Francisco, CA',
    '192.168.1.100',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
),
(
    'dd0e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'password_change',
    'Password changed successfully',
    '192.168.1.100',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
);

-- Insert sample login attempts
INSERT INTO login_attempts (
    id, user_id, email, ip_address, user_agent, success, country, city, region
) VALUES 
(
    'ee0e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'developer@tauos.org',
    '192.168.1.100',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    true,
    'United States',
    'San Francisco',
    'California'
),
(
    'ee0e8400-e29b-41d4-a716-446655440001',
    null,
    'hacker@evil.com',
    '192.168.1.200',
    'curl/7.68.0',
    false,
    'Unknown',
    'Unknown',
    'Unknown'
);
