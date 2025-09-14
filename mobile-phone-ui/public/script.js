// Mobile Phone UI JavaScript
class MobilePhoneUI {
    constructor() {
        this.currentScreen = 'home-screen';
        this.cameraStream = null;
        this.localStream = null;
        this.remoteStream = null;
        this.socket = null;
        this.currentCall = null;
        this.isMuted = false;
        this.isVideoOn = true;
        this.isSpeakerOn = false;
        this.cameraMode = 'photo';
        this.effects = {
            none: '',
            vintage: 'sepia(1) contrast(1.2) brightness(0.9)',
            blackwhite: 'grayscale(1) contrast(1.1)',
            vivid: 'saturate(1.5) contrast(1.2) brightness(1.1)',
            warm: 'sepia(0.5) saturate(1.2) brightness(1.05)',
            cool: 'hue-rotate(20deg) saturate(1.1) brightness(1.05)',
            dramatic: 'contrast(1.3) saturate(1.2) brightness(0.9)',
            soft: 'blur(0.5px) brightness(1.1) saturate(0.9)',
            neon: 'hue-rotate(180deg) saturate(2) contrast(1.5)',
            retro: 'sepia(0.8) contrast(1.1) brightness(0.95) hue-rotate(-10deg)'
        };
        this.currentEffect = 'none';
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.cameraFacing = 'user'; // 'user' for front, 'environment' for back
        this.gallery = JSON.parse(localStorage.getItem('phoneGallery') || '[]');
        this.contacts = JSON.parse(localStorage.getItem('phoneContacts') || '[]');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTime();
        this.loadData();
        this.connectSocket();
        this.setupCamera();
        
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

        // Camera controls
        document.getElementById('capture-btn')?.addEventListener('click', () => {
            if (this.cameraMode === 'video') {
                this.toggleVideoRecording();
            } else {
                this.capturePhoto();
            }
        });

        document.getElementById('switch-camera-btn')?.addEventListener('click', () => {
            this.switchCamera();
        });

        document.getElementById('flash-btn')?.addEventListener('click', () => {
            this.toggleFlash();
        });

        document.getElementById('effects-btn')?.addEventListener('click', () => {
            this.showEffects();
        });

        // Camera modes
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCameraMode(e.target.dataset.mode);
            });
        });

        // Message input
        document.getElementById('message-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        document.getElementById('send-btn')?.addEventListener('click', () => {
            this.sendMessage();
        });

        // Call controls
        document.getElementById('mute-btn')?.addEventListener('click', () => {
            this.toggleMute();
        });

        document.getElementById('video-btn')?.addEventListener('click', () => {
            this.toggleVideo();
        });

        document.getElementById('speaker-btn')?.addEventListener('click', () => {
            this.toggleSpeaker();
        });

        // Contact search
        document.getElementById('contact-search')?.addEventListener('input', (e) => {
            this.searchContacts(e.target.value);
        });
    }

    connectSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('📱 Connected to server');
        });

        this.socket.on('user-joined', (data) => {
            console.log('User joined call:', data);
            this.updateCallStatus(`${data.name} joined the call`);
        });

        this.socket.on('user-left', (data) => {
            console.log('User left call:', data);
            this.updateCallStatus('User left the call');
        });

        this.socket.on('call-signal', (data) => {
            this.handleCallSignal(data);
        });

        this.socket.on('call-offer', (data) => {
            this.handleOffer(data.offer);
        });

        this.socket.on('call-answer', (data) => {
            this.handleAnswer(data.answer);
        });

        this.socket.on('ice-candidate', (data) => {
            this.handleIceCandidate(data.candidate);
        });

        this.socket.on('new-message', (data) => {
            this.handleIncomingMessage(data);
        });
    }

    updateTime() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: false 
        });
        document.getElementById('current-time').textContent = time;
    }

    showScreen(screenId) {
        // Hide current screen
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show new screen
        const newScreen = document.getElementById(screenId);
        if (newScreen) {
            newScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // Load screen-specific data
            this.loadScreenData(screenId);
        }
    }

    openApp(appId) {
        switch (appId) {
            case 'camera':
                this.showScreen('camera-screen');
                this.startCamera();
                break;
            case 'messages':
                this.showScreen('messages-screen');
                break;
            case 'phone':
                this.showScreen('contacts-screen');
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
            default:
                console.log(`Opening ${appId} app`);
        }
    }

    async loadData() {
        try {
            // Load messages
            const messagesResponse = await fetch('/api/messages');
            const messages = await messagesResponse.json();
            this.renderMessages(messages);

            // Load contacts
            const contactsResponse = await fetch('/api/contacts');
            const contacts = await contactsResponse.json();
            this.renderContacts(contacts);

            // Load gallery
            this.loadGallery();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    loadScreenData(screenId) {
        switch (screenId) {
            case 'messages-screen':
                this.loadMessages();
                break;
            case 'contacts-screen':
                this.loadContacts();
                break;
            case 'gallery-screen':
                this.loadGallery();
                break;
            case 'tautalk-screen':
                this.loadRecentCalls();
                break;
        }
    }

    renderMessages(messages) {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;

        messagesList.innerHTML = messages.map(message => `
            <div class="message-item" onclick="mobileUI.openChat('${message.id}')">
                <div class="message-avatar">${message.avatar}</div>
                <div class="message-content">
                    <div class="message-name">${message.contact}</div>
                    <div class="message-preview">${message.lastMessage}</div>
                </div>
                <div class="message-meta">
                    <div class="message-time">${message.timestamp}</div>
                    ${message.unread > 0 ? `<div class="message-badge">${message.unread}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    loadContacts() {
        const contactsList = document.getElementById('contacts-list');
        if (!contactsList) return;

        // Use local storage contacts or fallback to sample data
        const contacts = this.contacts.length > 0 ? this.contacts : [
            { id: 1, name: 'John Doe', phone: '+1-555-0123', avatar: '👨‍💼', lastSeen: '2 minutes ago' },
            { id: 2, name: 'Jane Smith', phone: '+1-555-0456', avatar: '👩‍💻', lastSeen: 'Online' },
            { id: 3, name: 'Mike Johnson', phone: '+1-555-0789', avatar: '👨‍🔬', lastSeen: '1 hour ago' },
            { id: 4, name: 'Sarah Wilson', phone: '+1-555-0321', avatar: '👩‍🎨', lastSeen: 'Yesterday' },
            { id: 5, name: 'David Brown', phone: '+1-555-0654', avatar: '👨‍🚀', lastSeen: '3 days ago' }
        ];

        contactsList.innerHTML = contacts.map(contact => `
            <div class="contact-item" onclick="mobileUI.openContact('${contact.id}')">
                <div class="contact-avatar">${contact.avatar}</div>
                <div class="contact-info">
                    <h3>${contact.name}</h3>
                    <p>${contact.phone}</p>
                </div>
                <div class="contact-actions">
                    <button class="call-btn" onclick="event.stopPropagation(); startCall('${contact.name}')">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="video-call-btn" onclick="event.stopPropagation(); startVideoCall('${contact.name}')">
                        <i class="fas fa-video"></i>
                    </button>
                    <button class="edit-btn" onclick="event.stopPropagation(); editContact(${contact.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteContact(${contact.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderContacts(contacts) {
        const contactsList = document.getElementById('contacts-list');
        if (!contactsList) return;

        contactsList.innerHTML = contacts.map(contact => `
            <div class="contact-item" onclick="mobileUI.openContact('${contact.id}')">
                <div class="contact-avatar">${contact.avatar}</div>
                <div class="contact-details">
                    <h3>${contact.name}</h3>
                    <p>${contact.phone}</p>
                </div>
            </div>
        `).join('');
    }

    openChat(messageId) {
        // Load chat data and show chat screen
        this.showScreen('chat-screen');
        this.loadChatMessages(messageId);
    }

    openContact(contactId) {
        // Load contact details and show options
        console.log('Opening contact:', contactId);
    }

    loadChatMessages(messageId) {
        // Load specific chat messages
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        // Sample chat messages
        const messages = [
            { type: 'received', text: 'Hello!', time: '10:30 AM' },
            { type: 'sent', text: 'Hi John!', time: '10:31 AM' },
            { type: 'received', text: 'Hey, how are you doing?', time: '10:32 AM' },
            { type: 'sent', text: 'I\'m doing great! How about you?', time: '10:33 AM' },
            { type: 'received', text: 'Pretty good, thanks for asking!', time: '10:34 AM' }
        ];

        chatMessages.innerHTML = messages.map(message => `
            <div class="message ${message.type}">
                <div class="message-bubble">${message.text}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `).join('');

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        
        if (text) {
            const chatMessages = document.getElementById('chat-messages');
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });

            // Check for special message types
            const messageType = this.detectMessageType(text);
            const messageHTML = this.createMessageHTML(text, 'sent', time, messageType);

            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            input.value = '';
            
            // Send via socket if connected
            if (this.socket) {
                this.socket.emit('send-message', {
                    text: text,
                    type: messageType,
                    timestamp: now.toISOString()
                });
            }
            
            // Simulate response
            setTimeout(() => {
                const responses = this.getRandomResponse(messageType);
                const responseHTML = this.createMessageHTML(responses, 'received', 
                    new Date().toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                    }), 'text');
                chatMessages.insertAdjacentHTML('beforeend', responseHTML);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000 + Math.random() * 2000);
        }
    }

    detectMessageType(text) {
        // Detect emoji messages
        if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text)) {
            return 'emoji';
        }
        
        // Detect links
        if (/https?:\/\/[^\s]+/.test(text)) {
            return 'link';
        }
        
        // Detect phone numbers
        if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) {
            return 'phone';
        }
        
        // Detect email
        if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
            return 'email';
        }
        
        return 'text';
    }

    createMessageHTML(text, type, time, messageType = 'text') {
        let bubbleContent = text;
        
        // Format different message types
        switch (messageType) {
            case 'link':
                bubbleContent = `<a href="${text}" target="_blank" class="message-link">${text}</a>`;
                break;
            case 'phone':
                bubbleContent = `<a href="tel:${text}" class="message-phone">${text}</a>`;
                break;
            case 'email':
                bubbleContent = `<a href="mailto:${text}" class="message-email">${text}</a>`;
                break;
            case 'emoji':
                bubbleContent = `<span class="emoji-message">${text}</span>`;
                break;
        }
        
        return `
            <div class="message ${type}">
                <div class="message-bubble ${messageType}">${bubbleContent}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }

    getRandomResponse(messageType) {
        const responses = {
            text: [
                "Thanks for the message!",
                "That's interesting!",
                "I see what you mean.",
                "Tell me more about that.",
                "That sounds great!",
                "I understand.",
                "Thanks for sharing!"
            ],
            emoji: [
                "😊",
                "👍",
                "😄",
                "❤️",
                "🎉",
                "😍",
                "🤔"
            ],
            link: [
                "Thanks for sharing that link!",
                "I'll check that out.",
                "Interesting article!",
                "Thanks for the reference."
            ],
            phone: [
                "I'll call you back soon!",
                "Thanks for the number.",
                "I'll save that number.",
                "Got it, thanks!"
            ],
            email: [
                "I'll email you back.",
                "Thanks for the email address.",
                "I'll save that contact.",
                "Got your email, thanks!"
            ]
        };
        
        const typeResponses = responses[messageType] || responses.text;
        return typeResponses[Math.floor(Math.random() * typeResponses.length)];
    }

    async setupCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: this.cameraFacing || 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            
            const video = document.getElementById('camera-video');
            if (video) {
                video.srcObject = this.cameraStream;
                video.play();
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            // Show fallback message
            this.showNotification('Camera access denied. Please allow camera permissions.', 'error');
        }
    }

    async startCamera() {
        if (!this.cameraStream) {
            await this.setupCamera();
        }
    }

    capturePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const context = canvas.getContext('2d');

        if (video && canvas && video.videoWidth > 0) {
            // Set canvas size to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Apply current effect
            context.filter = this.effects[this.currentEffect];
            
            // Draw the video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert to blob and save
            canvas.toBlob((blob) => {
                if (blob) {
                    this.savePhoto(blob);
                    this.showNotification('Photo captured!', 'success');
                } else {
                    this.showNotification('Failed to capture photo', 'error');
                }
            }, 'image/jpeg', 0.9);
        } else {
            this.showNotification('Camera not ready', 'error');
        }
    }

    async savePhoto(blob) {
        try {
            // Create a unique filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `photo-${timestamp}.jpg`;
            
            // Save to local storage (gallery)
            const reader = new FileReader();
            reader.onload = (e) => {
                const photoData = {
                    id: Date.now(),
                    filename: filename,
                    dataUrl: e.target.result,
                    timestamp: new Date().toISOString(),
                    effect: this.currentEffect
                };
                
                this.gallery.unshift(photoData);
                localStorage.setItem('phoneGallery', JSON.stringify(this.gallery));
                console.log('Photo saved to gallery:', photoData);
            };
            reader.readAsDataURL(blob);
            
            // Also try to upload to server
            const formData = new FormData();
            formData.append('photo', blob, filename);

            const response = await fetch('/api/upload-photo', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Photo uploaded to server:', result);
            }
        } catch (error) {
            console.error('Error saving photo:', error);
            this.showNotification('Error saving photo', 'error');
        }
    }

    async switchCamera() {
        try {
            // Stop current stream
            if (this.cameraStream) {
                this.cameraStream.getTracks().forEach(track => track.stop());
            }
            
            // Toggle camera facing
            this.cameraFacing = this.cameraFacing === 'user' ? 'environment' : 'user';
            
            // Setup new camera
            await this.setupCamera();
            
            this.showNotification(`Switched to ${this.cameraFacing === 'user' ? 'front' : 'back'} camera`, 'info');
        } catch (error) {
            console.error('Error switching camera:', error);
            this.showNotification('Failed to switch camera', 'error');
        }
    }

    toggleFlash() {
        console.log('Toggling flash');
    }

    showEffects() {
        // Create effects panel
        const effectsPanel = document.createElement('div');
        effectsPanel.className = 'effects-panel';
        effectsPanel.innerHTML = `
            <div class="effects-header">
                <h3>Camera Effects</h3>
                <button class="close-effects" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="effects-grid">
                ${Object.keys(this.effects).map(effect => `
                    <div class="effect-item ${effect === this.currentEffect ? 'active' : ''}" 
                         onclick="mobileUI.setEffect('${effect}')">
                        <div class="effect-preview" style="filter: ${this.effects[effect]}">
                            <i class="fas fa-camera"></i>
                        </div>
                        <span class="effect-name">${effect.charAt(0).toUpperCase() + effect.slice(1)}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add to camera screen
        const cameraScreen = document.getElementById('camera-screen');
        cameraScreen.appendChild(effectsPanel);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (effectsPanel.parentElement) {
                effectsPanel.remove();
            }
        }, 10000);
    }

    setEffect(effectName) {
        this.currentEffect = effectName;
        const effectFilter = document.getElementById('effect-filter');
        if (effectFilter) {
            effectFilter.style.filter = this.effects[effectName];
        }
        
        // Update active effect in panel
        document.querySelectorAll('.effect-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.effect-item').classList.add('active');
    }

    setCameraMode(mode) {
        this.cameraMode = mode;
        
        // Update active mode button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Update capture button appearance
        const captureBtn = document.getElementById('capture-btn');
        if (captureBtn) {
            if (mode === 'video') {
                captureBtn.classList.add('video-mode');
            } else {
                captureBtn.classList.remove('video-mode');
            }
        }
        
        console.log('Camera mode set to:', mode);
    }

    async toggleVideoRecording() {
        if (!this.isRecording) {
            await this.startVideoRecording();
        } else {
            this.stopVideoRecording();
        }
    }

    async startVideoRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: true
            });

            this.mediaRecorder = new MediaRecorder(stream);
            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.saveVideo();
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.updateRecordingUI(true);
            
            this.showNotification('Recording started...', 'info');
        } catch (error) {
            console.error('Error starting video recording:', error);
            this.showNotification('Failed to start recording', 'error');
        }
    }

    stopVideoRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.updateRecordingUI(false);
            this.showNotification('Recording stopped', 'success');
        }
    }

    updateRecordingUI(isRecording) {
        const captureBtn = document.getElementById('capture-btn');
        if (captureBtn) {
            if (isRecording) {
                captureBtn.classList.add('recording');
                captureBtn.style.background = '#ff3b30';
            } else {
                captureBtn.classList.remove('recording');
                captureBtn.style.background = '';
            }
        }

        // Update mode buttons
        const videoModeBtn = document.querySelector('[data-mode="video"]');
        if (videoModeBtn) {
            if (isRecording) {
                videoModeBtn.style.background = '#ff3b30';
                videoModeBtn.style.color = 'white';
            } else {
                videoModeBtn.style.background = '';
                videoModeBtn.style.color = '';
            }
        }
    }

    async saveVideo() {
        if (this.recordedChunks.length === 0) return;

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob, 'video.webm');

        try {
            const response = await fetch('/api/upload-video', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                console.log('Video saved:', result.url);
                this.showNotification('Video saved!', 'success');
            }
        } catch (error) {
            console.error('Error saving video:', error);
            this.showNotification('Failed to save video', 'error');
        }
    }

    loadGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        // Use local storage gallery or fallback to sample data
        const galleryItems = this.gallery.length > 0 ? this.gallery : Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            dataUrl: `https://picsum.photos/300/300?random=${i}`,
            timestamp: new Date(Date.now() - i * 3600000).toISOString()
        }));

        galleryGrid.innerHTML = galleryItems.map(item => `
            <div class="gallery-item" onclick="mobileUI.viewPhoto('${item.id}')">
                <img src="${item.dataUrl}" alt="Photo ${item.id}">
                <div class="gallery-overlay">
                    <button class="delete-photo-btn" onclick="event.stopPropagation(); mobileUI.deletePhoto(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewPhoto(photoId) {
        console.log('Viewing photo:', photoId);
    }

    loadRecentCalls() {
        const recentCalls = document.getElementById('recent-calls');
        if (!recentCalls) return;

        // Sample recent calls
        const calls = [
            { name: 'John Doe', type: 'video', time: '2 min ago', status: 'missed' },
            { name: 'Jane Smith', type: 'audio', time: '1 hour ago', status: 'answered' },
            { name: 'Mike Johnson', type: 'video', time: 'Yesterday', status: 'answered' }
        ];

        recentCalls.innerHTML = `
            <h3>Recent Calls</h3>
            ${calls.map(call => `
                <div class="call-item">
                    <div class="call-avatar">${call.name.charAt(0)}</div>
                    <div class="call-details">
                        <h4>${call.name}</h4>
                        <p>${call.type} call - ${call.time}</p>
                    </div>
                    <div class="call-actions">
                        <button onclick="mobileUI.startCall('${call.name}')">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button onclick="mobileUI.startVideoCall('${call.name}')">
                            <i class="fas fa-video"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    startCall(contactName = 'John Doe') {
        this.currentCall = {
            contact: contactName,
            type: 'audio',
            startTime: new Date()
        };

        this.showScreen('video-call-screen');
        this.updateCallInfo(contactName, 'Connecting...');
        
        // Simulate call connection
        setTimeout(() => {
            this.updateCallStatus('Connected');
        }, 2000);
    }

    startVideoCall(contactName = 'John Doe') {
        this.currentCall = {
            contact: contactName,
            type: 'video',
            startTime: new Date()
        };

        this.showScreen('video-call-screen');
        this.updateCallInfo(contactName, 'Connecting...');
        
        // Start local video stream
        this.startLocalVideo();
        
        // Simulate call connection
        setTimeout(() => {
            this.updateCallStatus('Connected');
        }, 2000);
    }

    async startLocalVideo() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                localVideo.srcObject = this.localStream;
            }
            
            // Initialize WebRTC peer connection
            this.initializePeerConnection();
        } catch (error) {
            console.error('Error starting local video:', error);
            this.showNotification('Failed to access camera/microphone', 'error');
        }
    }

    initializePeerConnection() {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        
        this.peerConnection = new RTCPeerConnection(configuration);
        
        // Add local stream to peer connection
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
        }
        
        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            const remoteVideo = document.getElementById('remote-video');
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
                this.remoteStream = event.streams[0];
            }
        };
        
        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    roomId: this.currentCall?.roomId
                });
            }
        };
        
        // Handle connection state changes
        this.peerConnection.onconnectionstatechange = () => {
            const state = this.peerConnection.connectionState;
            this.updateCallStatus(state);
            
            if (state === 'connected') {
                this.showNotification('Call connected!', 'success');
            } else if (state === 'disconnected' || state === 'failed') {
                this.endCall();
            }
        };
    }

    async createOffer() {
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            this.socket.emit('call-offer', {
                offer: offer,
                roomId: this.currentCall?.roomId
            });
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    }

    async handleOffer(offer) {
        try {
            await this.peerConnection.setRemoteDescription(offer);
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            this.socket.emit('call-answer', {
                answer: answer,
                roomId: this.currentCall?.roomId
            });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }

    async handleAnswer(answer) {
        try {
            await this.peerConnection.setRemoteDescription(answer);
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }

    async handleIceCandidate(candidate) {
        try {
            await this.peerConnection.addIceCandidate(candidate);
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
        }
    }

    updateCallInfo(contactName, status) {
        const nameElement = document.getElementById('call-contact-name');
        const statusElement = document.getElementById('call-status');
        
        if (nameElement) nameElement.textContent = contactName;
        if (statusElement) statusElement.textContent = status;
    }

    updateCallStatus(status) {
        const statusElement = document.getElementById('call-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        
        this.currentCall = null;
        this.showScreen('home-screen');
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const muteBtn = document.getElementById('mute-btn');
        
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = !this.isMuted;
            });
        }
        
        if (muteBtn) {
            muteBtn.innerHTML = this.isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
            muteBtn.style.background = this.isMuted ? '#ff3b30' : 'rgba(255, 255, 255, 0.2)';
        }
    }

    toggleVideo() {
        this.isVideoOn = !this.isVideoOn;
        const videoBtn = document.getElementById('video-btn');
        
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = this.isVideoOn;
            });
        }
        
        if (videoBtn) {
            videoBtn.innerHTML = this.isVideoOn ? '<i class="fas fa-video"></i>' : '<i class="fas fa-video-slash"></i>';
            videoBtn.style.background = this.isVideoOn ? 'rgba(255, 255, 255, 0.2)' : '#ff3b30';
        }
    }

    toggleSpeaker() {
        this.isSpeakerOn = !this.isSpeakerOn;
        const speakerBtn = document.getElementById('speaker-btn');
        
        if (speakerBtn) {
            speakerBtn.style.background = this.isSpeakerOn ? '#007AFF' : 'rgba(255, 255, 255, 0.2)';
        }
    }

    searchContacts(query) {
        const contacts = document.querySelectorAll('.contact-item');
        contacts.forEach(contact => {
            const name = contact.querySelector('h3').textContent.toLowerCase();
            const phone = contact.querySelector('p').textContent.toLowerCase();
            const matches = name.includes(query.toLowerCase()) || phone.includes(query.toLowerCase());
            contact.style.display = matches ? 'flex' : 'none';
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const colors = {
            info: 'rgba(0, 122, 255, 0.9)',
            success: 'rgba(52, 199, 89, 0.9)',
            error: 'rgba(255, 59, 48, 0.9)',
            warning: 'rgba(255, 149, 0, 0.9)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            z-index: 10000;
            font-size: 14px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Contact Management Functions
    addContact(name, phone, avatar = '👤') {
        const newContact = {
            id: Date.now(),
            name: name,
            phone: phone,
            avatar: avatar,
            lastSeen: 'Just now'
        };
        
        this.contacts.unshift(newContact);
        localStorage.setItem('phoneContacts', JSON.stringify(this.contacts));
        this.showNotification('Contact added successfully!', 'success');
        return newContact;
    }

    editContact(id, name, phone, avatar) {
        const contactIndex = this.contacts.findIndex(c => c.id === id);
        if (contactIndex !== -1) {
            this.contacts[contactIndex] = {
                ...this.contacts[contactIndex],
                name: name,
                phone: phone,
                avatar: avatar
            };
            localStorage.setItem('phoneContacts', JSON.stringify(this.contacts));
            this.showNotification('Contact updated successfully!', 'success');
            return this.contacts[contactIndex];
        }
        return null;
    }

    deleteContact(id) {
        const contactIndex = this.contacts.findIndex(c => c.id === id);
        if (contactIndex !== -1) {
            const deletedContact = this.contacts.splice(contactIndex, 1)[0];
            localStorage.setItem('phoneContacts', JSON.stringify(this.contacts));
            this.showNotification('Contact deleted successfully!', 'success');
            return deletedContact;
        }
        return null;
    }

    getContacts() {
        return this.contacts;
    }

    // Gallery Management Functions
    getGallery() {
        return this.gallery;
    }

    deletePhoto(id) {
        const photoIndex = this.gallery.findIndex(p => p.id === id);
        if (photoIndex !== -1) {
            const deletedPhoto = this.gallery.splice(photoIndex, 1)[0];
            localStorage.setItem('phoneGallery', JSON.stringify(this.gallery));
            this.showNotification('Photo deleted successfully!', 'success');
            return deletedPhoto;
        }
        return null;
    }

    handleCallSignal(data) {
        // Handle WebRTC signaling
        console.log('Received call signal:', data);
    }

    handleIncomingMessage(data) {
        // Handle incoming messages from other users
        if (this.currentScreen === 'chat-screen') {
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                const messageHTML = this.createMessageHTML(
                    data.text, 
                    'received', 
                    new Date(data.timestamp).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                    }), 
                    data.type || 'text'
                );
                chatMessages.insertAdjacentHTML('beforeend', messageHTML);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }
}

// Initialize the mobile phone UI when the page loads
let mobileUI;
document.addEventListener('DOMContentLoaded', () => {
    mobileUI = new MobilePhoneUI();
});

// Global functions for HTML onclick handlers
function showScreen(screenId) {
    if (mobileUI) {
        mobileUI.showScreen(screenId);
    }
}

function startCall(contactName) {
    if (mobileUI) {
        mobileUI.startCall(contactName);
    }
}

function startVideoCall(contactName) {
    if (mobileUI) {
        mobileUI.startVideoCall(contactName);
    }
}

function endCall() {
    if (mobileUI) {
        mobileUI.endCall();
    }
}

// Global contact management functions
function addContact() {
    const name = prompt('Enter contact name:');
    const phone = prompt('Enter phone number:');
    const avatar = prompt('Enter avatar emoji (optional):') || '👤';
    
    if (name && phone && mobileUI) {
        mobileUI.addContact(name, phone, avatar);
        // Refresh contacts if on contacts screen
        if (mobileUI.currentScreen === 'contacts-screen') {
            mobileUI.showScreen('contacts-screen');
        }
    }
}

function editContact(id) {
    if (mobileUI) {
        const contact = mobileUI.contacts.find(c => c.id === id);
        if (contact) {
            const name = prompt('Enter new name:', contact.name);
            const phone = prompt('Enter new phone:', contact.phone);
            const avatar = prompt('Enter new avatar emoji:', contact.avatar) || '👤';
            
            if (name && phone) {
                mobileUI.editContact(id, name, phone, avatar);
                mobileUI.showScreen('contacts-screen');
            }
        }
    }
}

function deleteContact(id) {
    if (mobileUI && confirm('Are you sure you want to delete this contact?')) {
        mobileUI.deleteContact(id);
        mobileUI.showScreen('contacts-screen');
    }
}
