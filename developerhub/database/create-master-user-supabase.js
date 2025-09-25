#!/usr/bin/env node

/**
 * TauCore™ Master User Creator - Supabase Format
 * Creates the master user with the Supabase auth schema
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function createMasterUserSupabase() {
    try {
        console.log('👤 Creating Master User (Supabase Format)');
        console.log('==========================================');
        
        // Check if master user already exists
        console.log('\n1️⃣ Checking for existing master user...');
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        
        if (existingUser.rows.length > 0) {
            console.log(`✅ Master user already exists: ${existingUser.rows[0].full_name} (${existingUser.rows[0].email})`);
            return;
        }
        
        // Create master user with Supabase format
        console.log('\n2️⃣ Creating master user...');
        const hashedPassword = await bcrypt.hash('Saleena@132', 12);
        
        const createUserResult = await pool.query(`
            INSERT INTO users (
                id, email, full_name, password_hash, 
                is_email_verified, role, is_active, 
                aud, username, email_confirmed_at,
                created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
            RETURNING id, email, full_name, role
        `, [
            '00000000-0000-0000-0000-000000000001',
            'saleena@tauos.org',
            'Saleena Falcon',
            hashedPassword,
            true,
            'admin',
            true,
            'authenticated',
            'saleena',
            new Date()
        ]);
        
        const newUser = createUserResult.rows[0];
        console.log(`✅ Master user created: ${newUser.full_name} (${newUser.email})`);
        console.log(`   ID: ${newUser.id}`);
        console.log(`   Role: ${newUser.role}`);
        console.log(`   Username: saleena`);
        console.log(`   Aud: authenticated`);
        
        // Verify the user was created
        console.log('\n3️⃣ Verifying master user...');
        const verifyResult = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        const masterUser = verifyResult.rows[0];
        
        console.log('\n📧 Master User Details:');
        console.log(`   Name: ${masterUser.full_name}`);
        console.log(`   Email: ${masterUser.email}`);
        console.log(`   Username: ${masterUser.username}`);
        console.log(`   Role: ${masterUser.role}`);
        console.log(`   Aud: ${masterUser.aud}`);
        console.log(`   Email Verified: ${masterUser.is_email_verified}`);
        console.log(`   Active: ${masterUser.is_active}`);
        console.log(`   Created: ${masterUser.created_at}`);
        
        console.log('\n🎉 MASTER USER CREATED SUCCESSFULLY!');
        console.log('=====================================');
        console.log('✅ Master user: saleena@tauos.org');
        console.log('✅ Password: Saleena@132');
        console.log('✅ Role: admin');
        console.log('✅ Username: saleena');
        console.log('✅ Email verified: true');
        console.log('✅ Ready for email flow testing');
        
    } catch (error) {
        console.error('❌ Master user creation failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createMasterUserSupabase();
