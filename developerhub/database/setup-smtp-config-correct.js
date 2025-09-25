#!/usr/bin/env node

/**
 * TauCore™ SMTP Configuration Setup - Correct Schema
 * Sets up SMTP configuration with the correct column names
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function setupSMTPConfigCorrect() {
    try {
        console.log('📧 Setting up SMTP Configuration (Correct Schema)');
        console.log('================================================');
        
        // Check existing data
        console.log('\n1️⃣ Checking existing data...');
        const existingOrgs = await pool.query('SELECT COUNT(*) as count FROM organizations');
        const existingDomains = await pool.query('SELECT COUNT(*) as count FROM email_domains');
        const existingSMTP = await pool.query('SELECT COUNT(*) as count FROM smtp_servers');
        
        console.log(`✅ Organizations: ${existingOrgs.rows[0].count}`);
        console.log(`✅ Email domains: ${existingDomains.rows[0].count}`);
        console.log(`✅ SMTP servers: ${existingSMTP.rows[0].count}`);
        
        // Create organization if it doesn't exist
        if (existingOrgs.rows[0].count === 0) {
            console.log('\n2️⃣ Creating TauOS organization...');
            await pool.query(`
                INSERT INTO organizations (id, name, domain, plan, max_users, storage_quota_bytes, email_quota_daily, is_active, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            `, [
                '00000000-0000-0000-0000-000000000001',
                'TauOS',
                'tauos.org',
                'enterprise',
                1000000,
                1000000000000, // 1TB
                10000, // 10k emails per day
                true
            ]);
            console.log('✅ TauOS organization created');
        }
        
        // Create email domain
        console.log('\n3️⃣ Creating email domain...');
        await pool.query(`
            INSERT INTO email_domains (id, domain, organization_id, is_verified, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            ON CONFLICT (domain) DO UPDATE SET
                organization_id = EXCLUDED.organization_id,
                is_verified = EXCLUDED.is_verified,
                updated_at = NOW()
        `, [
            '00000000-0000-0000-0000-000000000001',
            'tauos.org',
            '00000000-0000-0000-0000-000000000001',
            true
        ]);
        console.log('✅ Email domain tauos.org created');
        
        // Create SMTP server
        console.log('\n4️⃣ Creating SMTP server...');
        await pool.query(`
            INSERT INTO smtp_servers (id, organization_id, name, host, port, username, password_encrypted, use_tls, use_ssl, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
            ON CONFLICT (organization_id, name) DO UPDATE SET
                host = EXCLUDED.host,
                port = EXCLUDED.port,
                username = EXCLUDED.username,
                password_encrypted = EXCLUDED.password_encrypted,
                use_tls = EXCLUDED.use_tls,
                use_ssl = EXCLUDED.use_ssl,
                is_active = EXCLUDED.is_active,
                updated_at = NOW()
        `, [
            '00000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000001',
            'TauOS SMTP Server',
            '136.244.83.147',
            587,
            'admin@tauos.org',
            'TauOS@132', // In production, this should be encrypted
            true,
            false,
            true
        ]);
        console.log('✅ SMTP server created');
        
        // Verify configuration
        console.log('\n5️⃣ Verifying configuration...');
        const smtpResult = await pool.query(`
            SELECT s.*, ed.domain 
            FROM smtp_servers s
            LEFT JOIN email_domains ed ON s.organization_id = ed.organization_id
            WHERE s.is_active = TRUE
            LIMIT 1
        `);
        
        if (smtpResult.rows.length > 0) {
            const smtpServer = smtpResult.rows[0];
            console.log('\n📧 SMTP Configuration:');
            console.log(`   Name: ${smtpServer.name}`);
            console.log(`   Host: ${smtpServer.host}`);
            console.log(`   Port: ${smtpServer.port}`);
            console.log(`   Username: ${smtpServer.username}`);
            console.log(`   Use TLS: ${smtpServer.use_tls}`);
            console.log(`   Use SSL: ${smtpServer.use_ssl}`);
            console.log(`   Active: ${smtpServer.is_active}`);
            console.log(`   Domain: ${smtpServer.domain}`);
        }
        
        // Test email quota function
        console.log('\n6️⃣ Testing email quota function...');
        try {
            const quotaResult = await pool.query('SELECT check_email_quota($1)', ['00000000-0000-0000-0000-000000000001']);
            const canSend = quotaResult.rows[0].check_email_quota;
            console.log(`✅ Email quota check: ${canSend ? 'Can send' : 'Quota exceeded'}`);
        } catch (error) {
            console.log(`⚠️  Email quota function not available: ${error.message}`);
        }
        
        console.log('\n🎉 SMTP CONFIGURATION SETUP COMPLETE!');
        console.log('=====================================');
        console.log('✅ Organization: TauOS');
        console.log('✅ Email domain: tauos.org');
        console.log('✅ SMTP server: 136.244.83.147:587');
        console.log('✅ Username: admin@tauos.org');
        console.log('✅ TLS enabled: true');
        console.log('✅ Ready for email testing');
        
    } catch (error) {
        console.error('❌ SMTP configuration setup failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupSMTPConfigCorrect();
