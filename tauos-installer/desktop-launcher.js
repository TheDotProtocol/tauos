const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

class TauOSDesktopLauncher {
  constructor() {
    this.tray = null;
    this.mainWindow = null;
    this.appProcesses = new Map();
    this.isQuitting = false;
  }

  initialize() {
    // Create system tray
    this.createTray();
    
    // Create main window (hidden by default)
    this.createMainWindow();
    
    // Start all TauOS services
    this.startTauOSServices();
    
    // Handle app events
    this.setupEventHandlers();
  }

  createTray() {
    // Create tray icon
    const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath);
    
    this.tray = new Tray(trayIcon);
    this.tray.setToolTip('TauOS - Privacy-First Operating System');
    
    // Create context menu
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'TauOS Desktop',
        click: () => this.showMainWindow()
      },
      { type: 'separator' },
      {
        label: 'TauMail',
        click: () => this.openApp('TauMail', 3001)
      },
      {
        label: 'TauCloud',
        click: () => this.openApp('TauCloud', 3002)
      },
      {
        label: 'TauID',
        click: () => this.openApp('TauID', 3003)
      },
      {
        label: 'TauStore',
        click: () => this.openApp('TauStore', 3004)
      },
      {
        label: 'TauBrowser',
        click: () => this.openApp('TauBrowser', 3005)
      },
      { type: 'separator' },
      {
        label: 'Desktop UI',
        click: () => this.openApp('Desktop UI', 3006)
      },
      {
        label: 'Mobile UI',
        click: () => this.openApp('Mobile UI', 3007)
      },
      { type: 'separator' },
      {
        label: 'System Status',
        click: () => this.showSystemStatus()
      },
      {
        label: 'Settings',
        click: () => this.showSettings()
      },
      { type: 'separator' },
      {
        label: 'Quit TauOS',
        click: () => this.quitApp()
      }
    ]);
    
    this.tray.setContextMenu(contextMenu);
    
    // Double-click to show main window
    this.tray.on('double-click', () => {
      this.showMainWindow();
    });
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      show: false,
      icon: path.join(__dirname, 'assets', 'icon.png'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Load the desktop launcher UI
    this.mainWindow.loadFile('desktop-launcher.html');

    // Hide window when closed
    this.mainWindow.on('close', (event) => {
      if (!this.isQuitting) {
        event.preventDefault();
        this.mainWindow.hide();
      }
    });
  }

  showMainWindow() {
    if (this.mainWindow) {
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }

  startTauOSServices() {
    const services = [
      { name: 'TauMail', port: 3001, path: 'apps/taumail' },
      { name: 'TauCloud', port: 3002, path: 'apps/taucloud' },
      { name: 'TauID', port: 3003, path: 'apps/tauid' },
      { name: 'TauStore', port: 3004, path: 'apps/taustore' },
      { name: 'TauBrowser', port: 3005, path: 'apps/taubrowser' },
      { name: 'Desktop UI', port: 3006, path: 'apps/desktop' },
      { name: 'Mobile UI', port: 3007, path: 'apps/mobile' }
    ];

    services.forEach(service => {
      this.startService(service);
    });
  }

  startService(service) {
    const servicePath = path.join(__dirname, service.path);
    
    try {
      const proc = spawn('node', ['app.js'], {
        cwd: servicePath,
        stdio: 'pipe'
      });

      this.appProcesses.set(service.name, proc);
      
      proc.stdout.on('data', (data) => {
        console.log(`${service.name}: ${data}`);
      });

      proc.stderr.on('data', (data) => {
        console.error(`${service.name} Error: ${data}`);
      });

      proc.on('close', (code) => {
        console.log(`${service.name} process exited with code ${code}`);
        this.appProcesses.delete(service.name);
      });

      console.log(`Started ${service.name} on port ${service.port}`);
    } catch (error) {
      console.error(`Failed to start ${service.name}:`, error);
    }
  }

  openApp(appName, port) {
    const url = `http://localhost:${port}`;
    shell.openExternal(url);
  }

  showSystemStatus() {
    const status = {
      services: Array.from(this.appProcesses.keys()),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform
    };

    dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'TauOS System Status',
      message: `Services Running: ${status.services.length}/7\nUptime: ${Math.round(status.uptime)}s\nPlatform: ${status.platform}`,
      detail: `Active Services:\n${status.services.join('\n')}`
    });
  }

  showSettings() {
    // Open settings window or show settings dialog
    dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'TauOS Settings',
      message: 'Settings panel will be implemented in Phase 3',
      detail: 'This will include privacy settings, app preferences, and system configuration options.'
    });
  }

  quitApp() {
    this.isQuitting = true;
    
    // Stop all services
    this.appProcesses.forEach((proc, name) => {
      console.log(`Stopping ${name}...`);
      proc.kill();
    });
    
    // Quit the app
    app.quit();
  }

  setupEventHandlers() {
    // Handle app ready
    app.whenReady().then(() => {
      this.initialize();
    });

    // Handle window-all-closed
    app.on('window-all-closed', () => {
      // Don't quit on macOS when all windows are closed
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Handle activate (macOS)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    // Handle before-quit
    app.on('before-quit', () => {
      this.isQuitting = true;
    });
  }
}

// Initialize the desktop launcher
const launcher = new TauOSDesktopLauncher();
