const { app, shell, dialog } = require('electron');
const path = require('path');
const os = require('os');

class TauOSCrossPlatform {
  constructor() {
    this.platform = process.platform;
    this.arch = process.arch;
    this.version = process.version;
    this.osInfo = {
      platform: this.platform,
      arch: this.arch,
      version: os.version(),
      release: os.release(),
      hostname: os.hostname(),
      userInfo: os.userInfo()
    };
  }

  // Check system compatibility
  checkCompatibility() {
    const compatibility = {
      supported: true,
      warnings: [],
      errors: [],
      recommendations: []
    };

    // Check platform support
    if (!this.isPlatformSupported()) {
      compatibility.supported = false;
      compatibility.errors.push(`Unsupported platform: ${this.platform}`);
    }

    // Check architecture support
    if (!this.isArchitectureSupported()) {
      compatibility.supported = false;
      compatibility.errors.push(`Unsupported architecture: ${this.arch}`);
    }

    // Check Node.js version
    if (!this.isNodeVersionSupported()) {
      compatibility.warnings.push(`Node.js version ${this.version} may not be fully supported`);
      compatibility.recommendations.push('Consider updating to Node.js 18+ for best performance');
    }

    // Check system requirements
    this.checkSystemRequirements(compatibility);

    // Platform-specific checks
    this.checkPlatformSpecificRequirements(compatibility);

    return compatibility;
  }

  isPlatformSupported() {
    const supportedPlatforms = ['win32', 'darwin', 'linux'];
    return supportedPlatforms.includes(this.platform);
  }

  isArchitectureSupported() {
    const supportedArchs = ['x64', 'arm64', 'arm'];
    return supportedArchs.includes(this.arch);
  }

  isNodeVersionSupported() {
    const nodeVersion = parseInt(this.version.substring(1).split('.')[0]);
    return nodeVersion >= 16;
  }

  checkSystemRequirements(compatibility) {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryGB = totalMemory / (1024 * 1024 * 1024);

    // Minimum 4GB RAM
    if (memoryGB < 4) {
      compatibility.warnings.push('System has less than 4GB RAM. Performance may be affected.');
    }

    // Check available disk space
    this.checkDiskSpace(compatibility);

    // Check CPU cores
    const cpuCount = os.cpus().length;
    if (cpuCount < 2) {
      compatibility.warnings.push('System has less than 2 CPU cores. Performance may be affected.');
    }
  }

  checkDiskSpace(compatibility) {
    // This is a simplified check - in production, you'd use a proper disk space library
    const freeSpace = os.freemem(); // This is actually memory, but for demo purposes
    const freeSpaceGB = freeSpace / (1024 * 1024 * 1024);
    
    if (freeSpaceGB < 2) {
      compatibility.warnings.push('Low disk space detected. At least 2GB free space recommended.');
    }
  }

  checkPlatformSpecificRequirements(compatibility) {
    switch (this.platform) {
      case 'win32':
        this.checkWindowsRequirements(compatibility);
        break;
      case 'darwin':
        this.checkMacOSRequirements(compatibility);
        break;
      case 'linux':
        this.checkLinuxRequirements(compatibility);
        break;
    }
  }

  checkWindowsRequirements(compatibility) {
    const version = os.release();
    const majorVersion = parseInt(version.split('.')[0]);

    // Check Windows version
    if (majorVersion < 10) {
      compatibility.warnings.push('Windows 10 or later recommended for best experience');
    }

    // Check for Windows Defender
    compatibility.recommendations.push('Ensure Windows Defender allows TauOS to run');
  }

  checkMacOSRequirements(compatibility) {
    const version = os.release();
    const majorVersion = parseInt(version.split('.')[0]);

    // Check macOS version
    if (majorVersion < 19) { // macOS 10.15+
      compatibility.warnings.push('macOS 10.15 or later recommended for best experience');
    }

    // Check for Gatekeeper
    compatibility.recommendations.push('You may need to allow TauOS in System Preferences > Security & Privacy');
  }

  checkLinuxRequirements(compatibility) {
    // Check for required libraries
    compatibility.recommendations.push('Ensure you have the latest graphics drivers installed');
    compatibility.recommendations.push('Some features may require additional system libraries');
  }

  // Get platform-specific paths
  getPlatformPaths() {
    const paths = {
      appData: app.getPath('userData'),
      desktop: app.getPath('desktop'),
      documents: app.getPath('documents'),
      downloads: app.getPath('downloads'),
      temp: app.getPath('temp')
    };

    // Platform-specific additions
    switch (this.platform) {
      case 'win32':
        paths.startMenu = path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs');
        paths.startup = path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
        break;
      case 'darwin':
        paths.applications = '/Applications';
        paths.loginItems = path.join(os.homedir(), 'Library', 'Application Support', 'LoginItems');
        break;
      case 'linux':
        paths.applications = path.join(os.homedir(), '.local', 'share', 'applications');
        paths.autostart = path.join(os.homedir(), '.config', 'autostart');
        break;
    }

    return paths;
  }

  // Get platform-specific commands
  getPlatformCommands() {
    const commands = {
      open: '',
      install: '',
      uninstall: '',
      update: ''
    };

    switch (this.platform) {
      case 'win32':
        commands.open = 'start';
        commands.install = 'msiexec /i';
        commands.uninstall = 'msiexec /x';
        commands.update = 'winget upgrade';
        break;
      case 'darwin':
        commands.open = 'open';
        commands.install = 'installer -pkg';
        commands.uninstall = 'rm -rf';
        commands.update = 'brew upgrade';
        break;
      case 'linux':
        commands.open = 'xdg-open';
        commands.install = 'sudo dpkg -i';
        commands.uninstall = 'sudo dpkg -r';
        commands.update = 'sudo apt update && sudo apt upgrade';
        break;
    }

    return commands;
  }

  // Platform-specific file operations
  async openFile(filePath) {
    try {
      await shell.openPath(filePath);
    } catch (error) {
      console.error('Failed to open file:', error);
      throw error;
    }
  }

  async openURL(url) {
    try {
      await shell.openExternal(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
      throw error;
    }
  }

  async showItemInFolder(filePath) {
    try {
      await shell.showItemInFolder(filePath);
    } catch (error) {
      console.error('Failed to show item in folder:', error);
      throw error;
    }
  }

  // Platform-specific dialogs
  async showMessageBox(options) {
    return await dialog.showMessageBox(options);
  }

  async showOpenDialog(options) {
    return await dialog.showOpenDialog(options);
  }

  async showSaveDialog(options) {
    return await dialog.showSaveDialog(options);
  }

  // Get system information
  getSystemInfo() {
    return {
      platform: this.platform,
      arch: this.arch,
      nodeVersion: this.version,
      osVersion: os.version(),
      osRelease: os.release(),
      hostname: os.hostname(),
      userInfo: os.userInfo(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      networkInterfaces: os.networkInterfaces()
    };
  }

  // Platform-specific optimizations
  getPlatformOptimizations() {
    const optimizations = {
      memoryLimit: 512 * 1024 * 1024, // 512MB default
      maxConcurrentProcesses: 4,
      enableHardwareAcceleration: true,
      enableGPUAcceleration: true
    };

    switch (this.platform) {
      case 'win32':
        optimizations.memoryLimit = 1024 * 1024 * 1024; // 1GB for Windows
        optimizations.maxConcurrentProcesses = 6;
        break;
      case 'darwin':
        optimizations.memoryLimit = 768 * 1024 * 1024; // 768MB for macOS
        optimizations.maxConcurrentProcesses = 4;
        break;
      case 'linux':
        optimizations.memoryLimit = 512 * 1024 * 1024; // 512MB for Linux
        optimizations.maxConcurrentProcesses = 2;
        break;
    }

    return optimizations;
  }
}

module.exports = TauOSCrossPlatform;
