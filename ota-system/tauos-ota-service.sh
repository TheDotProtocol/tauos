#!/bin/bash
# TauOS OTA Update Service
# Handles automatic updates and system maintenance

echo "🔄 TauOS OTA Update Service Starting..."

# Configuration
OTA_SERVER="https://api.tauos.org/ota"
UPDATE_LOG="/var/log/tauos-ota.log"
UPDATE_DIR="/opt/tauos/updates"
BACKUP_DIR="/opt/tauos/backups"
LOCK_FILE="/var/lock/tauos-ota.lock"

# Create directories
mkdir -p "$UPDATE_DIR" "$BACKUP_DIR"

# Check for lock file
if [ -f "$LOCK_FILE" ]; then
    echo "OTA update already in progress"
    exit 1
fi

# Create lock file
touch "$LOCK_FILE"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$UPDATE_LOG"
}

# Check for updates
check_updates() {
    log "Checking for OTA updates..."
    
    # Get current version
    CURRENT_VERSION=$(cat /etc/tauos-version 2>/dev/null || echo "1.0.0")
    
    # Check for updates from server
    UPDATE_INFO=$(curl -s "$OTA_SERVER/check?version=$CURRENT_VERSION")
    
    if echo "$UPDATE_INFO" | grep -q "update_available"; then
        NEW_VERSION=$(echo "$UPDATE_INFO" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
        log "Update available: $CURRENT_VERSION -> $NEW_VERSION"
        return 0
    else
        log "No updates available"
        return 1
    fi
}

# Download update
download_update() {
    local version=$1
    log "Downloading update $version..."
    
    # Download update package
    curl -L "$OTA_SERVER/download/$version" -o "$UPDATE_DIR/tauos-update-$version.tar.gz"
    
    if [ $? -eq 0 ]; then
        log "Update downloaded successfully"
        return 0
    else
        log "Failed to download update"
        return 1
    fi
}

# Verify update
verify_update() {
    local version=$1
    log "Verifying update $version..."
    
    # Check file integrity
    if [ -f "$UPDATE_DIR/tauos-update-$version.tar.gz" ]; then
        # Verify checksum
        EXPECTED_CHECKSUM=$(curl -s "$OTA_SERVER/checksum/$version")
        ACTUAL_CHECKSUM=$(sha256sum "$UPDATE_DIR/tauos-update-$version.tar.gz" | cut -d' ' -f1)
        
        if [ "$EXPECTED_CHECKSUM" = "$ACTUAL_CHECKSUM" ]; then
            log "Update verification successful"
            return 0
        else
            log "Update verification failed - checksum mismatch"
            return 1
        fi
    else
        log "Update file not found"
        return 1
    fi
}

# Install update
install_update() {
    local version=$1
    log "Installing update $version..."
    
    # Create backup
    log "Creating system backup..."
    tar -czf "$BACKUP_DIR/tauos-backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
        /etc/tauos* /opt/tauos* /usr/local/bin/tauos* 2>/dev/null
    
    # Extract update
    cd "$UPDATE_DIR"
    tar -xzf "tauos-update-$version.tar.gz"
    
    if [ $? -eq 0 ]; then
        # Install new files
        cp -r tauos-update-$version/* /
        
        # Update version
        echo "$version" > /etc/tauos-version
        
        # Restart services
        systemctl restart tauos-* 2>/dev/null || true
        
        log "Update installed successfully"
        return 0
    else
        log "Failed to install update"
        return 1
    fi
}

# Rollback update
rollback_update() {
    log "Rolling back update..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/tauos-backup-*.tar.gz 2>/dev/null | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        # Restore from backup
        tar -xzf "$LATEST_BACKUP" -C /
        
        # Restart services
        systemctl restart tauos-* 2>/dev/null || true
        
        log "Rollback completed"
        return 0
    else
        log "No backup found for rollback"
        return 1
    fi
}

# Main update process
main() {
    log "Starting OTA update process..."
    
    # Check for updates
    if check_updates; then
        # Get new version
        NEW_VERSION=$(curl -s "$OTA_SERVER/check?version=$(cat /etc/tauos-version 2>/dev/null || echo '1.0.0')" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
        
        # Download update
        if download_update "$NEW_VERSION"; then
            # Verify update
            if verify_update "$NEW_VERSION"; then
                # Install update
                if install_update "$NEW_VERSION"; then
                    log "OTA update completed successfully"
                else
                    log "Update installation failed, attempting rollback..."
                    rollback_update
                fi
            else
                log "Update verification failed"
            fi
        else
            log "Update download failed"
        fi
    fi
    
    # Clean up
    rm -f "$LOCK_FILE"
    log "OTA update process completed"
}

# Run main process
main "$@"
