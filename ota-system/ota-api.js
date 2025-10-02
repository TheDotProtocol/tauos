// TauOS OTA Update API
// Handles update checks, downloads, and verification

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Update database (in production, use real database)
const updates = {
    '1.0.0': {
        version: '1.0.1',
        available: true,
        size: '15.2MB',
        description: 'Security patches and performance improvements',
        changelog: [
            'Fixed security vulnerability in kernel module',
            'Improved Wi-Fi driver compatibility',
            'Enhanced desktop performance',
            'Updated TauScript runtime'
        ],
        checksum: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
        download_url: '/ota/download/1.0.1'
    },
    '1.0.1': {
        version: '1.0.2',
        available: true,
        size: '12.8MB',
        description: 'Bug fixes and new features',
        changelog: [
            'Fixed installation wizard language detection',
            'Added support for ARM64 devices',
            'Improved TauMail performance',
            'Enhanced security hardening'
        ],
        checksum: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
        download_url: '/ota/download/1.0.2'
    }
};

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Check for updates
app.get('/ota/check', (req, res) => {
    const currentVersion = req.query.version || '1.0.0';
    const updateInfo = updates[currentVersion];
    
    if (updateInfo && updateInfo.available) {
        res.json({
            update_available: true,
            version: updateInfo.version,
            size: updateInfo.size,
            description: updateInfo.description,
            changelog: updateInfo.changelog,
            download_url: updateInfo.download_url
        });
    } else {
        res.json({
            update_available: false,
            message: 'No updates available'
        });
    }
});

// Get update checksum
app.get('/ota/checksum/:version', (req, res) => {
    const version = req.params.version;
    const updateInfo = updates[version];
    
    if (updateInfo) {
        res.json({
            checksum: updateInfo.checksum
        });
    } else {
        res.status(404).json({
            error: 'Update not found'
        });
    }
});

// Download update
app.get('/ota/download/:version', (req, res) => {
    const version = req.params.version;
    const updateInfo = updates[version];
    
    if (updateInfo) {
        // In production, serve actual update files
        // For now, create a mock update package
        const mockUpdate = createMockUpdate(version);
        
        res.setHeader('Content-Type', 'application/gzip');
        res.setHeader('Content-Disposition', `attachment; filename="tauos-update-${version}.tar.gz"`);
        res.send(mockUpdate);
    } else {
        res.status(404).json({
            error: 'Update not found'
        });
    }
});

// Create mock update package
function createMockUpdate(version) {
    // In production, this would be a real update package
    // For now, return a mock gzipped tar file
    const mockContent = `TauOS Update ${version}
This is a mock update package for testing.
In production, this would contain actual system updates.`;
    
    return Buffer.from(mockContent);
}

// Update status endpoint
app.get('/ota/status', (req, res) => {
    res.json({
        service: 'TauOS OTA Update Service',
        version: '1.0.0',
        status: 'operational',
        last_check: new Date().toISOString(),
        updates_available: Object.keys(updates).length
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🔄 TauOS OTA Update API running on port ${PORT}`);
    console.log(`🌐 Update check: http://localhost:${PORT}/ota/check?version=1.0.0`);
    console.log(`📦 Download: http://localhost:${PORT}/ota/download/1.0.1`);
    console.log(`🔍 Status: http://localhost:${PORT}/ota/status`);
});

module.exports = app;
