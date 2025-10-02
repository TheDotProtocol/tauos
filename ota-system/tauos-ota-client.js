// TauOS OTA Update Client
// Handles client-side update checking and notifications

class TauOSOTA {
    constructor() {
        this.apiUrl = 'https://api.tauos.org/ota';
        this.checkInterval = 24 * 60 * 60 * 1000; // 24 hours
        this.lastCheck = localStorage.getItem('tauos_last_update_check');
        this.updateAvailable = false;
        this.currentVersion = this.getCurrentVersion();
    }

    // Get current system version
    getCurrentVersion() {
        // In production, this would read from system files
        return localStorage.getItem('tauos_version') || '1.0.0';
    }

    // Check for updates
    async checkForUpdates() {
        try {
            console.log('🔄 Checking for OTA updates...');
            
            const response = await fetch(`${this.apiUrl}/check?version=${this.currentVersion}`);
            const updateInfo = await response.json();
            
            if (updateInfo.update_available) {
                console.log('📦 Update available:', updateInfo);
                this.updateAvailable = true;
                this.showUpdateNotification(updateInfo);
                return updateInfo;
            } else {
                console.log('✅ System is up to date');
                this.updateAvailable = false;
                return null;
            }
        } catch (error) {
            console.error('❌ Failed to check for updates:', error);
            return null;
        }
    }

    // Show update notification
    showUpdateNotification(updateInfo) {
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'tauos-update-notification';
        notification.innerHTML = `
            <div class="tauos-update-notification">
                <div class="update-header">
                    <h3>🔄 TauOS Update Available</h3>
                    <button onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="update-content">
                    <p><strong>Version:</strong> ${updateInfo.version}</p>
                    <p><strong>Size:</strong> ${updateInfo.size}</p>
                    <p><strong>Description:</strong> ${updateInfo.description}</p>
                    <div class="update-changelog">
                        <h4>What's New:</h4>
                        <ul>
                            ${updateInfo.changelog.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="update-actions">
                        <button onclick="tauosOTA.downloadUpdate('${updateInfo.version}')" class="update-button">
                            Download Update
                        </button>
                        <button onclick="tauosOTA.scheduleUpdate('${updateInfo.version}')" class="schedule-button">
                            Schedule for Later
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .tauos-update-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .update-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            .update-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
            .update-header button {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .update-content {
                padding: 20px;
            }
            .update-content p {
                margin: 8px 0;
                font-size: 14px;
            }
            .update-changelog {
                margin: 16px 0;
            }
            .update-changelog h4 {
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: 600;
            }
            .update-changelog ul {
                margin: 0;
                padding-left: 20px;
            }
            .update-changelog li {
                font-size: 13px;
                margin: 4px 0;
            }
            .update-actions {
                display: flex;
                gap: 12px;
                margin-top: 16px;
            }
            .update-button, .schedule-button {
                flex: 1;
                padding: 10px 16px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .update-button {
                background: #4CAF50;
                color: white;
            }
            .update-button:hover {
                background: #45a049;
            }
            .schedule-button {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
            }
            .schedule-button:hover {
                background: rgba(255,255,255,0.3);
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(notification);
    }

    // Download update
    async downloadUpdate(version) {
        try {
            console.log(`📥 Downloading update ${version}...`);
            
            // Show download progress
            this.showDownloadProgress();
            
            // In production, this would trigger the actual download
            // For now, simulate download
            await this.simulateDownload();
            
            console.log('✅ Update downloaded successfully');
            this.showInstallPrompt(version);
            
        } catch (error) {
            console.error('❌ Failed to download update:', error);
            this.showError('Failed to download update');
        }
    }

    // Simulate download progress
    async simulateDownload() {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                this.updateDownloadProgress(progress);
                
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 200);
        });
    }

    // Show download progress
    showDownloadProgress() {
        const progressDiv = document.createElement('div');
        progressDiv.id = 'tauos-download-progress';
        progressDiv.innerHTML = `
            <div class="download-progress">
                <h3>📥 Downloading Update...</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <p class="progress-text">0%</p>
            </div>
        `;
        
        const styles = document.createElement('style');
        styles.textContent = `
            .download-progress {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #2d3748;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 10001;
                color: white;
                text-align: center;
                min-width: 300px;
            }
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #4a5568;
                border-radius: 4px;
                overflow: hidden;
                margin: 16px 0;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transition: width 0.3s ease;
            }
            .progress-text {
                margin: 0;
                font-size: 14px;
                color: #a0aec0;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(progressDiv);
    }

    // Update download progress
    updateDownloadProgress(progress) {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `${progress}%`;
        }
    }

    // Show install prompt
    showInstallPrompt(version) {
        // Remove download progress
        const progressDiv = document.getElementById('tauos-download-progress');
        if (progressDiv) {
            progressDiv.remove();
        }
        
        // Show install prompt
        const installDiv = document.createElement('div');
        installDiv.id = 'tauos-install-prompt';
        installDiv.innerHTML = `
            <div class="install-prompt">
                <h3>🚀 Ready to Install Update</h3>
                <p>Update ${version} has been downloaded and is ready to install.</p>
                <p><strong>Note:</strong> The system will restart after installation.</p>
                <div class="install-actions">
                    <button onclick="tauosOTA.installUpdate('${version}')" class="install-button">
                        Install Now
                    </button>
                    <button onclick="tauosOTA.scheduleUpdate('${version}')" class="schedule-button">
                        Install Later
                    </button>
                </div>
            </div>
        `;
        
        const styles = document.createElement('style');
        styles.textContent = `
            .install-prompt {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #2d3748;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 10001;
                color: white;
                text-align: center;
                min-width: 350px;
            }
            .install-actions {
                display: flex;
                gap: 12px;
                margin-top: 20px;
            }
            .install-button, .schedule-button {
                flex: 1;
                padding: 12px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .install-button {
                background: #4CAF50;
                color: white;
            }
            .install-button:hover {
                background: #45a049;
            }
            .schedule-button {
                background: #6c757d;
                color: white;
            }
            .schedule-button:hover {
                background: #5a6268;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(installDiv);
    }

    // Install update
    async installUpdate(version) {
        try {
            console.log(`🚀 Installing update ${version}...`);
            
            // Show installation progress
            this.showInstallationProgress();
            
            // In production, this would trigger the actual installation
            // For now, simulate installation
            await this.simulateInstallation();
            
            console.log('✅ Update installed successfully');
            this.showRestartPrompt();
            
        } catch (error) {
            console.error('❌ Failed to install update:', error);
            this.showError('Failed to install update');
        }
    }

    // Simulate installation
    async simulateInstallation() {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                this.updateInstallationProgress(progress);
                
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 300);
        });
    }

    // Show installation progress
    showInstallationProgress() {
        const progressDiv = document.createElement('div');
        progressDiv.id = 'tauos-installation-progress';
        progressDiv.innerHTML = `
            <div class="installation-progress">
                <h3>🚀 Installing Update...</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <p class="progress-text">0%</p>
                <p class="progress-status">Preparing installation...</p>
            </div>
        `;
        
        document.body.appendChild(progressDiv);
    }

    // Update installation progress
    updateInstallationProgress(progress) {
        const progressFill = document.querySelector('#tauos-installation-progress .progress-fill');
        const progressText = document.querySelector('#tauos-installation-progress .progress-text');
        const progressStatus = document.querySelector('#tauos-installation-progress .progress-status');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `${progress}%`;
        }
        if (progressStatus) {
            const statuses = [
                'Preparing installation...',
                'Backing up system...',
                'Installing new files...',
                'Updating configuration...',
                'Finalizing installation...'
            ];
            const statusIndex = Math.floor((progress / 100) * statuses.length);
            progressStatus.textContent = statuses[statusIndex] || 'Installing...';
        }
    }

    // Show restart prompt
    showRestartPrompt() {
        // Remove installation progress
        const progressDiv = document.getElementById('tauos-installation-progress');
        if (progressDiv) {
            progressDiv.remove();
        }
        
        // Show restart prompt
        const restartDiv = document.createElement('div');
        restartDiv.id = 'tauos-restart-prompt';
        restartDiv.innerHTML = `
            <div class="restart-prompt">
                <h3>✅ Update Installed Successfully</h3>
                <p>The system needs to restart to complete the update.</p>
                <div class="restart-actions">
                    <button onclick="tauosOTA.restartNow()" class="restart-button">
                        Restart Now
                    </button>
                    <button onclick="tauosOTA.restartLater()" class="restart-later-button">
                        Restart Later
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(restartDiv);
    }

    // Restart now
    restartNow() {
        console.log('🔄 Restarting system...');
        // In production, this would trigger system restart
        alert('System will restart in 10 seconds...');
    }

    // Restart later
    restartLater() {
        console.log('⏰ Restart scheduled for later');
        // Remove restart prompt
        const restartDiv = document.getElementById('tauos-restart-prompt');
        if (restartDiv) {
            restartDiv.remove();
        }
    }

    // Schedule update
    scheduleUpdate(version) {
        console.log(`⏰ Update ${version} scheduled for later`);
        // Remove notification
        const notification = document.getElementById('tauos-update-notification');
        if (notification) {
            notification.remove();
        }
    }

    // Show error
    showError(message) {
        console.error('❌ OTA Error:', message);
        alert(`OTA Update Error: ${message}`);
    }

    // Start automatic checking
    startAutomaticChecking() {
        // Check immediately
        this.checkForUpdates();
        
        // Set up periodic checking
        setInterval(() => {
            this.checkForUpdates();
        }, this.checkInterval);
    }
}

// Initialize OTA client
const tauosOTA = new TauOSOTA();

// Start automatic checking when page loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        tauosOTA.startAutomaticChecking();
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TauOSOTA;
}
