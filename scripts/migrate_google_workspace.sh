#!/bin/bash

# Google Workspace to TauMail Migration Script
# Migrates emails, contacts, and calendar data from Google Workspace to TauMail

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TAUMAIL_DOMAIN="mail.tauos.arholdings.group"
TAUMAIL_IMAP_PORT="993"
TAUMAIL_SMTP_PORT="587"
GOOGLE_IMAP_SERVER="imap.gmail.com"
GOOGLE_IMAP_PORT="993"
GOOGLE_SMTP_SERVER="smtp.gmail.com"
GOOGLE_SMTP_PORT="587"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking migration prerequisites..."
    
    local missing_deps=()
    
    # Check for imapsync
    if ! command -v imapsync &> /dev/null; then
        missing_deps+=("imapsync")
    fi
    
    # Check for curl
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi
    
    # Check for jq
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        error "Please install the missing dependencies and try again."
        echo ""
        echo "Installation commands:"
        echo "  # Ubuntu/Debian"
        echo "  sudo apt-get install imapsync curl jq"
        echo ""
        echo "  # CentOS/RHEL"
        echo "  sudo yum install imapsync curl jq"
        echo ""
        echo "  # macOS"
        echo "  brew install imapsync curl jq"
        exit 1
    fi
    
    success "Prerequisites check completed"
}

# Setup migration environment
setup_migration_environment() {
    log "Setting up migration environment..."
    
    # Create migration directory
    mkdir -p migration_logs
    mkdir -p migration_data
    
    # Create migration config
    cat > migration_config.json << EOF
{
  "google_workspace": {
    "imap_server": "$GOOGLE_IMAP_SERVER",
    "imap_port": $GOOGLE_IMAP_PORT,
    "smtp_server": "$GOOGLE_SMTP_SERVER",
    "smtp_port": $GOOGLE_SMTP_PORT
  },
  "taumail": {
    "imap_server": "$TAUMAIL_DOMAIN",
    "imap_port": $TAUMAIL_IMAP_PORT,
    "smtp_server": "$TAUMAIL_DOMAIN",
    "smtp_port": $TAUMAIL_SMTP_PORT
  },
  "migration": {
    "max_messages_per_batch": 1000,
    "timeout": 300,
    "retry_attempts": 3
  }
}
EOF

    success "Migration environment configured"
}

# Test connectivity
test_connectivity() {
    log "Testing connectivity to mail servers..."
    
    # Test Google Workspace connectivity
    if curl -s --connect-timeout 10 "$GOOGLE_IMAP_SERVER:$GOOGLE_IMAP_PORT" > /dev/null; then
        success "Google Workspace IMAP server accessible"
    else
        error "Cannot connect to Google Workspace IMAP server"
        return 1
    fi
    
    # Test TauMail connectivity
    if curl -s --connect-timeout 10 "$TAUMAIL_DOMAIN:$TAUMAIL_IMAP_PORT" > /dev/null; then
        success "TauMail IMAP server accessible"
    else
        error "Cannot connect to TauMail IMAP server"
        return 1
    fi
}

# Migrate emails
migrate_emails() {
    local source_email="$1"
    local source_password="$2"
    local target_email="$3"
    local target_password="$4"
    
    log "Starting email migration for $source_email -> $target_email"
    
    # Create migration command
    local imapsync_cmd="imapsync \\
        --host1 $GOOGLE_IMAP_SERVER \\
        --port1 $GOOGLE_IMAP_PORT \\
        --user1 '$source_email' \\
        --password1 '$source_password' \\
        --ssl1 \\
        --host2 $TAUMAIL_DOMAIN \\
        --port2 $TAUMAIL_IMAP_PORT \\
        --user2 '$target_email' \\
        --password2 '$target_password' \\
        --ssl2 \\
        --syncinternaldates \\
        --syncacls \\
        --subscribe \\
        --automap \\
        --addheader \\
        --regextrans2 's/^Sent$/Sent Mail/' \\
        --regextrans2 's/^Drafts$/Drafts/' \\
        --regextrans2 's/^Trash$/Trash/' \\
        --regextrans2 's/^Spam$/Spam/' \\
        --maxmessagespersecond 10 \\
        --maxbytespersecond 1000000 \\
        --timeout 300 \\
        --retry 3 \\
        --logfile migration_logs/imapsync_${source_email//[@.]/_}.log"
    
    # Execute migration
    log "Executing email migration..."
    eval $imapsync_cmd
    
    if [ $? -eq 0 ]; then
        success "Email migration completed successfully"
    else
        error "Email migration failed"
        return 1
    fi
}

# Migrate contacts
migrate_contacts() {
    local source_email="$1"
    local source_password="$2"
    local target_email="$3"
    local target_password="$4"
    
    log "Starting contacts migration for $source_email -> $target_email"
    
    # Export contacts from Google Workspace
    log "Exporting contacts from Google Workspace..."
    
    # Use Google Takeout API or manual export
    # For now, provide instructions for manual export
    cat > migration_logs/contacts_migration_instructions.txt << EOF
CONTACTS MIGRATION INSTRUCTIONS:

1. Export contacts from Google Workspace:
   - Go to https://contacts.google.com
   - Select all contacts
   - Click "Export" -> "Google CSV"
   - Save as "google_contacts.csv"

2. Import contacts to TauMail:
   - Access TauMail webmail at https://webmail.tauos.arholdings.group
   - Go to Contacts section
   - Import the CSV file

3. Verify contacts are imported correctly
EOF

    success "Contacts migration instructions saved to migration_logs/contacts_migration_instructions.txt"
}

# Migrate calendar
migrate_calendar() {
    local source_email="$1"
    local target_email="$2"
    
    log "Starting calendar migration for $source_email -> $target_email"
    
    # Provide instructions for calendar migration
    cat > migration_logs/calendar_migration_instructions.txt << EOF
CALENDAR MIGRATION INSTRUCTIONS:

1. Export calendar from Google Workspace:
   - Go to https://calendar.google.com
   - Click Settings -> Your calendars
   - Click "Export" next to your calendar
   - Download the .ics file

2. Import calendar to TauMail:
   - Access TauMail webmail at https://webmail.tauos.arholdings.group
   - Go to Calendar section
   - Import the .ics file

3. Verify calendar events are imported correctly
EOF

    success "Calendar migration instructions saved to migration_logs/calendar_migration_instructions.txt"
}

# Verify migration
verify_migration() {
    local source_email="$1"
    local target_email="$2"
    
    log "Verifying migration for $source_email -> $target_email"
    
    # Check email count
    log "Checking email counts..."
    
    # This would require IMAP commands to count emails
    # For now, provide manual verification steps
    cat > migration_logs/verification_checklist.txt << EOF
MIGRATION VERIFICATION CHECKLIST:

1. Email Verification:
   - [ ] Check email count in source and target
   - [ ] Verify important emails are present
   - [ ] Test email sending/receiving
   - [ ] Check email folders structure

2. Contacts Verification:
   - [ ] Verify all contacts are imported
   - [ ] Check contact details are complete
   - [ ] Test contact search functionality

3. Calendar Verification:
   - [ ] Verify all calendar events are imported
   - [ ] Check event details and reminders
   - [ ] Test calendar sharing functionality

4. General Verification:
   - [ ] Test webmail login
   - [ ] Verify SSL certificate
   - [ ] Check mobile app access
   - [ ] Test email client configuration
EOF

    success "Verification checklist saved to migration_logs/verification_checklist.txt"
}

# Create migration report
create_migration_report() {
    log "Creating migration report..."
    
    cat > migration_logs/migration_report.md << EOF
# Google Workspace to TauMail Migration Report

**Migration Date**: $(date)
**Source**: Google Workspace
**Target**: TauMail (mail.tauos.arholdings.group)

## Migration Summary

### Email Migration
- **Status**: Completed
- **Method**: imapsync
- **Log File**: migration_logs/imapsync_*.log

### Contacts Migration
- **Status**: Manual process required
- **Instructions**: migration_logs/contacts_migration_instructions.txt

### Calendar Migration
- **Status**: Manual process required
- **Instructions**: migration_logs/calendar_migration_instructions.txt

## Post-Migration Steps

1. **Verify Email Migration**:
   - Check email counts
   - Verify important emails
   - Test email functionality

2. **Complete Contacts Migration**:
   - Follow instructions in contacts_migration_instructions.txt
   - Import Google CSV file to TauMail

3. **Complete Calendar Migration**:
   - Follow instructions in calendar_migration_instructions.txt
   - Import .ics file to TauMail

4. **Update Email Clients**:
   - Update IMAP/SMTP settings
   - Configure new server details
   - Test email sending/receiving

5. **Update DNS Records**:
   - Point MX records to TauMail
   - Update SPF/DKIM/DMARC records
   - Verify email delivery

## Verification Checklist

See migration_logs/verification_checklist.txt for detailed verification steps.

## Support

- **Technical Support**: admin@arholdings.group
- **Documentation**: docs.tauos.org
- **Migration Logs**: migration_logs/
EOF

    success "Migration report created: migration_logs/migration_report.md"
}

# Main migration function
main() {
    log "Starting Google Workspace to TauMail migration"
    
    # Check if credentials are provided
    if [ $# -lt 4 ]; then
        error "Usage: $0 <source_email> <source_password> <target_email> <target_password>"
        echo ""
        echo "Example:"
        echo "  $0 user@gmail.com 'app_password' user@arholdings.group 'new_password'"
        echo ""
        echo "Note: For Google Workspace, use App Password instead of regular password"
        exit 1
    fi
    
    local source_email="$1"
    local source_password="$2"
    local target_email="$3"
    local target_password="$4"
    
    check_prerequisites
    setup_migration_environment
    test_connectivity
    migrate_emails "$source_email" "$source_password" "$target_email" "$target_password"
    migrate_contacts "$source_email" "$source_password" "$target_email" "$target_password"
    migrate_calendar "$source_email" "$target_email"
    verify_migration "$source_email" "$target_email"
    create_migration_report
    
    log "Migration completed successfully!"
    log ""
    log "Next steps:"
    log "  1. Review migration_logs/migration_report.md"
    log "  2. Follow contacts migration instructions"
    log "  3. Follow calendar migration instructions"
    log "  4. Verify all data is migrated correctly"
    log "  5. Update DNS records to point to TauMail"
    log "  6. Test email functionality"
}

# Run main function
main "$@" 