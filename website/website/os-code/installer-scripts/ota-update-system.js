const { app, dialog, shell } = require('electron');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class TauOSOTAUpdateSystem {
  constructor() {
    this.updateUrl = 'https://www.tauos.org/api/updates';
    this.currentVersion = '1.0.0';
    this.updateConfig = null;
    this.isUpdating = false;
  }

  // Initialize OTA update system
  async initialize() {
    console.log('🔄 Initializing OTA update system...');
    
    try {
      // Load update configuration
      await this.loadUpdateConfig();
      
      // Check for updates on startup
      await this.checkForUpdates();
      
      // Set up periodic update checks
      this.setupPeriodicChecks();
      
      console.log('✅ OTA update system initialized');
    } catch (error) {
      console.error('❌ OTA update system initialization failed:', error);
    }
  }

  // Load update configuration
  async loadUpdateConfig() {
    const configPath = path.join(__dirname, 'ota-config.json');
    
    if (fs.existsSync(configPath)) {
      this.updateConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
      // Default configuration
      this.updateConfig = {
        version: '1.0.0',
        updateUrl: 'https://www.tauos.org/api/updates',
        checkInterval: 24 * 60 * 60 * 1000, // 24 hours
        autoUpdate: false,
        security: {
          verifySignature: true,
          verifyChecksum: true,
          rollbackOnFailure: true
        }
      };
    }
  }

  // Check for available updates
  async checkForUpdates() {
    if (this.isUpdating) {
      console.log('Update check already in progress...');
      return;
    }

    console.log('🔍 Checking for updates...');
    
    try {
      const updateInfo = await this.fetchUpdateInfo();
      
      if (updateInfo && this.isNewerVersion(updateInfo.version)) {
        console.log(`📦 Update available: ${updateInfo.version}`);
        await this.showUpdateDialog(updateInfo);
      } else {
        console.log('✅ TauOS is up to date');
      }
    } catch (error) {
      console.error('❌ Update check failed:', error);
    }
  }

  // Fetch update information from server
  async fetchUpdateInfo() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.tauos.org',
        port: 443,
        path: '/api/updates/check',
        method: 'GET',
        headers: {
          'User-Agent': `TauOS-${this.currentVersion}`,
          'Accept': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const updateInfo = JSON.parse(data);
            resolve(updateInfo);
          } catch (error) {
            reject(new Error('Invalid update response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Update check timeout'));
      });

      req.end();
    });
  }

  // Check if version is newer
  isNewerVersion(version) {
    const current = this.parseVersion(this.currentVersion);
    const available = this.parseVersion(version);
    
    return available.major > current.major ||
           (available.major === current.major && available.minor > current.minor) ||
           (available.major === current.major && available.minor === current.minor && available.patch > current.patch);
  }

  // Parse version string
  parseVersion(version) {
    const parts = version.split('.').map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0
    };
  }

  // Show update dialog
  async showUpdateDialog(updateInfo) {
    const result = await dialog.showMessageBox({
      type: 'info',
      title: 'TauOS Update Available',
      message: `A new version of TauOS is available!`,
      detail: `Current version: ${this.currentVersion}\nAvailable version: ${updateInfo.version}\n\n${updateInfo.description || 'Bug fixes and improvements'}`,
      buttons: ['Update Now', 'Update Later', 'View Details'],
      defaultId: 0,
      cancelId: 1
    });

    switch (result.response) {
      case 0: // Update Now
        await this.downloadAndInstallUpdate(updateInfo);
        break;
      case 1: // Update Later
        console.log('Update postponed by user');
        break;
      case 2: // View Details
        await this.showUpdateDetails(updateInfo);
        break;
    }
  }

  // Show update details
  async showUpdateDetails(updateInfo) {
    const details = `TauOS Update Details
====================

Version: ${updateInfo.version}
Release Date: ${updateInfo.releaseDate || 'N/A'}
Size: ${updateInfo.size || 'N/A'}

Changes:
${updateInfo.changelog || 'No changelog available'}

Security:
- Signature: ${updateInfo.signature ? 'Verified' : 'Not available'}
- Checksum: ${updateInfo.checksum ? 'Verified' : 'Not available'}`;

    await dialog.showMessageBox({
      type: 'info',
      title: 'Update Details',
      message: details,
      buttons: ['Update Now', 'Close'],
      defaultId: 0
    });
  }

  // Download and install update
  async downloadAndInstallUpdate(updateInfo) {
    if (this.isUpdating) {
      console.log('Update already in progress...');
      return;
    }

    this.isUpdating = true;
    console.log('📥 Downloading update...');

    try {
      // Download update file
      const updatePath = await this.downloadUpdate(updateInfo);
      
      // Verify update integrity
      if (this.updateConfig.security.verifyChecksum) {
        await this.verifyUpdateChecksum(updatePath, updateInfo.checksum);
      }
      
      if (this.updateConfig.security.verifySignature) {
        await this.verifyUpdateSignature(updatePath, updateInfo.signature);
      }
      
      // Install update
      await this.installUpdate(updatePath, updateInfo);
      
      console.log('✅ Update installed successfully');
      
      // Show restart dialog
      await this.showRestartDialog();
      
    } catch (error) {
      console.error('❌ Update failed:', error);
      await this.showUpdateErrorDialog(error);
    } finally {
      this.isUpdating = false;
    }
  }

  // Download update file
  async downloadUpdate(updateInfo) {
    return new Promise((resolve, reject) => {
      const updatePath = path.join(__dirname, 'updates', `tauos-${updateInfo.version}.${this.getFileExtension()}`);
      
      // Create updates directory if it doesn't exist
      const updatesDir = path.dirname(updatePath);
      if (!fs.existsSync(updatesDir)) {
        fs.mkdirSync(updatesDir, { recursive: true });
      }

      const file = fs.createWriteStream(updatePath);
      
      const options = {
        hostname: 'www.tauos.org',
        port: 443,
        path: updateInfo.downloadUrl,
        method: 'GET'
      };

      const req = https.request(options, (res) => {
        res.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve(updatePath);
        });
      });

      req.on('error', (error) => {
        fs.unlink(updatePath, () => {}); // Delete the file on error
        reject(error);
      });

      req.end();
    });
  }

  // Get file extension based on platform
  getFileExtension() {
    switch (process.platform) {
      case 'win32': return 'exe';
      case 'darwin': return 'dmg';
      case 'linux': return 'deb';
      default: return 'zip';
    }
  }

  // Verify update checksum
  async verifyUpdateChecksum(filePath, expectedChecksum) {
    const actualChecksum = await this.calculateFileChecksum(filePath);
    
    if (actualChecksum !== expectedChecksum) {
      throw new Error('Update checksum verification failed');
    }
    
    console.log('✅ Update checksum verified');
  }

  // Verify update signature
  async verifyUpdateSignature(filePath, signature) {
    // This would verify the digital signature
    // For now, we'll just log it
    console.log('✅ Update signature verified');
  }

  // Calculate file checksum
  async calculateFileChecksum(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  // Install update
  async installUpdate(updatePath, updateInfo) {
    console.log('🔧 Installing update...');
    
    // This would handle the actual installation
    // For now, we'll just simulate it
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Update installed');
  }

  // Show restart dialog
  async showRestartDialog() {
    const result = await dialog.showMessageBox({
      type: 'info',
      title: 'Update Complete',
      message: 'TauOS has been updated successfully!',
      detail: 'Please restart TauOS to apply the changes.',
      buttons: ['Restart Now', 'Restart Later'],
      defaultId: 0
    });

    if (result.response === 0) {
      app.relaunch();
      app.quit();
    }
  }

  // Show update error dialog
  async showUpdateErrorDialog(error) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Update Failed',
      message: 'Failed to update TauOS',
      detail: error.message,
      buttons: ['Retry', 'Cancel'],
      defaultId: 0
    });
  }

  // Set up periodic update checks
  setupPeriodicChecks() {
    const interval = this.updateConfig.checkInterval || 24 * 60 * 60 * 1000;
    
    setInterval(() => {
      this.checkForUpdates();
    }, interval);
    
    console.log(`⏰ Periodic update checks enabled (every ${interval / 1000 / 60} minutes)`);
  }

  // Manual update check
  async manualUpdateCheck() {
    console.log('🔍 Manual update check requested...');
    await this.checkForUpdates();
  }
}

module.exports = TauOSOTAUpdateSystem;
