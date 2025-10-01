#!/bin/bash

# Process incoming emails and forward to TauOS webhook
# This script should run on your Vultr server

WEBHOOK_URL="https://taumail-backend.vercel.app/api/v2/webhook/incoming"
LOG_FILE="/var/log/tauos-mail.log"

echo "📧 Starting TauOS Mail Inbound Processor..."

# Monitor mail log for new emails
tail -f /var/log/mail.log | while read line; do
    # Check if it's a new email delivery
    if echo "$line" | grep -q "delivered to"; then
        echo "$(date): New email detected: $line" >> $LOG_FILE
        
        # Extract email details (this is a simplified version)
        # In production, you'd use a more sophisticated email parser
        
        # For now, we'll simulate the webhook call
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d '{
                "to": "saleena@tauos.org",
                "from": "test@example.com",
                "subject": "Test Email from Vultr Server",
                "text": "This email was processed by your Vultr server and forwarded to TauOS webhook.",
                "html": "<p>This email was processed by your Vultr server and forwarded to TauOS webhook.</p>"
            }' \
            >> $LOG_FILE 2>&1
            
        echo "$(date): Email forwarded to webhook" >> $LOG_FILE
    fi
done
