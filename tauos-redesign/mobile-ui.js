// ===== MOBILE UI INTERACTIONS =====

class MobileUI {
    constructor() {
        this.currentApp = null;
        this.appOverlays = {};
        this.init();
    }
    
    init() {
        this.setupAppIcons();
        this.setupDock();
        this.setupBackButtons();
        this.setupDialpad();
        this.setupVoiceInterface();
        this.setupHapticFeedback();
        this.setupGestures();
    }
    
    setupAppIcons() {
        const appIcons = document.querySelectorAll('.app-icon');
        
        appIcons.forEach(icon => {
            const appName = icon.dataset.app;
            const overlay = document.getElementById(`${appName}-overlay`);
            
            if (overlay) {
                this.appOverlays[appName] = overlay;
            }
            
            icon.addEventListener('click', () => {
                this.openApp(appName);
            });
            
            // Add hover effect
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.05)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
            });
        });
    }
    
    setupDock() {
        const dockItems = document.querySelectorAll('.dock-item');
        
        dockItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                dockItems.forEach(di => di.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                
                // Simulate haptic feedback
                this.triggerHapticFeedback();
            });
        });
    }
    
    setupBackButtons() {
        const backButtons = document.querySelectorAll('.back-button');
        
        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeCurrentApp();
            });
        });
    }
    
    setupDialpad() {
        const dialpadButtons = document.querySelectorAll('.dialpad-button');
        const phoneNumber = document.querySelector('.phone-number');
        let currentNumber = '+1 (555) 123-4567';
        
        dialpadButtons.forEach(button => {
            button.addEventListener('click', () => {
                const number = button.textContent;
                
                // Add number to display
                if (currentNumber.length < 15) {
                    currentNumber += number;
                    phoneNumber.textContent = currentNumber;
                }
                
                // Simulate haptic feedback
                this.triggerHapticFeedback();
                
                // Add visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
            });
        });
        
        // Setup call buttons
        const callButtons = document.querySelectorAll('.call-button');
        callButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('primary')) {
                    this.startCall();
                } else if (button.textContent === '⌫') {
                    // Delete last character
                    if (currentNumber.length > 0) {
                        currentNumber = currentNumber.slice(0, -1);
                        phoneNumber.textContent = currentNumber;
                    }
                }
                
                this.triggerHapticFeedback();
            });
        });
    }
    
    setupVoiceInterface() {
        const voiceButton = document.querySelector('.voice-button');
        const voiceStatus = document.querySelector('.voice-status');
        const voiceWaves = document.querySelectorAll('.voice-wave');
        
        if (voiceButton) {
            let isListening = false;
            
            voiceButton.addEventListener('click', () => {
                if (!isListening) {
                    this.startVoiceListening();
                    isListening = true;
                    voiceStatus.textContent = 'Listening...';
                    voiceButton.style.background = 'var(--gradient-yellow)';
                    voiceWaves.forEach(wave => wave.style.animationPlayState = 'running');
                } else {
                    this.stopVoiceListening();
                    isListening = false;
                    voiceStatus.textContent = 'Tap to speak';
                    voiceButton.style.background = 'var(--gradient-primary)';
                    voiceWaves.forEach(wave => wave.style.animationPlayState = 'paused');
                }
                
                this.triggerHapticFeedback();
            });
        }
    }
    
    setupHapticFeedback() {
        // Simulate haptic feedback for touch interactions
        const touchElements = document.querySelectorAll('.app-icon, .dialpad-button, .call-button, .conversation-item, .email-item, .contact-item, .setting-item, .file-item, .voice-button');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                this.triggerHapticFeedback();
            });
        });
    }
    
    setupGestures() {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isDragging = false;
        
        // Swipe to go back
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // If horizontal swipe is greater than vertical and significant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - go back
                    this.closeCurrentApp();
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            startX = 0;
            startY = 0;
        });
    }
    
    openApp(appName) {
        const overlay = this.appOverlays[appName];
        
        if (overlay) {
            // Close current app if any
            this.closeCurrentApp();
            
            // Open new app
            overlay.classList.add('active');
            this.currentApp = appName;
            
            // Add entrance animation
            overlay.style.transform = 'translateX(100%)';
            setTimeout(() => {
                overlay.style.transform = 'translateX(0)';
            }, 10);
            
            // Simulate haptic feedback
            this.triggerHapticFeedback();
            
            // Add app-specific functionality
            this.setupAppSpecificFeatures(appName);
        }
    }
    
    closeCurrentApp() {
        if (this.currentApp) {
            const overlay = this.appOverlays[this.currentApp];
            if (overlay) {
                overlay.classList.remove('active');
                this.currentApp = null;
                
                // Simulate haptic feedback
                this.triggerHapticFeedback();
            }
        }
    }
    
    setupAppSpecificFeatures(appName) {
        switch (appName) {
            case 'tauphone':
                this.setupPhoneFeatures();
                break;
            case 'taumessages':
                this.setupMessagesFeatures();
                break;
            case 'taumail':
                this.setupMailFeatures();
                break;
            case 'taucloud':
                this.setupCloudFeatures();
                break;
            case 'taucontacts':
                this.setupContactsFeatures();
                break;
            case 'tausettings':
                this.setupSettingsFeatures();
                break;
            case 'tauid':
                this.setupIDFeatures();
                break;
            case 'tauvoice':
                this.setupVoiceFeatures();
                break;
        }
    }
    
    setupPhoneFeatures() {
        // Add phone-specific interactions
        const phoneNumber = document.querySelector('.phone-number');
        if (phoneNumber) {
            // Animate number entry
            phoneNumber.style.animation = 'fadeIn 0.3s ease-out';
        }
    }
    
    setupMessagesFeatures() {
        // Add message-specific interactions
        const conversationItems = document.querySelectorAll('.conversation-item');
        conversationItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openConversation(item);
            });
        });
    }
    
    setupMailFeatures() {
        // Add mail-specific interactions
        const emailItems = document.querySelectorAll('.email-item');
        emailItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openEmail(item);
            });
        });
    }
    
    setupCloudFeatures() {
        // Add cloud-specific interactions
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openFile(item);
            });
        });
    }
    
    setupContactsFeatures() {
        // Add contacts-specific interactions
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openContact(item);
            });
        });
    }
    
    setupSettingsFeatures() {
        // Add settings-specific interactions
        const settingItems = document.querySelectorAll('.setting-item');
        settingItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openSetting(item);
            });
        });
    }
    
    setupIDFeatures() {
        // Add ID-specific interactions
        const identityCard = document.querySelector('.identity-card');
        if (identityCard) {
            identityCard.addEventListener('click', () => {
                this.showIdentityDetails();
            });
        }
    }
    
    setupVoiceFeatures() {
        // Voice features are already set up in setupVoiceInterface
    }
    
    openConversation(item) {
        const name = item.querySelector('.conversation-name').textContent;
        this.showNotification(`Opening conversation with ${name}`);
        this.triggerHapticFeedback();
    }
    
    openEmail(item) {
        const sender = item.querySelector('.email-sender').textContent;
        this.showNotification(`Opening email from ${sender}`);
        this.triggerHapticFeedback();
    }
    
    openFile(item) {
        const fileName = item.querySelector('.file-name').textContent;
        this.showNotification(`Opening ${fileName}`);
        this.triggerHapticFeedback();
    }
    
    openContact(item) {
        const name = item.querySelector('.contact-name').textContent;
        this.showNotification(`Opening contact ${name}`);
        this.triggerHapticFeedback();
    }
    
    openSetting(item) {
        const name = item.querySelector('.setting-name').textContent;
        this.showNotification(`Opening ${name} settings`);
        this.triggerHapticFeedback();
    }
    
    showIdentityDetails() {
        this.showNotification('Showing identity details');
        this.triggerHapticFeedback();
    }
    
    startCall() {
        this.showNotification('Starting call...');
        this.triggerHapticFeedback();
        
        // Simulate call duration
        setTimeout(() => {
            this.showNotification('Call ended');
        }, 3000);
    }
    
    startVoiceListening() {
        console.log('Voice listening started');
        this.triggerHapticFeedback();
        
        // Simulate voice recognition
        setTimeout(() => {
            this.showNotification('Voice command recognized');
        }, 2000);
    }
    
    stopVoiceListening() {
        console.log('Voice listening stopped');
        this.triggerHapticFeedback();
    }
    
    triggerHapticFeedback() {
        // Simulate haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        
        // Visual feedback
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: hapticPulse 0.3s ease-out;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// CSS Animations for haptic feedback
const hapticStyles = document.createElement('style');
hapticStyles.textContent = `
    @keyframes hapticPulse {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(hapticStyles);

// Initialize Mobile UI
document.addEventListener('DOMContentLoaded', () => {
    const mobileUI = new MobileUI();
    
    // Add loading animation
    const mobileFrame = document.querySelector('.mobile-frame');
    if (mobileFrame) {
        mobileFrame.style.opacity = '0';
        mobileFrame.style.transform = 'scale(0.9)';
        mobileFrame.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            mobileFrame.style.opacity = '1';
            mobileFrame.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Add time update
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        };
        
        updateTime();
        setInterval(updateTime, 60000); // Update every minute
    }
    
    // Add battery simulation
    const batteryLevel = document.querySelector('.battery-level');
    if (batteryLevel) {
        let battery = 80;
        const updateBattery = () => {
            battery = Math.max(0, battery - 0.1);
            batteryLevel.style.width = `${battery}%`;
            
            if (battery <= 20) {
                batteryLevel.style.background = 'linear-gradient(90deg, #f44336, #ff5722)';
            } else if (battery <= 50) {
                batteryLevel.style.background = 'linear-gradient(90deg, #ff9800, #ffc107)';
            } else {
                batteryLevel.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            }
        };
        
        setInterval(updateBattery, 30000); // Update every 30 seconds
    }
});

// Export for potential module usage
window.MobileUI = MobileUI; 