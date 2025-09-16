// TauOS Desktop UI JavaScript
class TauOSDesktop {
    constructor() {
        this.windows = new Map();
        this.windowCounter = 0;
        this.runningApps = new Map();
        this.connectedDevices = new Map();
        this.phoneStatus = 'disconnected';
        this.contacts = JSON.parse(localStorage.getItem('desktopContacts') || '[]');
        this.gallery = JSON.parse(localStorage.getItem('desktopGallery') || '[]');
        this.cameraStream = null;
        this.init();
    }

    init() {
        this.showSplashScreen();
        this.setupEventListeners();
        this.updateTime();
        this.loadApps();
        this.setupDesktopInteractions();
        this.loadUserPreferences();
        this.setupPhoneConnectivity();
        
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
    }

    showSplashScreen() {
        // Show splash screen for 3 seconds, then transition to desktop
        setTimeout(() => {
            const splash = document.getElementById('welcome-splash');
            const desktop = document.getElementById('desktop-container');
            
            splash.classList.add('fade-out');
            
            setTimeout(() => {
                splash.style.display = 'none';
                desktop.style.display = 'flex';
                // Setup desktop-specific event listeners after desktop loads
                this.setupDesktopEventListeners();
            }, 800);
        }, 3000);
    }

    setupEventListeners() {
        // Start button
        document.getElementById('start-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Menu bar dropdowns
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const menuType = e.target.dataset.menu;
                this.showDropdownMenu(menuType, e.target);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('#start-button')) {
                this.closeStartMenu();
            }
            if (!e.target.closest('.dropdown-menu') && !e.target.closest('.menu-item')) {
                this.closeAllDropdowns();
            }
        });


        // System tray
        document.querySelectorAll('.tray-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const title = e.currentTarget.title;
                if (title === 'Battery') {
                    this.showSystemInfo();
                }
            });
        });

        // DateTime click
        document.getElementById('taskbar-time').addEventListener('click', () => {
            this.showSystemInfo();
        });

        // Close system modal
        document.getElementById('close-system').addEventListener('click', () => {
            this.closeSystemModal();
        });

        // Settings modal
        document.getElementById('close-settings').addEventListener('click', () => {
            this.closeSettingsModal();
        });

        // Settings tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchSettingsTab(e.target.dataset.tab);
            });
        });

        // Wallpaper selection
        document.querySelectorAll('.wallpaper-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectWallpaper(e.currentTarget.dataset.wallpaper);
            });
        });

        // Theme selection
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        });

        // Close modal when clicking outside
        document.getElementById('system-modal').addEventListener('click', (e) => {
            if (e.target.id === 'system-modal') {
                this.closeSystemModal();
            }
        });
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        document.getElementById('current-time').textContent = timeString;
        document.getElementById('taskbar-time').textContent = timeString;
    }

    setupDesktopEventListeners() {
        // Center launcher - Multiple approaches for reliability
        console.log('Setting up desktop event listeners...');
        
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            const launcherLogo = document.getElementById('launcher-logo');
            console.log('Setting up center launcher:', launcherLogo);
            
            if (launcherLogo) {
                // Remove any existing listeners
                launcherLogo.removeEventListener('click', this.handleLauncherClick);
                
                // Add new listener with proper binding
                this.handleLauncherClick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Center launcher clicked!');
                    this.toggleAppGrid();
                };
                
                launcherLogo.addEventListener('click', this.handleLauncherClick);
                
                // Also add direct onclick as fallback
                launcherLogo.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Fallback launcher click handler triggered!');
                    this.toggleAppGrid();
                };
                
                // Add mousedown event as additional fallback
                launcherLogo.addEventListener('mousedown', (e) => {
                    console.log('Launcher mousedown event triggered!');
                });
                
                console.log('Center launcher event listener added successfully');
                
                // Test if element is clickable
                console.log('Launcher logo styles:', window.getComputedStyle(launcherLogo));
                console.log('Launcher logo pointer events:', window.getComputedStyle(launcherLogo).pointerEvents);
                
            } else {
                console.error('Center launcher element not found!');
            }
        }, 100);

        // App grid items
        document.querySelectorAll('.app-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const appId = e.currentTarget.dataset.app;
                this.openApp(appId);
                this.hideAppGrid();
            });
        });

        // Hide app grid when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.app-grid-overlay') && !e.target.closest('#launcher-logo')) {
                this.hideAppGrid();
            }
        });
        
        // Global launcher click handler as ultimate fallback
        document.addEventListener('click', (e) => {
            if (e.target.closest('#launcher-logo') || e.target.closest('.center-launcher')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Global launcher click handler triggered!');
                this.toggleAppGrid();
            }
        });

    }

    async loadApps() {
        try {
            const response = await fetch('/api/apps');
            const apps = await response.json();
            this.apps = apps;
            this.populateStartMenu(apps);
        } catch (error) {
            console.error('Failed to load apps:', error);
        }
    }

    populateStartMenu(apps) {
        const appGrid = document.getElementById('start-menu-apps');
        appGrid.innerHTML = '';

        apps.forEach(app => {
            if (app.category !== 'system') {
                const appItem = document.createElement('div');
                appItem.className = 'app-item';
                appItem.dataset.app = app.id;
                appItem.innerHTML = `
                    <i class="fas fa-${this.getAppIcon(app.id)}"></i>
                    <span>${app.name}</span>
                `;
                
                appItem.addEventListener('click', () => {
                    this.openApp(app.id);
                    this.closeStartMenu();
                });
                
                appGrid.appendChild(appItem);
            }
        });
    }

    getAppIcon(appId) {
        const iconMap = {
            'taumail': 'envelope',
            'taucloud': 'cloud',
            'tauid': 'id-card',
            'taustore': 'store',
            'taubrowser': 'globe',
            'files': 'folder',
            'terminal': 'terminal',
            'settings': 'cog'
        };
        return iconMap[appId] || 'question';
    }

    openApp(appId) {
        if (this.runningApps.has(appId)) {
            // Bring existing window to front
            const window = this.runningApps.get(appId);
            this.bringWindowToFront(window);
            return;
        }

        // Handle real TauOS apps with iframe integration
        const realApps = {
            'taumail': {
                name: 'TauMail',
                url: 'https://tauos-47am.vercel.app',
                icon: 'envelope',
                description: 'Secure email system'
            },
            'taucloud': {
                name: 'TauCloud',
                url: 'https://tauos-cloud-backend.vercel.app',
                icon: 'cloud',
                description: 'File storage and sharing'
            },
            'tauid': {
                name: 'TauID',
                url: 'https://tauos-zbtm.vercel.app',
                icon: 'user',
                description: 'Identity management system'
            },
            'taustore': {
                name: 'TauStore',
                url: 'https://tauos-mqo99.vercel.app',
                icon: 'store',
                description: 'App marketplace'
            },
            'taubrowser': {
                name: 'TauBrowser',
                url: 'https://tauos-browser-backend.vercel.app',
                icon: 'globe',
                description: 'Privacy-first web browser'
            }
        };

        if (realApps[appId]) {
            this.openRealApp(realApps[appId], appId);
            return;
        }

        // Handle special apps
        if (appId === 'terminal') {
            this.openTerminal();
            return;
        }
        
        if (appId === 'trash') {
            this.openTrash();
            return;
        }
        
        if (appId === 'settings') {
            this.openSettings();
            return;
        }
        
        if (appId === 'phone-connect') {
            this.openPhoneConnectModal();
            return;
        }
        
        if (appId === 'mobile-ui') {
            this.openMobileUI();
            return;
        }

        const app = this.apps?.find(a => a.id === appId);
        if (!app) return;

        const window = this.createWindow(app);
        this.windows.set(window.id, window);
        this.runningApps.set(appId, window);
        
        this.addToTaskbar(appId, window);
        this.bringWindowToFront(window);
    }

    openRealApp(app, appId) {
        this.windowCounter++;
        const windowId = `window-${this.windowCounter}`;
        
        const window = document.createElement('div');
        window.className = 'window real-app-window';
        window.id = windowId;
        window.style.left = `${100 + (this.windowCounter * 30)}px`;
        window.style.top = `${100 + (this.windowCounter * 30)}px`;
        window.style.zIndex = 1000 + this.windowCounter;
        window.style.width = '1200px';
        window.style.height = '800px';

        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <img src="icons/${appId}-icon.svg" alt="${app.name}" class="window-icon-svg">
                    <span>${app.name}</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize" data-action="minimize"></div>
                    <div class="window-control maximize" data-action="maximize"></div>
                    <div class="window-control close" data-action="close"></div>
                </div>
            </div>
            <div class="window-content real-app-content">
                <iframe src="${app.url}" 
                        frameborder="0" 
                        style="width: 100%; height: 100%; border: none; border-radius: 0 0 12px 12px;"
                        allow="camera; microphone; geolocation; clipboard-read; clipboard-write">
                </iframe>
            </div>
        `;

        // Add window controls
        window.querySelectorAll('.window-control').forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.target.dataset.action;
                this.handleWindowAction(window, action);
            });
        });

        // Make window draggable
        this.makeDraggable(window);

        document.getElementById('windows-container').appendChild(window);
        
        this.windows.set(windowId, window);
        this.runningApps.set(appId, window);
        
        this.addToTaskbar(appId, window);
        this.bringWindowToFront(window);
    }

    createWindow(app) {
        this.windowCounter++;
        const windowId = `window-${this.windowCounter}`;
        
        const window = document.createElement('div');
        window.className = 'window';
        window.id = windowId;
        window.style.left = `${100 + (this.windowCounter * 30)}px`;
        window.style.top = `${100 + (this.windowCounter * 30)}px`;
        window.style.zIndex = 1000 + this.windowCounter;

        const content = this.getAppContent(app);
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="fas fa-${this.getAppIcon(app.id)}"></i>
                    <span>${app.name}</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize" data-action="minimize"></div>
                    <div class="window-control maximize" data-action="maximize"></div>
                    <div class="window-control close" data-action="close"></div>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        // Add window controls
        window.querySelectorAll('.window-control').forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.target.dataset.action;
                this.handleWindowAction(window, action);
            });
        });

        // Make window draggable
        this.makeDraggable(window);

        document.getElementById('windows-container').appendChild(window);
        return window;
    }

    getAppContent(app) {
        if (app.url && app.url !== '#') {
            return `
                <div style="height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px;">
                    <i class="fas fa-${this.getAppIcon(app.id)}" style="font-size: 48px; color: #fbbf24;"></i>
                    <h3>${app.name}</h3>
                    <p style="color: #999; text-align: center; max-width: 300px;">${app.description}</p>
                    <button onclick="window.open('${app.url}', '_blank')" 
                            style="background: linear-gradient(135deg, #fbbf24, #f97316); 
                                   border: none; 
                                   padding: 12px 24px; 
                                   border-radius: 8px; 
                                   color: white; 
                                   font-weight: 500; 
                                   cursor: pointer;
                                   transition: transform 0.2s;">
                        Open ${app.name}
                    </button>
                </div>
            `;
        } else {
            return this.getSystemAppContent(app.id);
        }
    }

    getSystemAppContent(appId) {
        switch (appId) {
            case 'settings':
                return `
                    <div style="padding: 20px;">
                        <h3 style="margin-bottom: 20px; color: #fbbf24;">System Settings</h3>
                        <div style="display: grid; gap: 15px;">
                            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                                <h4>Display</h4>
                                <p style="color: #999; font-size: 14px;">Resolution: 1920x1080</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                                <h4>Network</h4>
                                <p style="color: #999; font-size: 14px;">Status: Connected</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                                <h4>Security</h4>
                                <p style="color: #999; font-size: 14px;">Firewall: Enabled</p>
                            </div>
                        </div>
                    </div>
                `;
            case 'terminal':
                return `
                    <div style="background: #000; color: #0f0; padding: 20px; height: 100%; font-family: 'Courier New', monospace; font-size: 14px;">
                        <div style="margin-bottom: 10px;">TauOS Terminal v1.0.0</div>
                        <div style="margin-bottom: 10px;">Welcome to TauOS Command Line Interface</div>
                        <div style="margin-bottom: 10px;">Type 'help' for available commands</div>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <span>user@tauos:~$</span>
                            <input type="text" style="background: transparent; border: none; color: #0f0; outline: none; flex: 1;" placeholder="Enter command...">
                        </div>
                    </div>
                `;
            case 'files':
                return `
                    <div style="padding: 20px;">
                        <h3 style="margin-bottom: 20px; color: #fbbf24;">File Manager</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px;">
                            <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                <i class="fas fa-folder" style="font-size: 32px; color: #fbbf24; margin-bottom: 8px;"></i>
                                <div>Documents</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                <i class="fas fa-folder" style="font-size: 32px; color: #fbbf24; margin-bottom: 8px;"></i>
                                <div>Downloads</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                <i class="fas fa-folder" style="font-size: 32px; color: #fbbf24; margin-bottom: 8px;"></i>
                                <div>Pictures</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                <i class="fas fa-folder" style="font-size: 32px; color: #fbbf24; margin-bottom: 8px;"></i>
                                <div>Music</div>
                            </div>
                        </div>
                    </div>
                `;
            default:
                return `<div style="padding: 20px; text-align: center;"><h3>${appId}</h3><p>Application content coming soon...</p></div>`;
        }
    }

    makeDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                window.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    handleWindowAction(window, action) {
        switch (action) {
            case 'minimize':
                this.minimizeWindow(window);
                break;
            case 'maximize':
                this.maximizeWindow(window);
                break;
            case 'close':
                this.closeWindow(window);
                break;
        }
    }

    minimizeWindow(window) {
        window.style.display = 'none';
        // In a real implementation, you'd add it to a minimized state
    }

    maximizeWindow(window) {
        if (window.style.width === '100vw') {
            window.style.width = '800px';
            window.style.height = '600px';
        } else {
            window.style.width = '100vw';
            window.style.height = 'calc(100vh - 75px)';
            window.style.left = '0';
            window.style.top = '25px';
        }
    }

    closeWindow(window) {
        const appId = this.getAppIdFromWindow(window);
        if (appId) {
            this.runningApps.delete(appId);
            this.removeFromTaskbar(appId);
        }
        
        this.windows.delete(window.id);
        window.remove();
    }

    getAppIdFromWindow(window) {
        for (const [appId, win] of this.runningApps) {
            if (win === window) {
                return appId;
            }
        }
        return null;
    }

    bringWindowToFront(window) {
        const maxZ = Math.max(...Array.from(this.windows.values()).map(w => parseInt(w.style.zIndex) || 0));
        window.style.zIndex = maxZ + 1;
        window.style.display = 'block';
    }

    addToTaskbar(appId, window) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const appButton = document.createElement('div');
        appButton.className = 'taskbar-app';
        appButton.dataset.app = appId;
        appButton.innerHTML = `<i class="fas fa-${this.getAppIcon(appId)}"></i>`;
        
        appButton.addEventListener('click', () => {
            this.bringWindowToFront(window);
        });
        
        taskbarApps.appendChild(appButton);
    }

    removeFromTaskbar(appId) {
        const appButton = document.querySelector(`[data-app="${appId}"]`);
        if (appButton) {
            appButton.remove();
        }
    }

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.toggle('show');
    }

    closeStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.remove('show');
    }

    showDropdownMenu(menuType, target) {
        this.closeAllDropdowns();
        const menu = document.getElementById(`${menuType}-menu`);
        if (menu) {
            const rect = target.getBoundingClientRect();
            menu.style.left = rect.left + 'px';
            menu.style.display = 'block';
            
            // Add click handlers for dropdown items
            menu.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleDropdownAction(menuType, item.textContent.trim());
                    this.closeAllDropdowns();
                });
            });
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    handleDropdownAction(menuType, action) {
        console.log(`${menuType} menu: ${action}`);
        
        switch (action) {
            case 'System Information':
                this.showSystemInfo();
                break;
            case 'About TauOS':
                this.showAboutDialog();
                break;
            case 'TauOS Help':
                this.showHelpDialog();
                break;
            case 'Minimize All':
                this.minimizeAllWindows();
                break;
            case 'Show Desktop':
                this.showDesktop();
                break;
            default:
                // Handle other actions
                break;
        }
    }

    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.add('show');
        
        // Close context menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', () => {
                contextMenu.classList.remove('show');
            }, { once: true });
        }, 0);
    }

    async showSystemInfo() {
        try {
            const response = await fetch('/api/system-info');
            const systemInfo = await response.json();
            
            const content = document.getElementById('system-info-content');
            content.innerHTML = `
                <div style="display: grid; gap: 20px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px;">
                        <h4 style="color: #fbbf24; margin-bottom: 10px;">System Information</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div><strong>OS:</strong> ${systemInfo.os}</div>
                            <div><strong>Version:</strong> ${systemInfo.version}</div>
                            <div><strong>Architecture:</strong> ${systemInfo.architecture}</div>
                            <div><strong>CPU:</strong> ${systemInfo.cpu}</div>
                            <div><strong>Memory:</strong> ${systemInfo.memory}</div>
                            <div><strong>Storage:</strong> ${systemInfo.storage}</div>
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px;">
                        <h4 style="color: #fbbf24; margin-bottom: 10px;">Runtime Status</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div><strong>Uptime:</strong> ${systemInfo.uptime}</div>
                            <div><strong>Network:</strong> ${systemInfo.network}</div>
                            <div><strong>Battery:</strong> ${systemInfo.battery}</div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('system-modal').classList.add('show');
        } catch (error) {
            console.error('Failed to load system info:', error);
        }
    }

    closeSystemModal() {
        document.getElementById('system-modal').classList.remove('show');
    }

    setupDesktopInteractions() {
        // Desktop right-click
        document.querySelector('.desktop-wallpaper').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.pageX, e.pageY);
        });

        // Desktop click to deselect icons
        document.querySelector('.desktop-wallpaper').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.querySelectorAll('.desktop-icon.selected').forEach(icon => {
                    icon.classList.remove('selected');
                });
            }
        });
    }

    openTerminal() {
        this.windowCounter++;
        const windowId = `terminal-${this.windowCounter}`;
        
        const window = document.createElement('div');
        window.className = 'window terminal-window';
        window.id = windowId;
        window.style.left = '200px';
        window.style.top = '150px';
        window.style.width = '600px';
        window.style.height = '400px';
        window.style.zIndex = 1000 + this.windowCounter;

        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="fas fa-terminal"></i>
                    <span>Terminal — TauOS</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize" data-action="minimize" title="Minimize">−</div>
                    <div class="window-control maximize" data-action="maximize" title="Maximize">□</div>
                    <div class="window-control close" data-action="close" title="Close">×</div>
                </div>
            </div>
            <div class="terminal-content" id="terminal-content-${this.windowCounter}">
                <div class="terminal-line">
                    <span class="terminal-prompt">user@tauos:~$ </span>
                    <span class="terminal-command">welcome to TauOS Terminal</span>
                </div>
                <div class="terminal-line terminal-output">
                    TauOS Terminal v1.0.0 - Privacy-First Operating System
                </div>
                <div class="terminal-line terminal-output">
                    Type 'help' for available commands
                </div>
                <div class="terminal-line">
                    <span class="terminal-prompt">user@tauos:~$ </span>
                    <span class="terminal-command" contenteditable="true" id="terminal-input-${this.windowCounter}"></span>
                </div>
            </div>
        `;

        // Make window draggable
        this.makeDraggable(window);
        
        document.getElementById('windows-container').appendChild(window);
        this.windows.set(windowId, window);
        this.runningApps.set('terminal', window);
        
        this.addToTaskbar('terminal', window);
        this.bringWindowToFront(window);
        this.setupTerminalInteractions(windowId);
    }

    setupTerminalInteractions(windowId) {
        const window = document.getElementById(windowId);
        const input = document.getElementById(`terminal-input-${this.windowCounter}`);
        const content = document.getElementById(`terminal-content-${this.windowCounter}`);
        
        console.log('Setting up terminal interactions:', { windowId, input, content });
        
        // Window controls
        window.querySelectorAll('.window-control').forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.target.dataset.action;
                this.handleWindowAction(window, action);
            });
        });

        // Terminal input handling
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const command = input.textContent.trim();
                    this.executeTerminalCommand(command, content, input);
                }
            });

            // Focus input
            input.focus();
        } else {
            console.error('Terminal input element not found!');
        }
    }

    executeTerminalCommand(command, content, input) {
        // Add command to history
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="terminal-prompt">user@tauos:~$ </span><span class="terminal-command">${command}</span>`;
        content.appendChild(commandLine);

        // Execute command
        let output = '';
        let isError = false;
        
        switch (command.toLowerCase().trim()) {
            case 'help':
                output = `TauOS Terminal v1.0.0 - Available Commands:

System Commands:
  help, h           - Show this help message
  clear, c          - Clear terminal screen
  exit, quit        - Close terminal
  whoami            - Show current user
  pwd               - Print working directory
  date              - Show current date and time
  uptime            - Show system uptime

File Operations:
  ls                - List directory contents
  ls -la            - List with details
  cd <dir>          - Change directory
  mkdir <name>      - Create directory
  touch <file>      - Create file
  cat <file>        - Display file contents
  rm <file>         - Remove file
  rmdir <dir>       - Remove directory

TauOS Commands:
  tauos             - Show TauOS information
  tauos --version   - Show version details
  apps              - List TauOS applications
  services          - Show running services
  network           - Network information
  security          - Security status
  privacy           - Privacy settings

Process Management:
  ps                - Show running processes
  top               - Show system processes
  kill <pid>        - Kill process by ID

Development:
  node --version    - Node.js version
  npm --version     - NPM version
  git --version     - Git version

Type 'man <command>' for detailed help on any command.`;
                break;
                
            case 'clear':
            case 'c':
                content.innerHTML = '';
                const newInput = document.createElement('div');
                newInput.className = 'terminal-line';
                newInput.innerHTML = `<span class="terminal-prompt">user@tauos:~$ </span><span class="terminal-command" contenteditable="true"></span>`;
                content.appendChild(newInput);
                newInput.querySelector('.terminal-command').focus();
                return;
                
            case 'exit':
            case 'quit':
                this.closeWindow(document.getElementById(`terminal-input-${this.windowCounter}`).closest('.window').id);
                return;
                
            case 'ls':
                output = `Desktop/     Documents/   Downloads/   Pictures/    Videos/
TauMail/     TauCloud/    TauID/       TauStore/    TauBrowser/
Applications/ System/      Users/       tmp/         var/`;
                break;
                
            case 'ls -la':
                output = `total 48
drwxr-xr-x 12 user user 4096 Dec 15 10:30 .
drwxr-xr-x  3 root root 4096 Dec 15 09:00 ..
drwxr-xr-x  2 user user 4096 Dec 15 10:30 Desktop
drwxr-xr-x  2 user user 4096 Dec 15 10:30 Documents
drwxr-xr-x  2 user user 4096 Dec 15 10:30 Downloads
drwxr-xr-x  2 user user 4096 Dec 15 10:30 Pictures
drwxr-xr-x  2 user user 4096 Dec 15 10:30 Videos
drwxr-xr-x  2 user user 4096 Dec 15 10:30 TauMail
drwxr-xr-x  2 user user 4096 Dec 15 10:30 TauCloud
drwxr-xr-x  2 user user 4096 Dec 15 10:30 TauID
drwxr-xr-x  2 user user 4096 Dec 15 10:30 TauStore
drwxr-xr-x  2 user user 4096 Dec 15 10:30 TauBrowser`;
                break;
                
            case 'pwd':
                output = '/home/user';
                break;
                
            case 'whoami':
                output = 'user';
                break;
                
            case 'date':
                output = new Date().toString();
                break;
                
            case 'uptime':
                output = ` 10:30:45 up 2 days, 15:30,  1 user,  load average: 0.15, 0.12, 0.08`;
                break;
                
            case 'tauos':
                output = `TauOS v1.0.0
Privacy-First Operating System
Built with security and user privacy in mind
© 2024 TauOS Technologies

Architecture: x86_64
Kernel: TauOS Kernel 6.1.0
Uptime: 2 days, 15 hours, 30 minutes
Memory: 8GB RAM (6.2GB available)
Storage: 512GB SSD (420GB available)`;
                break;
                
            case 'tauos --version':
                output = `TauOS version 1.0.0 (build 2024.1.0)
Release date: December 15, 2024
Kernel version: 6.1.0-tauos
GCC version: 11.3.0
Glibc version: 2.35`;
                break;
                
            case 'apps':
                output = `TauOS Applications:
├── TauMail (Email Client) - Running on port 3001
├── TauCloud (Cloud Storage) - Running on port 3002
├── TauID (Identity Management) - Running on port 3003
├── TauStore (App Store) - Running on port 3004
├── TauBrowser (Web Browser) - Running on port 3005
└── Desktop UI - Running on port 3006`;
                break;
                
            case 'services':
                output = `Active TauOS Services:
● tauos-mail.service      - Email service
● tauos-cloud.service     - Cloud storage service
● tauos-id.service        - Identity service
● tauos-store.service     - App store service
● tauos-browser.service   - Browser service
● tauos-desktop.service   - Desktop environment
● tauos-security.service  - Security monitoring
● tauos-privacy.service   - Privacy protection`;
                break;
                
            case 'network':
                output = `Network Configuration:
Interface: eth0
IP Address: 192.168.1.100
Subnet Mask: 255.255.255.0
Gateway: 192.168.1.1
DNS: 8.8.8.8, 1.1.1.1
Status: Connected
Speed: 1 Gbps`;
                break;
                
            case 'security':
                output = `TauOS Security Status: ✅ SECURE

Firewall: Active
Encryption: AES-256 enabled
VPN: Connected (TauOS VPN)
Antivirus: Real-time protection active
Updates: All security patches applied
Privacy Mode: Enabled
Tracking Protection: Active`;
                break;
                
            case 'privacy':
                output = `TauOS Privacy Settings:

Data Collection: Disabled
Analytics: Disabled
Crash Reports: Disabled
Location Services: Disabled
Camera Access: Disabled
Microphone Access: Disabled
Tracking Protection: Enabled
Anonymous Mode: Enabled
Zero-Knowledge Architecture: Active`;
                break;
                
            case 'ps':
                output = `PID   USER     COMMAND
1     root     /sbin/init
2     root     [kthreadd]
3     root     [rcu_gp]
4     root     [rcu_par_gp]
100   user     tauos-desktop
101   user     tauos-mail
102   user     tauos-cloud
103   user     tauos-id
104   user     tauos-store
105   user     tauos-browser`;
                break;
                
            case 'top':
                output = `top - 10:30:45 up 2 days, 15:30,  1 user,  load average: 0.15, 0.12, 0.08
Tasks: 156 total,   1 running, 155 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.1 us,  0.8 sy,  0.0 ni, 96.8 id,  0.2 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :   8192.0 total,   2048.2 free,   3072.1 used,   3071.7 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   4096.0 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  100 user      20   0  123456   4567   1234 S   2.1   0.1   0:15.67 tauos-desktop
  101 user      20   0   98765   3456    890 S   1.2   0.0   0:08.23 tauos-mail
  102 user      20   0   87654   2345    567 S   0.8   0.0   0:05.45 tauos-cloud`;
                break;
                
            case 'node --version':
                output = 'v18.17.0';
                break;
                
            case 'npm --version':
                output = '9.6.7';
                break;
                
            case 'git --version':
                output = 'git version 2.34.1';
                break;
                
            default:
                if (command.startsWith('cd ')) {
                    const dir = command.substring(3);
                    if (dir === '..' || dir === 'Desktop' || dir === 'Documents' || dir === 'Downloads') {
                        output = `Changed directory to /home/user/${dir}`;
                    } else {
                        output = `cd: ${dir}: No such file or directory`;
                        isError = true;
                    }
                } else if (command.startsWith('mkdir ')) {
                    const dir = command.substring(6);
                    output = `Created directory '${dir}'`;
                } else if (command.startsWith('touch ')) {
                    const file = command.substring(6);
                    output = `Created file '${file}'`;
                } else if (command.startsWith('cat ')) {
                    const file = command.substring(4);
                    output = `cat: ${file}: No such file or directory`;
                    isError = true;
                } else if (command.startsWith('rm ')) {
                    const file = command.substring(3);
                    output = `Removed '${file}'`;
                } else if (command.startsWith('kill ')) {
                    const pid = command.substring(5);
                    output = `Process ${pid} terminated`;
                } else {
                    output = `tauos: command not found: ${command}`;
                    isError = true;
                }
                break;
        }

        // Add output
        const outputLine = document.createElement('div');
        outputLine.className = isError ? 'terminal-line terminal-error' : 'terminal-line terminal-output';
        outputLine.textContent = output;
        content.appendChild(outputLine);

        // Add new prompt
        const newPrompt = document.createElement('div');
        newPrompt.className = 'terminal-line';
        newPrompt.innerHTML = `<span class="terminal-prompt">user@tauos:~$ </span><span class="terminal-command" contenteditable="true"></span>`;
        content.appendChild(newPrompt);
        
        // Clear old input and focus new one
        input.textContent = '';
        newPrompt.querySelector('.terminal-command').focus();
        
        // Scroll to bottom
        content.scrollTop = content.scrollHeight;
    }

    openTrash() {
        this.windowCounter++;
        const windowId = `trash-${this.windowCounter}`;
        
        const window = document.createElement('div');
        window.className = 'window';
        window.id = windowId;
        window.style.left = '300px';
        window.style.top = '200px';
        window.style.width = '500px';
        window.style.height = '350px';
        window.style.zIndex = 1000 + this.windowCounter;

        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="fas fa-trash"></i>
                    <span>Trash</span>
                </div>
                <div class="window-controls">
                    <button class="control-btn minimize" title="Minimize">−</button>
                    <button class="control-btn maximize" title="Maximize">□</button>
                    <button class="control-btn close" title="Close">×</button>
                </div>
            </div>
            <div class="window-content">
                <div class="trash-content">
                    <div class="trash-icon">
                        <i class="fas fa-trash" style="font-size: 48px; color: #666; margin-bottom: 20px;"></i>
                    </div>
                    <h3>Trash is Empty</h3>
                    <p>Items you delete will appear here</p>
                    <div class="trash-actions">
                        <button class="btn btn-primary">Empty Trash</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('windows-container').appendChild(window);
        this.windows.set(windowId, window);
        this.runningApps.set('trash', window);
        
        this.addToTaskbar('trash', window);
        this.bringWindowToFront(window);
        this.setupWindowInteractions(windowId);
    }

    minimizeAllWindows() {
        this.windows.forEach((window, windowId) => {
            this.minimizeWindow(windowId);
        });
    }

    showDesktop() {
        this.minimizeAllWindows();
    }

    showAboutDialog() {
        alert('TauOS v1.0.0\nPrivacy-First Operating System\n© 2024 TauOS Technologies');
    }

    showHelpDialog() {
        alert('TauOS Help\n\nFor support, visit: https://tauos.org/support\n\nKeyboard Shortcuts:\n- Cmd+Space: Open Launch Menu\n- Cmd+Tab: Switch Applications\n- Cmd+Q: Quit Application');
    }

    toggleAppGrid() {
        const appGrid = document.getElementById('app-grid-overlay');
        if (appGrid.style.display === 'none' || appGrid.style.display === '') {
            this.showAppGrid();
        } else {
            this.hideAppGrid();
        }
    }

    showAppGrid() {
        const appGrid = document.getElementById('app-grid-overlay');
        appGrid.style.display = 'flex';
        appGrid.style.animation = 'fadeIn 0.3s ease';
    }

    hideAppGrid() {
        const appGrid = document.getElementById('app-grid-overlay');
        appGrid.style.display = 'none';
    }

    openSettings() {
        const settingsModal = document.getElementById('settings-modal');
        settingsModal.classList.add('show');
    }

    closeSettingsModal() {
        const settingsModal = document.getElementById('settings-modal');
        settingsModal.classList.remove('show');
    }

    switchSettingsTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    selectWallpaper(wallpaper) {
        // Remove active class from all wallpaper items
        document.querySelectorAll('.wallpaper-item').forEach(item => item.classList.remove('active'));
        
        // Add active class to selected wallpaper
        document.querySelector(`[data-wallpaper="${wallpaper}"]`).classList.add('active');
        
        // Apply wallpaper to desktop
        const desktop = document.getElementById('desktop-wallpaper');
        const wallpaperClasses = {
            'default': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            'dark-blue': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            'purple': 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)',
            'green': 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
            'red': 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #ef4444 100%)',
            'orange': 'linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #f97316 100%)'
        };
        
        desktop.style.background = wallpaperClasses[wallpaper];
        
        // Save preference
        localStorage.setItem('tauos-wallpaper', wallpaper);
    }

    changeTheme(theme) {
        const body = document.body;
        
        if (theme === 'light') {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        } else {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        }
        
        // Save preference
        localStorage.setItem('tauos-theme', theme);
    }

    loadUserPreferences() {
        // Load wallpaper preference
        const savedWallpaper = localStorage.getItem('tauos-wallpaper');
        if (savedWallpaper) {
            this.selectWallpaper(savedWallpaper);
        }
        
        // Load theme preference
        const savedTheme = localStorage.getItem('tauos-theme');
        if (savedTheme) {
            this.changeTheme(savedTheme);
        }
    }

    // Phone Connectivity Methods
    setupPhoneConnectivity() {
        // Add phone tray icon click handler
        const phoneTrayIcon = document.getElementById('phone-tray-icon');
        if (phoneTrayIcon) {
            phoneTrayIcon.addEventListener('click', () => {
                this.openPhoneConnectModal();
            });
        }

        // Setup phone connect modal tabs
        document.querySelectorAll('.phone-connect-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchPhoneTab(e.target.dataset.tab);
            });
        });

        // Check for mobile UI connection
        this.checkMobileUIConnection();
    }

    openPhoneConnectModal() {
        const modal = document.getElementById('phone-connect-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.updatePhoneStatus();
        }
    }

    switchPhoneTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.phone-connect-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.phone-connect-modal .tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    updatePhoneStatus() {
        const statusIndicator = document.getElementById('phone-status');
        if (statusIndicator) {
            statusIndicator.className = `phone-status-indicator ${this.phoneStatus}`;
        }
    }

    checkMobileUIConnection() {
        // Check if mobile UI is accessible
        fetch('http://localhost:3007/api/phone-status')
            .then(response => {
                if (response.ok) {
                    this.phoneStatus = 'connected';
                    this.connectedDevices.set('mobile-ui', {
                        name: 'TauOS Mobile UI',
                        type: 'mobile',
                        url: 'http://localhost:3007',
                        status: 'connected'
                    });
                } else {
                    this.phoneStatus = 'disconnected';
                }
            })
            .catch(() => {
                this.phoneStatus = 'disconnected';
            })
            .finally(() => {
                this.updatePhoneStatus();
            });
    }

    connectAppleDevice() {
        this.showNotification('Connecting to iPhone...', 'info');
        this.phoneStatus = 'connecting';
        this.updatePhoneStatus();

        // Simulate connection process
        setTimeout(() => {
            this.showNotification('iPhone connected successfully!', 'success');
            this.phoneStatus = 'connected';
            this.updatePhoneStatus();
            
            this.connectedDevices.set('iphone', {
                name: 'iPhone',
                type: 'apple',
                status: 'connected'
            });
        }, 2000);
    }

    connectAndroidDevice() {
        this.showNotification('Connecting to Android device...', 'info');
        this.phoneStatus = 'connecting';
        this.updatePhoneStatus();

        // Simulate connection process
        setTimeout(() => {
            this.showNotification('Android device connected successfully!', 'success');
            this.phoneStatus = 'connected';
            this.updatePhoneStatus();
            
            this.connectedDevices.set('android', {
                name: 'Android Phone',
                type: 'android',
                status: 'connected'
            });
        }, 2000);
    }

    connectTauOSMobile() {
        this.showNotification('Connecting to TauOS Mobile UI...', 'info');
        this.phoneStatus = 'connecting';
        this.updatePhoneStatus();

        // Check if mobile UI is running
        fetch('http://localhost:3007/api/phone-status')
            .then(response => {
                if (response.ok) {
                    this.showNotification('TauOS Mobile UI connected!', 'success');
                    this.phoneStatus = 'connected';
                    this.updatePhoneStatus();
                    
                    this.connectedDevices.set('mobile-ui', {
                        name: 'TauOS Mobile UI',
                        type: 'mobile',
                        url: 'http://localhost:3007',
                        status: 'connected'
                    });
                } else {
                    throw new Error('Mobile UI not accessible');
                }
            })
            .catch(() => {
                this.showNotification('Failed to connect to Mobile UI. Make sure it\'s running on port 3007.', 'error');
                this.phoneStatus = 'disconnected';
                this.updatePhoneStatus();
            });
    }

    openMobileUI() {
        const window = document.getElementById('mobile-ui-window');
        if (window) {
            window.style.display = 'block';
            this.bringWindowToFront('mobile-ui-window');
        }
    }

    disconnectDevice(deviceId) {
        if (this.connectedDevices.has(deviceId)) {
            this.connectedDevices.delete(deviceId);
            this.showNotification('Device disconnected', 'info');
            
            if (this.connectedDevices.size === 0) {
                this.phoneStatus = 'disconnected';
                this.updatePhoneStatus();
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#34c759' : type === 'error' ? '#ff3b30' : '#007AFF'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Contact Management Functions
    addContact(name, phone, email, avatar = '👤') {
        const newContact = {
            id: Date.now(),
            name: name,
            phone: phone,
            email: email,
            avatar: avatar,
            lastSeen: 'Just now'
        };
        
        this.contacts.unshift(newContact);
        localStorage.setItem('desktopContacts', JSON.stringify(this.contacts));
        this.showNotification('Contact added successfully!', 'success');
        return newContact;
    }

    editContact(id, name, phone, email, avatar) {
        const contactIndex = this.contacts.findIndex(c => c.id === id);
        if (contactIndex !== -1) {
            this.contacts[contactIndex] = {
                ...this.contacts[contactIndex],
                name: name,
                phone: phone,
                email: email,
                avatar: avatar
            };
            localStorage.setItem('desktopContacts', JSON.stringify(this.contacts));
            this.showNotification('Contact updated successfully!', 'success');
            return this.contacts[contactIndex];
        }
        return null;
    }

    deleteContact(id) {
        const contactIndex = this.contacts.findIndex(c => c.id === id);
        if (contactIndex !== -1) {
            const deletedContact = this.contacts.splice(contactIndex, 1)[0];
            localStorage.setItem('desktopContacts', JSON.stringify(this.contacts));
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
            localStorage.setItem('desktopGallery', JSON.stringify(this.gallery));
            this.showNotification('Photo deleted successfully!', 'success');
            return deletedPhoto;
        }
        return null;
    }

    // Camera Functions
    async setupCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            return this.cameraStream;
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showNotification('Camera access denied. Please allow camera permissions.', 'error');
            return null;
        }
    }

    capturePhoto() {
        const video = document.getElementById('desktop-camera-video');
        const canvas = document.getElementById('desktop-camera-canvas');
        const context = canvas.getContext('2d');

        if (video && canvas && video.videoWidth > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
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
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `desktop-photo-${timestamp}.jpg`;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const photoData = {
                    id: Date.now(),
                    filename: filename,
                    dataUrl: e.target.result,
                    timestamp: new Date().toISOString(),
                    source: 'desktop'
                };
                
                this.gallery.unshift(photoData);
                localStorage.setItem('desktopGallery', JSON.stringify(this.gallery));
                console.log('Photo saved to desktop gallery:', photoData);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error saving photo:', error);
            this.showNotification('Error saving photo', 'error');
        }
    }
}

// Global functions for phone connectivity
function connectAppleDevice() {
    if (window.desktop) {
        window.desktop.connectAppleDevice();
    }
}

function connectAndroidDevice() {
    if (window.desktop) {
        window.desktop.connectAndroidDevice();
    }
}

function connectTauOSMobile() {
    if (window.desktop) {
        window.desktop.connectTauOSMobile();
    }
}

function openMobileUI() {
    if (window.desktop) {
        window.desktop.openMobileUI();
    }
}

function disconnectDevice(deviceId) {
    if (window.desktop) {
        window.desktop.disconnectDevice(deviceId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Global desktop contact management functions
function addDesktopContact() {
    const name = prompt('Enter contact name:');
    const phone = prompt('Enter phone number:');
    const email = prompt('Enter email address:');
    const avatar = prompt('Enter avatar emoji (optional):') || '👤';
    
    if (name && phone && email && window.desktop) {
        window.desktop.addContact(name, phone, email, avatar);
    }
}

function editDesktopContact(id) {
    if (window.desktop) {
        const contact = window.desktop.contacts.find(c => c.id === id);
        if (contact) {
            const name = prompt('Enter new name:', contact.name);
            const phone = prompt('Enter new phone:', contact.phone);
            const email = prompt('Enter new email:', contact.email);
            const avatar = prompt('Enter new avatar emoji:', contact.avatar) || '👤';
            
            if (name && phone && email) {
                window.desktop.editContact(id, name, phone, email, avatar);
            }
        }
    }
}

function deleteDesktopContact(id) {
    if (window.desktop && confirm('Are you sure you want to delete this contact?')) {
        window.desktop.deleteContact(id);
    }
}

function captureDesktopPhoto() {
    if (window.desktop) {
        window.desktop.capturePhoto();
    }
}

// Initialize desktop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.desktop = new TauOSDesktop();
    console.log('Desktop initialized and available as window.desktop');
});
