const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taumail',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function migrate() {
  try {
    console.log('🚀 Starting TauMail PostgreSQL migration...');

    // Create tables
    const createTables = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        recovery_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );

      -- Emails table
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id),
        recipient_id INTEGER NOT NULL REFERENCES users(id),
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        is_starred BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Email attachments table
      CREATE TABLE IF NOT EXISTS email_attachments (
        id SERIAL PRIMARY KEY,
        email_id INTEGER NOT NULL REFERENCES emails(id),
        filename VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_emails_sender_id ON emails(sender_id);
      CREATE INDEX IF NOT EXISTS idx_emails_recipient_id ON emails(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at);
      CREATE INDEX IF NOT EXISTS idx_emails_is_read ON emails(is_read);
      CREATE INDEX IF NOT EXISTS idx_emails_is_starred ON emails(is_starred);
    `;

    await pool.query(createTables);
    console.log('✅ Tables created successfully');

    // Insert sample data if tables are empty
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (userCount.rows[0].count === '0') {
      console.log('📧 Inserting sample data...');
      
      // Create sample users
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('password123', 12);
      
      await pool.query(`
        INSERT INTO users (username, email, password_hash, recovery_email) VALUES
        ('admin', 'admin@tauos.org', $1, 'admin@example.com'),
        ('testuser', 'testuser@tauos.org', $1, 'test@example.com')
      `, [passwordHash]);

      // Create sample emails
      await pool.query(`
        INSERT INTO emails (sender_id, recipient_id, subject, body) VALUES
        (1, 2, 'Welcome to TauMail!', 'Welcome to your new privacy-first email service.'),
        (2, 1, 'Test Email', 'This is a test email to verify the system is working.'),
        (1, 2, 'Security Update', 'Your account is now protected with AES-256 encryption.')
      `);

      console.log('✅ Sample data inserted');
    }

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate(); 