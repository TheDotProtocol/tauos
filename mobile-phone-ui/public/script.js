// TauOS Mobile Landing Page JavaScript
class TauOSMobileLanding {
    constructor() {
        this.currentScreen = 'home-screen';
        this.currentTab = 'keypad';
        this.phoneNumber = '+1 (555) 123-4567';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTime();
        this.setupPhoneTabs();
        this.setupKeypad();
        
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
    }

    setupEventListeners() {
        // App icon clicks
        document.querySelectorAll('.app-icon, .dock-app').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                this.openApp(app);
            });
        });

        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.showScreen(screen);
            });
        });

        // Phone tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });

        // Call button
        document.getElementById('call-btn')?.addEventListener('click', () => {
            this.makeCall();
        });

        // Delete button
        document.getElementById('delete-btn')?.addEventListener('click', () => {
            this.deleteNumber();
        });

        // Contact call buttons
        document.querySelectorAll('.contact-call').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contactItem = e.target.closest('.contact-item');
                const contactName = contactItem.querySelector('.contact-name').textContent;
                this.callContact(contactName);
            });
        });
    }

    setupPhoneTabs() {
        // Tab switching logic
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Show corresponding content
                const tabId = tab.dataset.tab + '-tab';
                const content = document.getElementById(tabId);
                if (content) {
                    content.classList.add('active');
                }
            });
        });
    }

    setupKeypad() {
        // Keypad button clicks
        document.querySelectorAll('.keypad-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = e.currentTarget.dataset.number;
                const action = e.currentTarget.dataset.action;
                
                if (number) {
                    this.addNumber(number);
                } else if (action) {
                    this.handleSpecialKey(action);
                }
            });
        });
    }

    updateTime() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = time;
        }
    }

    openApp(appId) {
        switch (appId) {
            case 'camera':
                this.showScreen('camera-screen');
                break;
            case 'messages':
                this.showScreen('messages-screen');
                break;
            case 'phone':
                this.showScreen('phone-screen');
                break;
            case 'tautalk':
                this.showScreen('tautalk-screen');
                break;
            case 'whatsapp':
                this.showScreen('messages-screen');
                break;
            case 'contacts':
                this.showScreen('contacts-screen');
                break;
            case 'gallery':
                this.showScreen('gallery-screen');
                break;
            case 'terminal':
                this.openTerminal();
                break;
            default:
                console.log(`Opening ${appId} app`);
        }
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-screen="${screenId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    showTab(tabId) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to clicked tab
        const tab = document.querySelector(`[data-tab="${tabId}"]`);
        const content = document.getElementById(`${tabId}-tab`);
        
        if (tab) tab.classList.add('active');
        if (content) content.classList.add('active');
    }

    addNumber(number) {
        // Add number to phone display
        const display = document.getElementById('phone-number');
        if (display) {
            let currentNumber = display.textContent.replace(/\D/g, ''); // Remove non-digits
            currentNumber += number;
            
            // Format the number
            if (currentNumber.length <= 10) {
                this.phoneNumber = this.formatPhoneNumber(currentNumber);
            } else {
                this.phoneNumber = this.formatPhoneNumber(currentNumber.slice(0, 10));
            }
            
            display.textContent = this.phoneNumber;
        }
    }

    deleteNumber() {
        const display = document.getElementById('phone-number');
        if (display) {
            let currentNumber = display.textContent.replace(/\D/g, '');
            if (currentNumber.length > 0) {
                currentNumber = currentNumber.slice(0, -1);
                this.phoneNumber = this.formatPhoneNumber(currentNumber);
                display.textContent = this.phoneNumber;
            }
        }
    }

    formatPhoneNumber(number) {
        if (number.length === 0) return '';
        if (number.length <= 3) return `(${number}`;
        if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
        return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
    }

    handleSpecialKey(action) {
        switch (action) {
            case 'star':
                this.addNumber('*');
                break;
            case 'hash':
                this.addNumber('#');
                break;
        }
    }

    makeCall() {
        const display = document.getElementById('phone-number');
        if (display) {
            const number = display.textContent;
            alert(`Calling ${number}...`);
            // Here you would implement actual calling functionality
        }
    }

    callContact(contactName) {
        alert(`Calling ${contactName}...`);
        // Here you would implement actual calling functionality
    }

    openTerminal() {
        // Open terminal in fullscreen iframe
        const terminalWindow = window.open('terminal.html', '_blank', 'fullscreen=yes');
        if (terminalWindow) {
            terminalWindow.focus();
        } else {
            // Fallback: show terminal in current window
            this.showScreen('terminal-screen');
        }
    }
}

// Landing page specific functions
function scrollToPhone() {
    const phoneElement = document.querySelector('.phone-showcase');
    if (phoneElement) {
        phoneElement.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToFeatures() {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
        featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TauOSMobileLanding();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});
