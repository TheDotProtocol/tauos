// TauOS OTA Update Client
// Auto-included in all pages for update checking

(function() {
    'use strict';
    
    // OTA Configuration
    const OTA_CONFIG = {
        apiUrl: 'https://api.tauos.org/ota',
        checkInterval: 24 * 60 * 60 * 1000, // 24 hours
        autoCheck: true,
        showNotifications: true
    };
    
    // OTA Client Class
    class TauOSOTA {
        constructor() {
            this.config = OTA_CONFIG;
            this.lastCheck = localStorage.getItem('tauos_last_update_check');
            this.updateAvailable = false;
            this.currentVersion = this.getCurrentVersion();
            
            if (this.config.autoCheck) {
                this.init();
            }
        }
        
        // Get current version
        getCurrentVersion() {
            return localStorage.getItem('tauos_version') || '1.0.0';
        }
        
        // Initialize OTA
        init() {
            console.log('🔄 TauOS OTA Update System Initialized');
            this.checkForUpdates();
            this.setupPeriodicChecking();
        }
        
        // Check for updates
        async checkForUpdates() {
            try {
                const response = await fetch(`${this.config.apiUrl}/check?version=${this.currentVersion}`);
                const updateInfo = await response.json();
                
                if (updateInfo.update_available) {
                    this.updateAvailable = true;
                    this.showUpdateNotification(updateInfo);
                }
                
                // Update last check time
                localStorage.setItem('tauos_last_update_check', new Date().toISOString());
                
            } catch (error) {
                console.error('❌ OTA Check Failed:', error);
            }
        }
        
        // Show update notification
        showUpdateNotification(updateInfo) {
            if (!this.config.showNotifications) return;
            
            // Create notification
            const notification = document.createElement('div');
            notification.className = 'tauos-ota-notification';
            notification.innerHTML = `
                <div class="ota-notification">
                    <div class="notification-header">
                        <h3>🔄 TauOS Update Available</h3>
                        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
                    </div>
                    <div class="notification-content">
                        <p><strong>Version:</strong> ${updateInfo.version}</p>
                        <p><strong>Size:</strong> ${updateInfo.size}</p>
                        <p><strong>Description:</strong> ${updateInfo.description}</p>
                        <div class="notification-actions">
                            <button onclick="tauosOTA.downloadUpdate('${updateInfo.version}')" class="download-btn">
                                Download Update
                            </button>
                            <button onclick="tauosOTA.scheduleUpdate('${updateInfo.version}')" class="schedule-btn">
                                Schedule Later
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles
            this.addOTAStyles();
            
            // Add to page
            document.body.appendChild(notification);
        }
        
        // Add OTA styles
        addOTAStyles() {
            if (document.getElementById('tauos-ota-styles')) return;
            
            const styles = document.createElement('style');
            styles.id = 'tauos-ota-styles';
            styles.textContent = `
                .tauos-ota-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 400px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease-out;
                }
                
                .ota-notification {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                }
                
                .notification-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .close-btn {
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
                
                .notification-content {
                    padding: 20px;
                }
                
                .notification-content p {
                    margin: 8px 0;
                    font-size: 14px;
                }
                
                .notification-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: 16px;
                }
                
                .download-btn, .schedule-btn {
                    flex: 1;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .download-btn {
                    background: #4CAF50;
                    color: white;
                }
                
                .download-btn:hover {
                    background: #45a049;
                }
                
                .schedule-btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                }
                
                .schedule-btn:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            
            document.head.appendChild(styles);
        }
        
        // Download update
        downloadUpdate(version) {
            console.log(`📥 Downloading update ${version}...`);
            // In production, this would trigger actual download
            alert(`Downloading update ${version}...`);
        }
        
        // Schedule update
        scheduleUpdate(version) {
            console.log(`⏰ Update ${version} scheduled for later`);
            // Remove notification
            const notification = document.querySelector('.tauos-ota-notification');
            if (notification) {
                notification.remove();
            }
        }
        
        // Setup periodic checking
        setupPeriodicChecking() {
            setInterval(() => {
                this.checkForUpdates();
            }, this.config.checkInterval);
        }
    }
    
    // Initialize OTA when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.tauosOTA = new TauOSOTA();
        });
    } else {
        window.tauosOTA = new TauOSOTA();
    }
})();
