#!/usr/bin/env node

/**
 * TauCore™ TauCloud Storage Setup
 * Sets up cloud storage configuration and tests file operations
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function setupTauCloudStorage() {
    try {
        console.log('☁️ Setting up TauCloud Storage System');
        console.log('=====================================');
        
        // Step 1: Check existing cloud storage configuration
        console.log('\n1️⃣ Checking existing cloud storage...');
        const existingFiles = await pool.query('SELECT COUNT(*) as count FROM cloud_files');
        const existingFolders = await pool.query('SELECT COUNT(*) as count FROM cloud_folders');
        const existingShares = await pool.query('SELECT COUNT(*) as count FROM file_shares');
        
        console.log(`✅ Cloud files: ${existingFiles.rows[0].count}`);
        console.log(`✅ Cloud folders: ${existingFolders.rows[0].count}`);
        console.log(`✅ File shares: ${existingShares.rows[0].count}`);
        
        // Step 2: Create root folder for master user
        console.log('\n2️⃣ Creating root folder for master user...');
        const rootFolderResult = await pool.query(`
            INSERT INTO cloud_folders (id, user_id, name, parent_folder_id, is_root, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                is_root = EXCLUDED.is_root,
                updated_at = NOW()
            RETURNING id, name, is_root
        `, [
            '00000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000001',
            'Root',
            null,
            true
        ]);
        
        const rootFolder = rootFolderResult.rows[0];
        console.log(`✅ Root folder created: ${rootFolder.name} (ID: ${rootFolder.id})`);
        
        // Step 3: Create sample folders
        console.log('\n3️⃣ Creating sample folders...');
        const sampleFolders = [
            { name: 'Documents', description: 'Personal documents and files' },
            { name: 'Pictures', description: 'Photos and images' },
            { name: 'Videos', description: 'Video files and recordings' },
            { name: 'Music', description: 'Audio files and music' },
            { name: 'Downloads', description: 'Downloaded files' },
            { name: 'TauOS Projects', description: 'TauOS development files' }
        ];
        
        for (let i = 0; i < sampleFolders.length; i++) {
            const folder = sampleFolders[i];
            const folderId = `00000000-0000-0000-0000-00000000000${i + 2}`;
            
            await pool.query(`
                INSERT INTO cloud_folders (id, user_id, name, parent_folder_id, description, is_root, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    updated_at = NOW()
            `, [
                folderId,
                '00000000-0000-0000-0000-000000000001',
                folder.name,
                '00000000-0000-0000-0000-000000000001',
                folder.description,
                false
            ]);
            
            console.log(`   ✅ Created folder: ${folder.name}`);
        }
        
        // Step 4: Create sample files
        console.log('\n4️⃣ Creating sample files...');
        const sampleFiles = [
            { name: 'welcome.txt', content: 'Welcome to TauOS! This is your personal cloud storage.', folder: 'Documents' },
            { name: 'tauos-logo.png', content: 'TauOS Logo Image', folder: 'Pictures' },
            { name: 'project-overview.md', content: '# TauOS Project Overview\n\nThis is the comprehensive overview of the TauOS project.', folder: 'TauOS Projects' },
            { name: 'readme.txt', content: 'TauOS Cloud Storage\n\nThis is your personal cloud storage system.', folder: 'Root' }
        ];
        
        for (let i = 0; i < sampleFiles.length; i++) {
            const file = sampleFiles[i];
            const fileId = `00000000-0000-0000-0000-00000000000${i + 10}`;
            
            // Find folder ID
            let folderId = '00000000-0000-0000-0000-000000000001'; // Root folder
            if (file.folder !== 'Root') {
                const folderResult = await pool.query('SELECT id FROM cloud_folders WHERE name = $1 AND user_id = $2', [file.folder, '00000000-0000-0000-0000-000000000001']);
                if (folderResult.rows.length > 0) {
                    folderId = folderResult.rows[0].id;
                }
            }
            
            await pool.query(`
                INSERT INTO cloud_files (id, user_id, filename, original_filename, file_path, file_size, mime_type, folder_id, is_public, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    filename = EXCLUDED.filename,
                    file_size = EXCLUDED.file_size,
                    updated_at = NOW()
            `, [
                fileId,
                '00000000-0000-0000-0000-000000000001',
                file.name,
                file.name,
                `/uploads/${file.name}`,
                Buffer.byteLength(file.content, 'utf8'),
                file.name.endsWith('.txt') ? 'text/plain' : file.name.endsWith('.png') ? 'image/png' : 'text/markdown',
                folderId,
                false
            ]);
            
            console.log(`   ✅ Created file: ${file.name} in ${file.folder}`);
        }
        
        // Step 5: Create file shares
        console.log('\n5️⃣ Creating file shares...');
        const shareResult = await pool.query(`
            INSERT INTO file_shares (id, file_id, user_id, share_token, is_public, expires_at, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING id, share_token
        `, [
            '00000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000010', // welcome.txt
            '00000000-0000-0000-0000-000000000001',
            'tauos-welcome-share-2025',
            true,
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        ]);
        
        const share = shareResult.rows[0];
        console.log(`✅ File share created: ${share.share_token}`);
        
        // Step 6: Test storage quota
        console.log('\n6️⃣ Testing storage quota...');
        const quotaResult = await pool.query('SELECT check_storage_quota($1)', ['00000000-0000-0000-0000-000000000001']);
        const canUpload = quotaResult.rows[0].check_storage_quota;
        console.log(`✅ Storage quota check: ${canUpload ? 'Can upload' : 'Quota exceeded'}`);
        
        // Step 7: Get storage statistics
        console.log('\n7️⃣ Getting storage statistics...');
        const statsResult = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM cloud_files WHERE user_id = $1) as total_files,
                (SELECT COUNT(*) FROM cloud_folders WHERE user_id = $1) as total_folders,
                (SELECT SUM(file_size) FROM cloud_files WHERE user_id = $1) as total_size,
                (SELECT COUNT(*) FROM file_shares WHERE user_id = $1) as total_shares
        `, ['00000000-0000-0000-0000-000000000001']);
        
        const stats = statsResult.rows[0];
        console.log('\n📊 Storage Statistics:');
        console.log(`   Total Files: ${stats.total_files}`);
        console.log(`   Total Folders: ${stats.total_folders}`);
        console.log(`   Total Size: ${stats.total_size} bytes`);
        console.log(`   Total Shares: ${stats.total_shares}`);
        
        // Step 8: Test file operations
        console.log('\n8️⃣ Testing file operations...');
        
        // Test file listing
        const filesResult = await pool.query('SELECT * FROM cloud_files WHERE user_id = $1 ORDER BY created_at DESC', ['00000000-0000-0000-0000-000000000001']);
        console.log(`✅ Files found: ${filesResult.rows.length}`);
        filesResult.rows.forEach(file => {
            console.log(`   - ${file.filename} (${file.file_size} bytes, ${file.mime_type})`);
        });
        
        // Test folder listing
        const foldersResult = await pool.query('SELECT * FROM cloud_folders WHERE user_id = $1 ORDER BY name', ['00000000-0000-0000-0000-000000000001']);
        console.log(`✅ Folders found: ${foldersResult.rows.length}`);
        foldersResult.rows.forEach(folder => {
            console.log(`   - ${folder.name} (${folder.is_root ? 'Root' : 'Subfolder'})`);
        });
        
        console.log('\n🎉 TAUCLOUD STORAGE SETUP COMPLETE!');
        console.log('=====================================');
        console.log('✅ Root folder created');
        console.log('✅ Sample folders created');
        console.log('✅ Sample files created');
        console.log('✅ File sharing configured');
        console.log('✅ Storage quota working');
        console.log('✅ File operations working');
        console.log('');
        console.log('☁️ TAUCLOUD READY FOR INTEGRATION!');
        console.log('==================================');
        console.log('Next steps:');
        console.log('1. Implement file upload/download API');
        console.log('2. Implement file sharing functionality');
        console.log('3. Implement storage quota management');
        console.log('4. Test with TauMail attachments');
        
    } catch (error) {
        console.error('❌ TauCloud storage setup failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupTauCloudStorage();
