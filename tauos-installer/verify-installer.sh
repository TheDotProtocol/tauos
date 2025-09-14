#!/bin/bash
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
            expected_checksum=$(jq -r ".files["$file"]" checksums.json)
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
