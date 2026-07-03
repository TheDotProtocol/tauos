/**
 * TauOS OS Installer — writes bootable ISO to USB and manages disk installation.
 */
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class TauOSInstaller {
  constructor(appRoot) {
    this.appRoot = appRoot;
    this.isoPaths = [
      path.join(appRoot, 'resources', 'TauOS-Desktop.iso'),
      path.join(appRoot, 'resources', 'TauOS-Desktop-v1.0.0.iso'),
      path.join(appRoot, '..', '..', 'release-files', 'TauOS-Desktop-v1.0.0.iso'),
      path.join(appRoot, '..', '..', 'tauos-desktop.iso'),
      path.join(appRoot, '..', '..', 'public', 'TauOS-Desktop.iso'),
    ];
  }

  findIso() {
    for (const p of this.isoPaths) {
      if (fs.existsSync(p)) {
        const stat = fs.statSync(p);
        if (stat.size > 50 * 1024 * 1024) return p;
      }
    }
    return null;
  }

  getInstallMode() {
    return {
      isoAvailable: !!this.findIso(),
      isoPath: this.findIso(),
      platform: process.platform,
      arch: process.arch,
      canWriteUsb: process.platform === 'darwin' || process.platform === 'linux' || process.platform === 'win32',
    };
  }

  listUsbDrives() {
    try {
      if (process.platform === 'darwin') {
        const out = execSync('diskutil list external physical', { encoding: 'utf8' });
        const drives = [];
        const blocks = out.split(/^\/dev\//m).slice(1);
        for (const block of blocks) {
          const firstLine = block.split('\n')[0];
          const id = firstLine.trim().split(/\s+/)[0];
          if (id) drives.push({ id: `/dev/${id}`, label: firstLine.trim(), platform: 'darwin' });
        }
        return drives;
      }
      if (process.platform === 'linux') {
        const out = execSync('lsblk -dpno NAME,SIZE,MODEL,TRAN 2>/dev/null | grep usb || lsblk -dpno NAME,SIZE,MODEL', { encoding: 'utf8' });
        return out.trim().split('\n').filter(Boolean).map(line => {
          const [id, size, ...rest] = line.split(/\s+/);
          return { id, label: `${size} ${rest.join(' ')}`, platform: 'linux' };
        });
      }
      if (process.platform === 'win32') {
        const ps = `Get-Disk | Where-Object {$_.BusType -eq 'USB'} | Select-Object Number,FriendlyName,Size | ConvertTo-Json`;
        const out = execSync(`powershell -Command "${ps}"`, { encoding: 'utf8' });
        const parsed = JSON.parse(out || '[]');
        const disks = Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
        return disks.map(d => ({ id: d.Number, label: d.FriendlyName || `Disk ${d.Number}`, platform: 'win32' }));
      }
    } catch (e) {
      console.error('listUsbDrives:', e.message);
    }
    return [];
  }

  async writeIsoToUsb(isoPath, driveId, onProgress) {
    const iso = isoPath || this.findIso();
    if (!iso) throw new Error('TauOS ISO not found. Run ./scripts/build-tauos.sh --docker first.');
    if (!driveId) throw new Error('No USB drive selected.');

    onProgress?.({ step: 'preparing', progress: 5, message: 'Preparing USB drive...' });

    if (process.platform === 'darwin') {
      const disk = driveId.replace('/dev/', '');
      execSync(`diskutil unmountDisk force ${driveId}`, { stdio: 'inherit' });
      onProgress?.({ step: 'writing', progress: 20, message: 'Writing TauOS to USB (this may take several minutes)...' });
      execSync(`sudo dd if="${iso}" of=${driveId} bs=4m status=progress conv=sync`, { stdio: 'inherit' });
      execSync(`diskutil eject ${driveId}`, { stdio: 'inherit' });
    } else if (process.platform === 'linux') {
      execSync(`sudo umount ${driveId}?* 2>/dev/null || true`, { shell: true });
      onProgress?.({ step: 'writing', progress: 20, message: 'Writing TauOS to USB...' });
      execSync(`sudo dd if="${iso}" of=${driveId} bs=4M status=progress conv=fsync`, { stdio: 'inherit' });
      execSync('sudo sync');
    } else if (process.platform === 'win32') {
      onProgress?.({ step: 'writing', progress: 20, message: 'Writing TauOS to USB via PowerShell...' });
      const ps = `$iso='${iso.replace(/'/g, "''")}'; $disk=${driveId}; $img=Get-Disk -Number $disk; Clear-Disk -InputObject $img -RemoveData -Confirm:$false; $vhd=Mount-DiskImage -ImagePath $iso -PassThru; $src=($vhd | Get-Volume).DriveLetter+':'; $dst=($img | Get-Partition | Get-Volume).DriveLetter+':'; robocopy $src $dst /E /R:1 /W:1; Dismount-DiskImage -ImagePath $iso`;
      execSync(`powershell -ExecutionPolicy Bypass -Command "${ps}"`, { stdio: 'inherit' });
    }

    onProgress?.({ step: 'complete', progress: 100, message: 'USB boot drive ready. Reboot and boot from USB to install TauOS.' });
    return { success: true, iso, driveId };
  }

  async installAppsLocally(installPath, onProgress) {
    const appsSource = path.join(this.appRoot, 'apps');
    const target = path.join(installPath, 'apps');
    if (!fs.existsSync(appsSource)) throw new Error('Application bundle missing from installer.');

    onProgress?.({ step: 'copy', progress: 30, message: 'Installing TauOS applications...' });
    fs.mkdirSync(target, { recursive: true });
    this.copyDir(appsSource, target);
    onProgress?.({ step: 'complete', progress: 100, message: 'TauOS apps installed locally.' });
    return { success: true, installPath: target };
  }

  copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, entry.name);
      const d = path.join(dest, entry.name);
      if (entry.isDirectory()) this.copyDir(s, d);
      else fs.copyFileSync(s, d);
    }
  }

  verifyIso(isoPath) {
    const iso = isoPath || this.findIso();
    if (!iso) return { valid: false, reason: 'ISO file not found' };
    const size = fs.statSync(iso).size;
    if (size < 50 * 1024 * 1024) return { valid: false, reason: `ISO too small (${size} bytes) — likely a stub. Run build-tauos.sh.` };
    return { valid: true, path: iso, size };
  }
}

module.exports = TauOSInstaller;
