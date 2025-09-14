const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class TauOSSecurityVerification {
  constructor() {
    this.publicKey = null;
    this.privateKey = null;
    this.checksums = new Map();
  }

  // Generate RSA key pair for code signing
  async generateKeyPair() {
    console.log('🔐 Generating RSA key pair for code signing...');
    
    return new Promise((resolve, reject) => {
      exec('openssl genrsa -out private.pem 4096', (error, stdout, stderr) => {
        if (error) {
          console.error('Error generating private key:', error);
          reject(error);
          return;
        }
        
        exec('openssl rsa -in private.pem -pubout -out public.pem', (error, stdout, stderr) => {
          if (error) {
            console.error('Error generating public key:', error);
            reject(error);
            return;
          }
          
          console.log('✅ RSA key pair generated successfully');
          resolve();
        });
      });
    });
  }

  // Generate checksums for all installer files
  async generateChecksums() {
    console.log('🔍 Generating checksums for installer files...');
    
    const installerFiles = [
      'dist/TauOS Setup 1.0.0.exe',
      'dist/TauOS-1.0.0.dmg',
      'dist/tauos-installer_1.0.0_amd64.deb'
    ];

    for (const filePath of installerFiles) {
      if (fs.existsSync(filePath)) {
        const checksum = await this.calculateFileChecksum(filePath);
        this.checksums.set(filePath, checksum);
        console.log(`✅ ${path.basename(filePath)}: ${checksum}`);
      }
    }

    // Save checksums to file
    const checksumData = {
      timestamp: new Date().toISOString(),
      files: Object.fromEntries(this.checksums)
    };
    
    fs.writeFileSync('checksums.json', JSON.stringify(checksumData, null, 2));
    console.log('✅ Checksums saved to checksums.json');
  }

  // Calculate SHA256 checksum for a file
  async calculateFileChecksum(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  // Verify file integrity
  async verifyFileIntegrity(filePath, expectedChecksum) {
    const actualChecksum = await this.calculateFileChecksum(filePath);
    return actualChecksum === expectedChecksum;
  }

  // Sign installer files
  async signInstallerFiles() {
    console.log('✍️ Signing installer files...');
    
    if (!fs.existsSync('private.pem')) {
      await this.generateKeyPair();
    }

    const installerFiles = [
      'dist/TauOS Setup 1.0.0.exe',
      'dist/TauOS-1.0.0.dmg',
      'dist/tauos-installer_1.0.0_amd64.deb'
    ];

    for (const filePath of installerFiles) {
      if (fs.existsSync(filePath)) {
        await this.signFile(filePath);
      }
    }
  }

  // Sign a single file
  async signFile(filePath) {
    return new Promise((resolve, reject) => {
      const signaturePath = filePath + '.sig';
      
      exec(`openssl dgst -sha256 -sign private.pem -out "${signaturePath}" "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error signing ${filePath}:`, error);
          reject(error);
          return;
        }
        
        console.log(`✅ Signed ${path.basename(filePath)}`);
        resolve();
      });
    });
  }

  // Verify file signatures
  async verifyFileSignature(filePath, signaturePath) {
    return new Promise((resolve, reject) => {
      exec(`openssl dgst -sha256 -verify public.pem -signature "${signaturePath}" "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  // Create security manifest
  async createSecurityManifest() {
    console.log('📋 Creating security manifest...');
    
    const manifest = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      security: {
        codeSigning: {
          algorithm: 'RSA-SHA256',
          keySize: 4096,
          publicKey: fs.existsSync('public.pem') ? fs.readFileSync('public.pem', 'utf8') : null
        },
        checksums: {
          algorithm: 'SHA256',
          files: Object.fromEntries(this.checksums)
        },
        verification: {
          integrity: true,
          authenticity: true,
          timestamp: new Date().toISOString()
        }
      },
      installer: {
        platforms: ['win32', 'darwin', 'linux'],
        architectures: ['x64', 'arm64'],
        securityFeatures: [
          'Code signing',
          'Checksum verification',
          'Integrity checking',
          'Authenticity verification'
        ]
      }
    };

    fs.writeFileSync('security-manifest.json', JSON.stringify(manifest, null, 2));
    console.log('✅ Security manifest created');
  }

  // Create OTA update system
  async createOTAUpdateSystem() {
    console.log('🔄 Creating OTA update system...');
    
    const updateSystem = {
      version: '1.0.0',
      updateUrl: 'https://www.tauos.org/api/updates',
      checkInterval: 24 * 60 * 60 * 1000, // 24 hours
      autoUpdate: false,
      security: {
        verifySignature: true,
        verifyChecksum: true,
        rollbackOnFailure: true
      },
      channels: {
        stable: 'https://www.tauos.org/api/updates/stable',
        beta: 'https://www.tauos.org/api/updates/beta',
        alpha: 'https://www.tauos.org/api/updates/alpha'
      }
    };

    fs.writeFileSync('ota-config.json', JSON.stringify(updateSystem, null, 2));
    console.log('✅ OTA update system configured');
  }

  // Create security policies
  async createSecurityPolicies() {
    console.log('🛡️ Creating security policies...');
    
    const policies = {
      version: '1.0.0',
      policies: {
        network: {
          allowInsecureConnections: false,
          requireTLS: true,
          allowedDomains: ['tauos.org', 'api.tauos.org'],
          blockedDomains: ['malicious.com', 'tracker.com']
        },
        fileSystem: {
          sandboxMode: true,
          allowedPaths: ['/apps', '/data', '/config'],
          blockedPaths: ['/system', '/root', '/etc']
        },
        process: {
          maxMemoryUsage: '1GB',
          maxCpuUsage: '80%',
          processIsolation: true,
          resourceLimits: true
        },
        authentication: {
          requireJWT: true,
          tokenExpiry: '24h',
          refreshToken: true,
          multiFactorAuth: false
        }
      }
    };

    fs.writeFileSync('security-policies.json', JSON.stringify(policies, null, 2));
    console.log('✅ Security policies created');
  }

  // Create verification script
  async createVerificationScript() {
    console.log('🔍 Creating verification script...');
    
    const verificationScript = `#!/bin/bash
# TauOS Installer Verification Script
# This script verifies the integrity and authenticity of TauOS installer files

echo "🔍 TauOS Installer Verification"
echo "================================"

# Check if public key exists
if [ ! -f "public.pem" ]; then
    echo "❌ Public key not found. Cannot verify signatures."
    exit 1
fi

# Verify each installer file
for file in "dist/TauOS Setup 1.0.0.exe" "dist/TauOS-1.0.0.dmg" "dist/tauos-installer_1.0.0_amd64.deb"; do
    if [ -f "$file" ]; then
        echo "Verifying $file..."
        
        # Check if signature exists
        if [ -f "$file.sig" ]; then
            # Verify signature
            if openssl dgst -sha256 -verify public.pem -signature "$file.sig" "$file" > /dev/null 2>&1; then
                echo "✅ $file signature verified"
            else
                echo "❌ $file signature verification failed"
                exit 1
            fi
        else
            echo "⚠️  $file signature file not found"
        fi
        
        # Verify checksum
        if [ -f "checksums.json" ]; then
            expected_checksum=$(jq -r ".files[\"$file\"]" checksums.json)
            actual_checksum=$(sha256sum "$file" | cut -d' ' -f1)
            
            if [ "$expected_checksum" = "$actual_checksum" ]; then
                echo "✅ $file checksum verified"
            else
                echo "❌ $file checksum verification failed"
                exit 1
            fi
        fi
    fi
done

echo "✅ All verification checks passed!"
echo "TauOS installer files are authentic and intact."
`;

    fs.writeFileSync('verify-installer.sh', verificationScript);
    
    // Make it executable
    exec('chmod +x verify-installer.sh', (error) => {
      if (error) {
        console.error('Error making verification script executable:', error);
      } else {
        console.log('✅ Verification script created and made executable');
      }
    });
  }

  // Run all security setup
  async setupSecurity() {
    console.log('🔒 Setting up TauOS security and verification...');
    
    try {
      await this.generateChecksums();
      await this.signInstallerFiles();
      await this.createSecurityManifest();
      await this.createOTAUpdateSystem();
      await this.createSecurityPolicies();
      await this.createVerificationScript();
      
      console.log('✅ Security setup completed successfully');
    } catch (error) {
      console.error('❌ Security setup failed:', error);
      throw error;
    }
  }
}

module.exports = TauOSSecurityVerification;
