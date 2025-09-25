const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const TauOSSystemIntegration = require('./system-integration');
const TauOSCrossPlatform = require('./cross-platform');
const TauOSSecurityVerification = require('./security-verification');
const TauOSOTAUpdateSystem = require('./ota-update-system');
const TauOSProductionConfig = require('./production-config');

// Keep a global reference of the window object
let mainWindow;
let appProcesses = [];
let systemIntegration;
let crossPlatform;
let securityVerification;
let otaUpdateSystem;
let productionConfig;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'TauOS - Privacy-First Operating System',
    show: false,
    frame: false,
    titleBarStyle: 'hiddenInset'
  });

  // Load the installer UI
  mainWindow.loadFile('installer.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    // Kill all app processes when installer closes
    appProcesses.forEach(proc => {
      if (proc && !proc.killed) {
        proc.kill();
      }
    });
  });
}

// App event handlers
app.whenReady().then(async () => {
  // Initialize production configuration
  productionConfig = new TauOSProductionConfig();
  await productionConfig.initialize();
  
  // Initialize cross-platform compatibility
  crossPlatform = new TauOSCrossPlatform();
  
  // Check system compatibility
  const compatibility = crossPlatform.checkCompatibility();
  console.log('System compatibility check:', compatibility);
  
  // Initialize system integration
  systemIntegration = new TauOSSystemIntegration();
  
  // Initialize security verification
  securityVerification = new TauOSSecurityVerification();
  
  // Initialize OTA update system
  otaUpdateSystem = new TauOSOTAUpdateSystem();
  
  // Create main window
  createWindow();
  
  // Initialize all systems after window is ready
  mainWindow.once('ready-to-show', async () => {
    try {
      // Initialize system integration
      await systemIntegration.initialize();
      console.log('✅ System integration completed');
      
      // Initialize security verification
      await securityVerification.setupSecurity();
      console.log('✅ Security verification completed');
      
      // Initialize OTA update system
      await otaUpdateSystem.initialize();
      console.log('✅ OTA update system completed');
      
      console.log('🎉 All Phase 3 systems initialized successfully!');
    } catch (error) {
      console.error('❌ System initialization failed:', error);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for installer functionality
ipcMain.handle('install-tauos', async (event, options) => {
  try {
    const installPath = options.installPath || path.join(process.env.USERPROFILE || process.env.HOME, 'TauOS');
    
    // Create installation directory
    if (!fs.existsSync(installPath)) {
      fs.mkdirSync(installPath, { recursive: true });
    }

    // Copy application files
    await copyAppFiles(installPath);
    
    // Create desktop shortcuts
    await createDesktopShortcuts(installPath);
    
    // Start TauOS services
    await startTauOSServices(installPath);
    
    return { success: true, installPath };
  } catch (error) {
    console.error('Installation error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('start-tauos', async (event) => {
  try {
    const installPath = path.join(process.env.USERPROFILE || process.env.HOME, 'TauOS');
    await startTauOSServices(installPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-tauos', async (event) => {
  try {
    appProcesses.forEach(proc => {
      if (proc && !proc.killed) {
        proc.kill();
      }
    });
    appProcesses = [];
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-system-requirements', async (event) => {
  if (crossPlatform) {
    return crossPlatform.getSystemInfo();
  }
  
  const requirements = {
    os: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    diskSpace: await getDiskSpace()
  };
  return requirements;
});

ipcMain.handle('get-system-compatibility', async (event) => {
  if (crossPlatform) {
    return crossPlatform.checkCompatibility();
  }
  return { supported: true, warnings: [], errors: [] };
});

ipcMain.handle('get-platform-paths', async (event) => {
  if (crossPlatform) {
    return crossPlatform.getPlatformPaths();
  }
  return {};
});

ipcMain.handle('open-app', async (event, appName, port) => {
  try {
    const url = `http://localhost:${port}`;
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('show-desktop-launcher', async (event) => {
  try {
    // Launch the desktop launcher
    const launcherPath = path.join(__dirname, 'desktop-launcher.js');
    const launcherProcess = spawn('node', [launcherPath], {
      detached: true,
      stdio: 'ignore'
    });
    launcherProcess.unref();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Phase 3: Security and Verification IPC handlers
ipcMain.handle('verify-installer-integrity', async (event) => {
  try {
    if (securityVerification) {
      const result = await securityVerification.verifyInstallerFiles();
      return { success: true, result };
    }
    return { success: false, error: 'Security verification not initialized' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-for-updates', async (event) => {
  try {
    if (otaUpdateSystem) {
      await otaUpdateSystem.manualUpdateCheck();
      return { success: true };
    }
    return { success: false, error: 'OTA update system not initialized' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-production-config', async (event) => {
  try {
    if (productionConfig) {
      return { success: true, config: productionConfig.getSystemInfo() };
    }
    return { success: false, error: 'Production config not initialized' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-security-status', async (event) => {
  try {
    if (securityVerification) {
      const status = {
        codeSigning: fs.existsSync('private.pem') && fs.existsSync('public.pem'),
        checksums: fs.existsSync('checksums.json'),
        signatures: fs.existsSync('dist/TauOS Setup 1.0.0.exe.sig'),
        securityManifest: fs.existsSync('security-manifest.json')
      };
      return { success: true, status };
    }
    return { success: false, error: 'Security verification not initialized' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Helper functions
async function copyAppFiles(installPath) {
  const sourceDir = path.join(__dirname, 'apps');
  const targetDir = path.join(installPath, 'apps');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy all app files
  const files = fs.readdirSync(sourceDir);
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

async function copyDirectory(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

async function createDesktopShortcuts(installPath) {
  // This would create platform-specific shortcuts
  // Implementation depends on the platform
  console.log('Creating desktop shortcuts...');
}

async function startTauOSServices(installPath) {
  const appsDir = path.join(installPath, 'apps');
  
  // Start each TauOS service
  const services = [
    { name: 'TauMail', port: 3001, dir: 'taumail' },
    { name: 'TauCloud', port: 3002, dir: 'taucloud' },
    { name: 'TauID', port: 3003, dir: 'tauid' },
    { name: 'TauStore', port: 3004, dir: 'taustore' },
    { name: 'TauBrowser', port: 3005, dir: 'taubrowser' },
    { name: 'DesktopUI', port: 3006, dir: 'desktop' },
    { name: 'MobileUI', port: 3007, dir: 'mobile' }
  ];
  
  for (const service of services) {
    const servicePath = path.join(appsDir, service.dir);
    if (fs.existsSync(servicePath)) {
      const proc = spawn('node', ['app.js'], {
        cwd: servicePath,
        stdio: 'pipe'
      });
      
      appProcesses.push(proc);
      console.log(`Started ${service.name} on port ${service.port}`);
    }
  }
}

async function getDiskSpace() {
  // Simple disk space check
  return {
    free: 'Unknown',
    total: 'Unknown'
  };
}

// Handle external links
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
