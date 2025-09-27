-- TauBrowser Database Schema
-- Privacy-first web browser with user management, browsing history, and bookmarks

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS user_bookmarks CASCADE;
DROP TABLE IF EXISTS browsing_history CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    privacy_settings JSONB DEFAULT '{"tracking": false, "cookies": false, "analytics": false}',
    theme_preferences JSONB DEFAULT '{"dark_mode": true, "accent_color": "#fbbf24"}'
);

-- Browsing history table
CREATE TABLE browsing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title VARCHAR(255),
    domain VARCHAR(255),
    visit_count INTEGER DEFAULT 1,
    last_visited TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visit_duration INTEGER DEFAULT 0, -- in seconds
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookmarks table
CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    folder VARCHAR(100) DEFAULT 'General',
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_browsing_history_user_id ON browsing_history(user_id);
CREATE INDEX idx_browsing_history_domain ON browsing_history(domain);
CREATE INDEX idx_browsing_history_last_visited ON browsing_history(last_visited);
CREATE INDEX idx_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_bookmarks_folder ON user_bookmarks(folder);
CREATE INDEX idx_bookmarks_is_favorite ON user_bookmarks(is_favorite);

-- Insert sample data
INSERT INTO users (username, email, password_hash) VALUES
('john', 'john@tauos.org', '$2b$10$rQZ8K9XvY7mN2pL1sT3wOu4vE6fH8jK2mN5pL8sT1wOu4vE6fH8jK2m'),
('jane', 'jane@tauos.org', '$2b$10$rQZ8K9XvY7mN2pL1sT3wOu4vE6fH8jK2mN5pL8sT1wOu4vE6fH8jK2m'),
('demo', 'demo@tauos.org', '$2b$10$rQZ8K9XvY7mN2pL1sT3wOu4vE6fH8jK2mN5pL8sT1wOu4vE6fH8jK2m');

-- Sample browsing history
INSERT INTO browsing_history (user_id, url, title, domain, visit_count, last_visited) VALUES
((SELECT id FROM users WHERE email = 'john@tauos.org'), 'https://www.tauos.org', 'TauCore - Privacy-First Operating System', 'tauos.org', 5, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
((SELECT id FROM users WHERE email = 'john@tauos.org'), 'https://github.com', 'GitHub: Where the world builds software', 'github.com', 3, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
((SELECT id FROM users WHERE email = 'john@tauos.org'), 'https://vercel.com', 'Vercel: The Frontend Cloud', 'vercel.com', 2, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
((SELECT id FROM users WHERE email = 'jane@tauos.org'), 'https://www.tauos.org/tauid', 'TauID - Identity Management', 'tauos.org', 4, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
((SELECT id FROM users WHERE email = 'jane@tauos.org'), 'https://www.tauos.org/taumail', 'TauMail - Secure Email', 'tauos.org', 2, CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- Sample bookmarks
INSERT INTO user_bookmarks (user_id, url, title, description, folder, tags, is_favorite) VALUES
((SELECT id FROM users WHERE email = 'john@tauos.org'), 'https://www.tauos.org', 'TauCore Homepage', 'Main TauCore website', 'Work', ARRAY['tauos', 'os', 'privacy'], true),
((SELECT id FROM users WHERE email = 'john@tauos.org'), 'https://github.com', 'GitHub', 'Code repository hosting', 'Development', ARRAY['git', 'code', 'development'], true),
((SELECT id FROM users WHERE email = 'john@tauos.org'), 'https://vercel.com', 'Vercel', 'Frontend deployment platform', 'Development', ARRAY['deployment', 'frontend', 'hosting'], false),
((SELECT id FROM users WHERE email = 'jane@tauos.org'), 'https://www.tauos.org/tauid', 'TauID', 'Identity management system', 'TauCore', ARRAY['identity', 'auth', 'tauos'], true),
((SELECT id FROM users WHERE email = 'jane@tauos.org'), 'https://www.tauos.org/taumail', 'TauMail', 'Secure email system', 'TauCore', ARRAY['email', 'security', 'tauos'], true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookmarks_updated_at BEFORE UPDATE ON user_bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'TauBrowser database schema created successfully!' as status;
