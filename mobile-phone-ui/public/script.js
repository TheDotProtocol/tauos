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
                this.initCamera();
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
                this.loadGallery();
                break;
            case 'maps':
                this.showScreen('maps-screen');
                break;
            case 'weather':
                this.showScreen('weather-screen');
                break;
            case 'notes':
                this.showScreen('notes-screen');
                break;
            case 'settings':
                this.showScreen('settings-screen');
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

    // Camera functionality
    initCamera() {
        const video = document.getElementById('camera-video');
        if (video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    video.srcObject = stream;
                    this.cameraStream = stream;
                })
                .catch(err => {
                    console.log('Camera access denied:', err);
                    // Show placeholder for demo
                    video.style.background = 'linear-gradient(45deg, #333, #666)';
                    video.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 18px;">📷 Camera Demo</div>';
                });
        }
    }

    switchCamera() {
        // Toggle between front and back camera
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
        }
        this.initCamera();
    }

    capturePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const galleryGrid = document.getElementById('gallery-grid');
        
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);
            
            // Convert to data URL
            const dataURL = canvas.toDataURL('image/png');
            
            // Save to gallery
            this.savePhotoToGallery(dataURL);
            
            // Show success animation
            this.showCaptureAnimation();
        }
    }

    savePhotoToGallery(dataURL) {
        const gallery = JSON.parse(localStorage.getItem('tauosGallery') || '[]');
        const photo = {
            id: Date.now(),
            dataURL: dataURL,
            timestamp: new Date().toISOString(),
            likes: 0,
            shares: 0
        };
        
        gallery.unshift(photo);
        localStorage.setItem('tauosGallery', JSON.stringify(gallery));
        
        // Update gallery display
        this.loadGallery();
    }

    loadGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        const galleryGridLarge = document.getElementById('gallery-grid-large');
        const gallery = JSON.parse(localStorage.getItem('tauosGallery') || '[]');
        
        if (galleryGrid) {
            galleryGrid.innerHTML = '';
            gallery.forEach(photo => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${photo.dataURL}" alt="Photo ${photo.id}">`;
                item.onclick = () => this.viewPhoto(photo);
                galleryGrid.appendChild(item);
            });
        }
        
        if (galleryGridLarge) {
            galleryGridLarge.innerHTML = '';
            gallery.slice(0, 12).forEach(photo => {
                const item = document.createElement('div');
                item.className = 'gallery-item-large';
                item.innerHTML = `<img src="${photo.dataURL}" alt="Photo ${photo.id}">`;
                item.onclick = () => this.viewPhoto(photo);
                galleryGridLarge.appendChild(item);
            });
        }
    }

    viewPhoto(photo) {
        // Open photo in fullscreen modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 10000; display: flex;
            align-items: center; justify-content: center; cursor: pointer;
        `;
        modal.innerHTML = `
            <div style="max-width: 90%; max-height: 90%; position: relative;">
                <img src="${photo.dataURL}" style="max-width: 100%; max-height: 100%; border-radius: 12px;">
                <div style="position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 8px;">
                    <button onclick="sharePhoto(${photo.id})" style="background: #fbbf24; border: none; padding: 8px 16px; border-radius: 6px; margin-right: 10px; cursor: pointer;">Share</button>
                    <button onclick="this.closest('.modal').remove()" style="background: #666; border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        modal.className = 'modal';
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        document.body.appendChild(modal);
    }

    showCaptureAnimation() {
        // Show capture flash animation
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: white; z-index: 9999; opacity: 0.8;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.transition = 'opacity 0.3s ease';
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
        }, 100);
    }

    // Social media sharing functions
    shareToTwitter() {
        const text = "Just tried TauOS Mobile! The privacy-first mobile OS is incredible! 📱✨ #TauOSMobile @TauOS";
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    shareToFacebook() {
        const text = "Just tried TauOS Mobile! The privacy-first mobile OS is incredible!";
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    shareToInstagram() {
        alert('Share your TauOS Mobile photo on Instagram and tag @TauOS with #TauOSMobile to enter our weekly contest!');
    }

    shareGallery() {
        const gallery = JSON.parse(localStorage.getItem('tauosGallery') || '[]');
        if (gallery.length === 0) {
            alert('No photos to share! Take some photos first.');
            return;
        }
        
        const latestPhoto = gallery[0];
        this.viewPhoto(latestPhoto);
    }

    // Other app functions
    newMessage() {
        alert('New message feature coming soon!');
    }

    openChat(contactName) {
        alert(`Opening chat with ${contactName}...`);
    }

    searchLocation() {
        const search = document.getElementById('maps-search').value;
        if (search) {
            alert(`Searching for "${search}" on maps...`);
        }
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    alert(`Location: ${position.coords.latitude}, ${position.coords.longitude}`);
                },
                error => {
                    alert('Location access denied or unavailable');
                }
            );
        } else {
            alert('Geolocation not supported');
        }
    }

    refreshWeather() {
        alert('Refreshing weather data...');
    }

    newNote() {
        const title = prompt('Note title:');
        if (title) {
            const content = prompt('Note content:');
            if (content) {
                const notes = JSON.parse(localStorage.getItem('tauosNotes') || '[]');
                notes.unshift({
                    id: Date.now(),
                    title: title,
                    content: content,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('tauosNotes', JSON.stringify(notes));
                this.loadNotes();
            }
        }
    }

    openNote(noteId) {
        const notes = JSON.parse(localStorage.getItem('tauosNotes') || '[]');
        const note = notes.find(n => n.id === noteId);
        if (note) {
            alert(`Note: ${note.title}\n\n${note.content}`);
        }
    }

    loadNotes() {
        const notesList = document.getElementById('notes-list');
        if (notesList) {
            const notes = JSON.parse(localStorage.getItem('tauosNotes') || '[]');
            notesList.innerHTML = '';
            notes.forEach(note => {
                const item = document.createElement('div');
                item.className = 'note-item';
                item.onclick = () => this.openNote(note.id);
                item.innerHTML = `
                    <div class="note-title">${note.title}</div>
                    <div class="note-preview">${note.content.substring(0, 50)}...</div>
                    <div class="note-date">${new Date(note.timestamp).toLocaleDateString()}</div>
                `;
                notesList.appendChild(item);
            });
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

// Global functions for social media sharing
function shareToTwitter() {
    const text = "Just tried TauOS Mobile! The privacy-first mobile OS is incredible! 📱✨ #TauOSMobile @TauOS";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareToFacebook() {
    const text = "Just tried TauOS Mobile! The privacy-first mobile OS is incredible!";
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareToInstagram() {
    alert('Share your TauOS Mobile photo on Instagram and tag @TauOS with #TauOSMobile to enter our weekly contest!');
}

function sharePhoto(photoId) {
    const gallery = JSON.parse(localStorage.getItem('tauosGallery') || '[]');
    const photo = gallery.find(p => p.id === photoId);
    if (photo) {
        const text = "Check out this photo I took with TauOS Mobile! 📱✨ #TauOSMobile @TauOS";
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
}

// Global functions for app functionality
function switchCamera() {
    if (window.tauOSMobile) {
        window.tauOSMobile.switchCamera();
    }
}

function capturePhoto() {
    if (window.tauOSMobile) {
        window.tauOSMobile.capturePhoto();
    }
}

function toggleVideo() {
    alert('Video recording feature coming soon!');
}

function shareGallery() {
    if (window.tauOSMobile) {
        window.tauOSMobile.shareGallery();
    }
}

function newMessage() {
    if (window.tauOSMobile) {
        window.tauOSMobile.newMessage();
    }
}

function openChat(contactName) {
    if (window.tauOSMobile) {
        window.tauOSMobile.openChat(contactName);
    }
}

function searchLocation() {
    if (window.tauOSMobile) {
        window.tauOSMobile.searchLocation();
    }
}

function getCurrentLocation() {
    if (window.tauOSMobile) {
        window.tauOSMobile.getCurrentLocation();
    }
}

function refreshWeather() {
    if (window.tauOSMobile) {
        window.tauOSMobile.refreshWeather();
    }
}

function newNote() {
    if (window.tauOSMobile) {
        window.tauOSMobile.newNote();
    }
}

function openNote(noteId) {
    if (window.tauOSMobile) {
        window.tauOSMobile.openNote(noteId);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tauOSMobile = new TauOSMobileLanding();
    
    // Initialize forms
    initializePrebookingForm();
    initializeInvestorForm();
});

// Pre-booking form functionality
function initializePrebookingForm() {
    const form = document.getElementById('prebooking-form');
    if (form) {
        form.addEventListener('submit', handlePrebookingSubmit);
    }
}

function handlePrebookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Save to localStorage for demo purposes
    const prebookings = JSON.parse(localStorage.getItem('tauosPrebookings') || '[]');
    const prebooking = {
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    prebookings.push(prebooking);
    localStorage.setItem('tauosPrebookings', JSON.stringify(prebookings));
    
    // Show success message
    showSuccessMessage('Pre-booking submitted successfully! You will receive a confirmation email shortly.');
    
    // Reset form
    e.target.reset();
}

// Investor form functionality
function initializeInvestorForm() {
    const form = document.getElementById('investor-form');
    if (form) {
        form.addEventListener('submit', handleInvestorSubmit);
    }
}

function handleInvestorSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Save to localStorage for demo purposes
    const investors = JSON.parse(localStorage.getItem('tauosInvestors') || '[]');
    const investor = {
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    investors.push(investor);
    localStorage.setItem('tauosInvestors', JSON.stringify(investors));
    
    // Show success message
    showSuccessMessage('Thank you for your interest! Our investor relations team will contact you within 24 hours.');
    
    // Reset form
    e.target.reset();
}

function showSuccessMessage(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
        align-items: center; justify-content: center;
    `;
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); 
                    padding: 2rem; border-radius: 20px; text-align: center; 
                    border: 1px solid rgba(255, 255, 255, 0.1); max-width: 400px; margin: 0 1rem;">
            <div style="color: #10B981; font-size: 3rem; margin-bottom: 1rem;">✓</div>
            <h3 style="color: #fbbf24; margin-bottom: 1rem;">Success!</h3>
            <p style="color: #cccccc; margin-bottom: 2rem;">${message}</p>
            <button onclick="this.closest('.modal').remove()" 
                    style="background: #fbbf24; border: none; padding: 0.75rem 2rem; 
                           border-radius: 8px; color: #000; font-weight: 600; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 5000);
}

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
