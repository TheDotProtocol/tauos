#!/usr/bin/env node

/**
 * TauCore™ User Creator with Username
 * Creates a user with username field
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function createUserWithUsername() {
    try {
        console.log('👤 Creating User with Username');
        console.log('==============================');
        
        // Check if user already exists
        console.log('\n1️⃣ Checking for existing user...');
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        
        if (existingUser.rows.length > 0) {
            console.log(`✅ User already exists: ${existingUser.rows[0].full_name} (${existingUser.rows[0].email})`);
            return;
        }
        
        // Create user with username field
        console.log('\n2️⃣ Creating user with username...');
        const hashedPassword = await bcrypt.hash('Saleena@132', 12);
        
        const createUserResult = await pool.query(`
            INSERT INTO users (
                id, email, full_name, password_hash, username,
                is_email_verified, is_active,
                created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            RETURNING id, email, full_name, username
        `, [
            '00000000-0000-0000-0000-000000000001',
            'saleena@tauos.org',
            'Saleena Falcon',
            hashedPassword,
            'saleena',
            true,
            true
        ]);
        
        const newUser = createUserResult.rows[0];
        console.log(`✅ User created: ${newUser.full_name} (${newUser.email})`);
        console.log(`   ID: ${newUser.id}`);
        console.log(`   Username: ${newUser.username}`);
        
        // Verify the user was created
        console.log('\n3️⃣ Verifying user...');
        const verifyResult = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        const user = verifyResult.rows[0];
        
        console.log('\n📧 User Details:');
        console.log(`   Name: ${user.full_name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email Verified: ${user.is_email_verified}`);
        console.log(`   Active: ${user.is_active}`);
        console.log(`   Created: ${user.created_at}`);
        
        console.log('\n🎉 USER CREATED SUCCESSFULLY!');
        console.log('=====================================');
        console.log('✅ User: saleena@tauos.org');
        console.log('✅ Username: saleena');
        console.log('✅ Password: Saleena@132');
        console.log('✅ Email verified: true');
        console.log('✅ Ready for email flow testing');
        
    } catch (error) {
        console.error('❌ User creation failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createUserWithUsername();
