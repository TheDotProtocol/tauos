const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taucloud',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function migrate() {
  try {
    console.log('🚀 Starting TauCloud PostgreSQL migration...');

    // Create tables
    const createTables = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        recovery_email VARCHAR(255),
        storage_used BIGINT DEFAULT 0,
        storage_limit BIGINT DEFAULT 10737418240, -- 10GB in bytes
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );

      -- Files table
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        original_name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        file_size BIGINT NOT NULL,
        mime_type VARCHAR(100),
        file_type VARCHAR(50),
        parent_folder_id INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Folders table
      CREATE TABLE IF NOT EXISTS folders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        parent_folder_id INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
      CREATE INDEX IF NOT EXISTS idx_files_file_type ON files(file_type);
      CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
      CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
    `;

    await pool.query(createTables);
    console.log('✅ Tables created successfully');

    // Insert sample data if tables are empty
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (userCount.rows[0].count === '0') {
      console.log('☁️ Inserting sample data...');
      
      // Create sample users
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('password123', 12);
      
      await pool.query(`
        INSERT INTO users (username, email, password_hash, recovery_email, storage_used) VALUES
        ('admin', 'admin@tauos.org', $1, 'admin@example.com', 0),
        ('testuser', 'testuser@tauos.org', $1, 'test@example.com', 0)
      `, [passwordHash]);

      // Create sample folders
      await pool.query(`
        INSERT INTO folders (user_id, name, parent_folder_id) VALUES
        (1, 'Documents', 0),
        (1, 'Pictures', 0),
        (1, 'Music', 0),
        (2, 'Work', 0),
        (2, 'Personal', 0)
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