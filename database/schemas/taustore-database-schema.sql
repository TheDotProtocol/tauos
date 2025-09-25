-- TauStore Database Schema for Supabase
-- Complete app marketplace with user management, payments, and app data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table (if not exists)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    storage_limit_gb INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for TauStore
CREATE TABLE IF NOT EXISTS taustore_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    date_of_birth DATE,
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES taustore_users(id) ON DELETE CASCADE,
    bio TEXT,
    website VARCHAR(500),
    social_links JSONB,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES taustore_users(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL, -- credit_card, paypal, apple_pay, google_pay
    provider VARCHAR(100) NOT NULL,
    provider_id VARCHAR(255),
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- App categories table
CREATE TABLE IF NOT EXISTS app_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    developer VARCHAR(255) NOT NULL,
    developer_email VARCHAR(255),
    developer_website VARCHAR(500),
    category_id UUID,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    icon_url VARCHAR(500),
    screenshots JSONB,
    version VARCHAR(20) DEFAULT '1.0.0',
    min_os_version VARCHAR(20),
    file_size_mb INTEGER,
    download_url VARCHAR(500),
    privacy_policy_url VARCHAR(500),
    terms_of_service_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- App reviews table
CREATE TABLE IF NOT EXISTS app_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES taustore_users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(app_id, user_id)
);

-- User downloads table
CREATE TABLE IF NOT EXISTS user_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES taustore_users(id) ON DELETE CASCADE,
    app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_purchased BOOLEAN DEFAULT false,
    purchase_price DECIMAL(10,2),
    UNIQUE(user_id, app_id)
);

-- User wishlist table
CREATE TABLE IF NOT EXISTS user_wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES taustore_users(id) ON DELETE CASCADE,
    app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, app_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES taustore_users(id) ON DELETE CASCADE,
    app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method_id UUID REFERENCES payment_methods(id),
    transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_provider VARCHAR(100),
    provider_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES taustore_users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    source VARCHAR(100) NOT NULL, -- download, review, purchase, referral
    source_id UUID, -- reference to the source (app_id, transaction_id, etc.)
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User points table
CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES taustore_users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    used_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Add foreign key constraints after all tables are created
-- First ensure the column exists, then add the constraint
ALTER TABLE apps ADD COLUMN IF NOT EXISTS category_id UUID;
ALTER TABLE apps ADD CONSTRAINT fk_apps_category FOREIGN KEY (category_id) REFERENCES app_categories(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_taustore_users_email ON taustore_users(email);
CREATE INDEX IF NOT EXISTS idx_taustore_users_username ON taustore_users(username);
CREATE INDEX IF NOT EXISTS idx_apps_category ON apps(category_id);
CREATE INDEX IF NOT EXISTS idx_apps_featured ON apps(featured);
CREATE INDEX IF NOT EXISTS idx_apps_rating ON apps(rating);
CREATE INDEX IF NOT EXISTS idx_apps_downloads ON apps(download_count);
CREATE INDEX IF NOT EXISTS idx_app_reviews_app ON app_reviews(app_id);
CREATE INDEX IF NOT EXISTS idx_app_reviews_user ON app_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_user_downloads_user ON user_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_downloads_app ON user_downloads(app_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user ON rewards(user_id);

-- Insert default organization
INSERT INTO organizations (id, name, domain, storage_limit_gb) 
VALUES (uuid_generate_v4(), 'TauOS', 'tauos.org', 1000)
ON CONFLICT (domain) DO NOTHING;

-- Insert app categories
INSERT INTO app_categories (name, slug, description, icon, color, sort_order) VALUES
('Productivity', 'productivity', 'Apps to boost your productivity', 'Briefcase', '#3B82F6', 1),
('Games', 'games', 'Entertainment and gaming apps', 'Gamepad2', '#EF4444', 2),
('Social Networking', 'social', 'Connect with friends and family', 'Users', '#8B5CF6', 3),
('Business', 'business', 'Professional business tools', 'Building2', '#10B981', 4),
('Finance', 'finance', 'Money management and banking', 'CreditCard', '#F59E0B', 5),
('Education', 'education', 'Learning and educational content', 'BookOpen', '#06B6D4', 6),
('Health & Fitness', 'health', 'Wellness and fitness tracking', 'Heart', '#EC4899', 7),
('Entertainment', 'entertainment', 'Media and entertainment', 'Play', '#84CC16', 8),
('Utilities', 'utilities', 'Essential utility apps', 'Settings', '#6B7280', 9),
('Lifestyle', 'lifestyle', 'Personal lifestyle apps', 'Home', '#F97316', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample popular apps
INSERT INTO apps (name, slug, description, long_description, developer, category_id, price, icon_url, rating, download_count, featured) 
SELECT 
    app_data.name,
    app_data.slug,
    app_data.description,
    app_data.long_description,
    app_data.developer,
    ac.id as category_id,
    app_data.price,
    app_data.icon_url,
    app_data.rating,
    app_data.download_count,
    app_data.featured
FROM (VALUES
    ('TauMail', 'taumail', 'Secure email client for TauOS', 'End-to-end encrypted email with zero telemetry', 'TauOS Team', 'productivity', 0.00, '/icons/taumail.png', 4.8, 50000, true),
    ('TauCloud', 'taucloud', 'Secure cloud storage', 'Private file storage and sharing', 'TauOS Team', 'productivity', 0.00, '/icons/taucloud.png', 4.7, 45000, true),
    ('TauID', 'tauid', 'Decentralized identity management', 'Self-sovereign identity solution', 'TauOS Team', 'productivity', 0.00, '/icons/tauid.png', 4.6, 30000, true),
    ('WhatsApp', 'whatsapp', 'Messaging and video calls', 'Connect with friends and family worldwide', 'Meta', 'social', 0.00, '/icons/whatsapp.png', 4.2, 5000000000, false),
    ('Instagram', 'instagram', 'Photo and video sharing', 'Share your life through photos and videos', 'Meta', 'social', 0.00, '/icons/instagram.png', 4.1, 2000000000, false),
    ('TikTok', 'tiktok', 'Short-form video content', 'Discover and create short videos', 'ByteDance', 'entertainment', 0.00, '/icons/tiktok.png', 4.0, 3000000000, false),
    ('Spotify', 'spotify', 'Music streaming service', 'Listen to millions of songs and podcasts', 'Spotify', 'entertainment', 0.00, '/icons/spotify.png', 4.3, 1000000000, false),
    ('Netflix', 'netflix', 'Streaming entertainment', 'Watch movies and TV shows', 'Netflix', 'entertainment', 9.99, '/icons/netflix.png', 4.4, 500000000, false),
    ('Microsoft Office', 'microsoft-office', 'Productivity suite', 'Word, Excel, PowerPoint and more', 'Microsoft', 'productivity', 6.99, '/icons/office.png', 4.5, 1000000000, false),
    ('Adobe Photoshop', 'photoshop', 'Photo editing software', 'Professional image editing tools', 'Adobe', 'productivity', 20.99, '/icons/photoshop.png', 4.6, 100000000, false),
    ('Uber', 'uber', 'Ride sharing service', 'Get a ride anywhere, anytime', 'Uber', 'lifestyle', 0.00, '/icons/uber.png', 4.1, 500000000, false),
    ('Airbnb', 'airbnb', 'Travel accommodation', 'Find unique places to stay', 'Airbnb', 'lifestyle', 0.00, '/icons/airbnb.png', 4.2, 200000000, false),
    ('Bank of America', 'bank-of-america', 'Mobile banking', 'Manage your finances on the go', 'Bank of America', 'finance', 0.00, '/icons/bofa.png', 3.8, 100000000, false),
    ('PayPal', 'paypal', 'Digital wallet', 'Send and receive money securely', 'PayPal', 'finance', 0.00, '/icons/paypal.png', 4.0, 500000000, false),
    ('Duolingo', 'duolingo', 'Language learning', 'Learn languages for free', 'Duolingo', 'education', 0.00, '/icons/duolingo.png', 4.7, 200000000, false),
    ('Khan Academy', 'khan-academy', 'Free online education', 'Learn anything for free', 'Khan Academy', 'education', 0.00, '/icons/khan.png', 4.8, 100000000, false),
    ('MyFitnessPal', 'myfitnesspal', 'Fitness tracking', 'Track your health and fitness', 'Under Armour', 'health', 0.00, '/icons/myfitnesspal.png', 4.3, 100000000, false),
    ('Headspace', 'headspace', 'Meditation and mindfulness', 'Meditation made simple', 'Headspace', 'health', 12.99, '/icons/headspace.png', 4.6, 50000000, false),
    ('Minecraft', 'minecraft', 'Creative building game', 'Build, explore, and survive', 'Mojang', 'games', 6.99, '/icons/minecraft.png', 4.7, 500000000, false),
    ('Among Us', 'among-us', 'Social deduction game', 'Find the impostor among your crew', 'InnerSloth', 'games', 4.99, '/icons/amongus.png', 4.2, 200000000, false)
) AS app_data(name, slug, description, long_description, developer, category_slug, price, icon_url, rating, download_count, featured)
JOIN app_categories ac ON ac.slug = app_data.category_slug
ON CONFLICT (slug) DO NOTHING;
