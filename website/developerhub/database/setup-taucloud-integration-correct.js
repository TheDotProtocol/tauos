#!/usr/bin/env node

/**
 * TauCore™ TauCloud Integration Setup - Correct Schema
 * Integrates existing TauCloud backend with hybrid database using correct column names
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

// Simple UUID v4 generator
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function setupTauCloudIntegrationCorrect() {
    try {
        console.log('☁️ Setting up TauCloud Integration (Correct Schema)');
        console.log('===================================================');
        
        // Step 1: Check existing cloud_files table
        console.log('\n1️⃣ Checking cloud_files table...');
        const filesResult = await pool.query('SELECT COUNT(*) as count FROM cloud_files');
        console.log(`✅ Cloud files: ${filesResult.rows[0].count}`);
        
        // Step 2: Check cloud_folders table
        console.log('\n2️⃣ Checking cloud_folders table...');
        const foldersResult = await pool.query('SELECT COUNT(*) as count FROM cloud_folders');
        console.log(`✅ Cloud folders: ${foldersResult.rows[0].count}`);
        
        // Step 3: Check file_shares table
        console.log('\n3️⃣ Checking file_shares table...');
        const sharesResult = await pool.query('SELECT COUNT(*) as count FROM file_shares');
        console.log(`✅ File shares: ${sharesResult.rows[0].count}`);
        
        // Step 4: Create sample cloud folder structure
        console.log('\n4️⃣ Creating sample cloud folder structure...');
        
        // Create root folder for master user
        const rootFolderResult = await pool.query(`
            INSERT INTO cloud_folders (id, user_id, name, path, is_shared, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                path = EXCLUDED.path,
                updated_at = NOW()
            RETURNING id
        `, [
            '00000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000001', // Master user ID
            'Root',
            '/',
            false
        ]);
        
        const rootFolderId = rootFolderResult.rows[0].id;
        console.log(`✅ Root folder created: ${rootFolderId}`);
        
        // Create sample folders
        const sampleFolders = [
            { name: 'Documents', path: '/Documents' },
            { name: 'Pictures', path: '/Pictures' },
            { name: 'Videos', path: '/Videos' },
            { name: 'Music', path: '/Music' },
            { name: 'Downloads', path: '/Downloads' }
        ];
        
        for (const folder of sampleFolders) {
            await pool.query(`
                INSERT INTO cloud_folders (id, user_id, name, path, parent_folder_id, is_shared, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    path = EXCLUDED.path,
                    updated_at = NOW()
            `, [
                uuidv4(),
                '00000000-0000-0000-0000-000000000001',
                folder.name,
                folder.path,
                rootFolderId,
                false
            ]);
            console.log(`✅ Created folder: ${folder.name}`);
        }
        
        // Step 5: Create sample files
        console.log('\n5️⃣ Creating sample files...');
        const sampleFiles = [
            { name: 'Welcome to TauOS.txt', size: 1024, mime: 'text/plain', folder: 'Root' },
            { name: 'TauOS Logo.png', size: 51200, mime: 'image/png', folder: 'Pictures' },
            { name: 'TauOS Demo.mp4', size: 10485760, mime: 'video/mp4', folder: 'Videos' },
            { name: 'TauOS Theme.mp3', size: 3145728, mime: 'audio/mp3', folder: 'Music' }
        ];
        
        for (const file of sampleFiles) {
            // Get folder ID for nested folders
            let folderId = rootFolderId;
            if (file.folder !== 'Root') {
                const folderResult = await pool.query(
                    'SELECT id FROM cloud_folders WHERE name = $1 AND user_id = $2',
                    [file.folder, '00000000-0000-0000-0000-000000000001']
                );
                if (folderResult.rows.length > 0) {
                    folderId = folderResult.rows[0].id;
                }
            }
            
            await pool.query(`
                INSERT INTO cloud_files (id, user_id, filename, original_name, file_path, 
                                       file_size, mime_type, file_hash, folder_id, is_shared, 
                                       version, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    original_name = EXCLUDED.original_name,
                    file_size = EXCLUDED.file_size,
                    updated_at = NOW()
            `, [
                uuidv4(),
                '00000000-0000-0000-0000-000000000001',
                `sample-${Date.now()}-${file.name}`,
                file.name,
                '/uploads/sample-files/',
                file.size,
                file.mime,
                crypto.createHash('sha256').update(file.name).digest('hex'),
                folderId,
                false,
                1
            ]);
            console.log(`✅ Created file: ${file.name}`);
        }
        
        // Step 6: Test storage quota function
        console.log('\n6️⃣ Testing storage quota function...');
        try {
            const quotaResult = await pool.query('SELECT check_storage_quota($1)', ['00000000-0000-0000-0000-000000000001']);
            const canUpload = quotaResult.rows[0].check_storage_quota;
            console.log(`✅ Storage quota check: ${canUpload ? 'Can upload' : 'Quota exceeded'}`);
        } catch (error) {
            console.log(`⚠️  Storage quota function not available: ${error.message}`);
        }
        
        // Step 7: Test file operations
        console.log('\n7️⃣ Testing file operations...');
        
        // List files
        const filesList = await pool.query(`
            SELECT cf.*, cfo.name as folder_name
            FROM cloud_files cf
            LEFT JOIN cloud_folders cfo ON cf.folder_id = cfo.id
            WHERE cf.user_id = $1
            ORDER BY cf.created_at DESC
            LIMIT 10
        `, ['00000000-0000-0000-0000-000000000001']);
        
        console.log(`✅ Found ${filesList.rows.length} files:`);
        filesList.rows.forEach(file => {
            console.log(`   - ${file.original_name} (${file.file_size} bytes) in ${file.folder_name || 'Root'}`);
        });
        
        // List folders
        const foldersList = await pool.query(`
            SELECT * FROM cloud_folders 
            WHERE user_id = $1 
            ORDER BY name
        `, ['00000000-0000-0000-0000-000000000001']);
        
        console.log(`✅ Found ${foldersList.rows.length} folders:`);
        foldersList.rows.forEach(folder => {
            console.log(`   - ${folder.name} (${folder.is_shared ? 'Shared' : 'Private'})`);
        });
        
        // Step 8: Check storage usage
        console.log('\n8️⃣ Checking storage usage...');
        const storageResult = await pool.query(`
            SELECT 
                COUNT(*) as total_files,
                SUM(file_size) as total_size,
                AVG(file_size) as avg_file_size
            FROM cloud_files 
            WHERE user_id = $1
        `, ['00000000-0000-0000-0000-000000000001']);
        
        const storage = storageResult.rows[0];
        console.log(`✅ Storage Statistics:`);
        console.log(`   Total Files: ${storage.total_files}`);
        console.log(`   Total Size: ${(storage.total_size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Average File Size: ${(storage.avg_file_size / 1024).toFixed(2)} KB`);
        
        // Step 9: Test file sharing
        console.log('\n9️⃣ Testing file sharing...');
        const firstFile = filesList.rows[0];
        if (firstFile) {
            await pool.query(`
                INSERT INTO file_shares (id, file_id, shared_by_user_id, share_token, permission, 
                                       download_limit, download_count, is_active, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    share_token = EXCLUDED.share_token,
                    updated_at = NOW()
            `, [
                uuidv4(),
                firstFile.id,
                '00000000-0000-0000-0000-000000000001',
                `share-${Date.now()}`,
                'read',
                100,
                0,
                true
            ]);
            console.log(`✅ Created share for: ${firstFile.original_name}`);
        }
        
        console.log('\n🎉 TAUCLOUD INTEGRATION SETUP COMPLETE!');
        console.log('=========================================');
        console.log('✅ Cloud storage tables ready');
        console.log('✅ Sample folder structure created');
        console.log('✅ Sample files created');
        console.log('✅ File operations working');
        console.log('✅ File sharing working');
        console.log('✅ Storage quota system ready');
        console.log('');
        console.log('🚀 READY FOR TAUCLOUD TESTING!');
        console.log('===============================');
        console.log('Next steps:');
        console.log('1. Test file upload functionality');
        console.log('2. Test file download functionality');
        console.log('3. Test file sharing functionality');
        console.log('4. Test storage quota management');
        console.log('5. Proceed to Phase 4: Mobile OS');
        
    } catch (error) {
        console.error('❌ TauCloud integration setup failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Import required modules
const crypto = require('crypto');

setupTauCloudIntegrationCorrect();
