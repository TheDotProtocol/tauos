#!/bin/bash

# Process incoming emails and forward to TauOS webhook
# This script should run on your Vultr server

WEBHOOK_URL="https://www.tauos.org/api/taumail/webhook/incoming"
LOG_FILE="/var/log/tauos-mail.log"
MAIL_DIR="/var/mail"

echo "📧 Starting TauOS Mail Inbound Processor..."

# Function to parse email and extract details
parse_email() {
    local email_file="$1"
    
    # Extract headers
    local from=$(grep -i "^From:" "$email_file" | head -1 | sed 's/^From: //' | tr -d '\r\n')
    local to=$(grep -i "^To:" "$email_file" | head -1 | sed 's/^To: //' | tr -d '\r\n')
    local subject=$(grep -i "^Subject:" "$email_file" | head -1 | sed 's/^Subject: //' | tr -d '\r\n')
    
    # Extract body (after first empty line)
    local body_start=$(grep -n "^$" "$email_file" | head -1 | cut -d: -f1)
    if [ -n "$body_start" ]; then
        local body=$(tail -n +$((body_start + 1)) "$email_file" | head -1000)
    else
        local body="No body content"
    fi
    
    # Clean up the body (remove MIME boundaries and headers)
    body=$(echo "$body" | sed '/^--[0-9a-f]*$/d' | sed '/^Content-Type:/d' | sed '/^Content-Transfer-Encoding:/d' | head -50)
    
    # Create JSON payload
    cat << EOF
{
    "from": "$from",
    "to": "$to", 
    "subject": "$subject",
    "text": "$body"
}
EOF
}

# Monitor mail log for new emails
tail -f /var/log/mail.log | while read line; do
    # Check if it's a new email delivery
    if echo "$line" | grep -q "delivered to"; then
        echo "$(date): New email detected: $line" >> $LOG_FILE
        
        # Extract email file path from the log line
        email_file=$(echo "$line" | grep -o '/var/mail/[^[:space:]]*' | head -1)
        
        if [ -n "$email_file" ] && [ -f "$email_file" ]; then
            echo "$(date): Processing email file: $email_file" >> $LOG_FILE
            
            # Parse the email
            email_data=$(parse_email "$email_file")
            
            # Forward to webhook
            curl -X POST "$WEBHOOK_URL" \
                -H "Content-Type: application/json" \
                -d "$email_data" \
                >> $LOG_FILE 2>&1
                
            echo "$(date): Email forwarded to webhook" >> $LOG_FILE
            
            # Move processed email to archive (optional)
            mv "$email_file" "${email_file}.processed"
        else
            echo "$(date): Could not find email file for: $line" >> $LOG_FILE
        fi
    fi
done
