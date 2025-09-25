#!/usr/bin/env node

/**
 * TauCore™ Simple User Creator
 * Creates a simple user without role column
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function createSimpleUser() {
    try {
        console.log('👤 Creating Simple User');
        console.log('=======================');
        
        // Check if user already exists
        console.log('\n1️⃣ Checking for existing user...');
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        
        if (existingUser.rows.length > 0) {
            console.log(`✅ User already exists: ${existingUser.rows[0].full_name} (${existingUser.rows[0].email})`);
            return;
        }
        
        // Create user with minimal required fields
        console.log('\n2️⃣ Creating user...');
        const hashedPassword = await bcrypt.hash('Saleena@132', 12);
        
        const createUserResult = await pool.query(`
            INSERT INTO users (
                id, email, full_name, password_hash, 
                is_email_verified, is_active, 
                aud, username, email_confirmed_at,
                created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            RETURNING id, email, full_name
        `, [
            '00000000-0000-0000-0000-000000000001',
            'saleena@tauos.org',
            'Saleena Falcon',
            hashedPassword,
            true,
            true,
            'authenticated',
            'saleena',
            new Date()
        ]);
        
        const newUser = createUserResult.rows[0];
        console.log(`✅ User created: ${newUser.full_name} (${newUser.email})`);
        console.log(`   ID: ${newUser.id}`);
        
        // Verify the user was created
        console.log('\n3️⃣ Verifying user...');
        const verifyResult = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        const user = verifyResult.rows[0];
        
        console.log('\n📧 User Details:');
        console.log(`   Name: ${user.full_name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Aud: ${user.aud}`);
        console.log(`   Email Verified: ${user.is_email_verified}`);
        console.log(`   Active: ${user.is_active}`);
        console.log(`   Created: ${user.created_at}`);
        
        console.log('\n🎉 USER CREATED SUCCESSFULLY!');
        console.log('==============================');
        console.log('✅ User: saleena@tauos.org');
        console.log('✅ Password: Saleena@132');
        console.log('✅ Username: saleena');
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

createSimpleUser();
