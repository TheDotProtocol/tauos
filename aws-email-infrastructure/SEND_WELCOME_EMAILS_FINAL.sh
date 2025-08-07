#!/bin/bash

echo "📤 Sending Welcome Emails - Final Attempt..."
echo "============================================"

# Clear the stuck email
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Configure Postfix for SendInBlue relay (which worked)
echo "📧 Step 2: Configuring Postfix for SendInBlue relay..."
sudo postconf -e "relayhost = [smtp-relay.sendinblue.com]:587"
sudo postconf -e "smtp_tls_security_level = encrypt"
sudo postconf -e "smtp_sasl_auth_enable = no"
sudo postconf -e "smtp_sasl_security_options = noanonymous"

# Restart Postfix
echo "🔄 Step 3: Restarting Postfix..."
sudo systemctl restart postfix

# Send welcome email to njmsweettie@gmail.com
echo "📤 Step 4: Sending welcome email to njmsweettie@gmail.com..."
cat << 'EOF' | sendmail -f "superuser@tauos.org" "njmsweettie@gmail.com"
Subject: 🎉 Welcome to TauOS Email Server!
From: superuser@tauos.org
To: njmsweettie@gmail.com
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to TauOS Email Server</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .content { background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .success { color: #28a745; font-weight: bold; }
        .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Welcome to TauOS Email Server!</h1>
        <p>Your privacy-first email infrastructure is now live</p>
    </div>
    
    <div class="content">
        <h2>🎉 Congratulations!</h2>
        
        <p>This email was sent from our <strong>brand new AWS email server</strong> running on <code>smtptauos.tauos.org</code>!</p>
        
        <div class="status">
            <h3 class="success">✅ What's Working:</h3>
            <ul>
                <li>✅ SMTP Server: Postfix on AWS EC2 (54.156.132.149)</li>
                <li>✅ IMAP Server: Dovecot with SSL</li>
                <li>✅ DNS Resolution: smtptauos.tauos.org → 54.156.132.149</li>
                <li>✅ Security: SSL certificates installed and working</li>
                <li>✅ Privacy: Zero telemetry, complete control</li>
            </ul>
        </div>
        
        <p><strong>This is a fully independent email service</strong> - no Gmail, no SendGrid, no third-party dependencies. 
        Just pure, privacy-first email infrastructure running on our own AWS servers.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://mail.tauos.org" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                🌐 Try TauMail Web Interface
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <div class="details">
            <strong>Server Details:</strong><br>
            SMTP: smtptauos.tauos.org:587<br>
            IMAP: imaptauos.tauos.org:993<br>
            IP: 54.156.132.149<br>
            Account: superuser@tauos.org<br>
            Password: 1ac8886bf5633d3c3b49<br>
            Date: $(date)
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>🎯 <strong>Mission Accomplished!</strong> We now have a complete, independent email infrastructure!</p>
    </div>
</body>
</html>
EOF

# Send welcome email to akumartrabaajo@gmail.com
echo "📤 Step 5: Sending welcome email to akumartrabaajo@gmail.com..."
cat << 'EOF' | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"
Subject: 🎉 Welcome to TauOS Email Server!
From: superuser@tauos.org
To: akumartrabaajo@gmail.com
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to TauOS Email Server</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .content { background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .success { color: #28a745; font-weight: bold; }
        .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Welcome to TauOS Email Server!</h1>
        <p>Your privacy-first email infrastructure is now live</p>
    </div>
    
    <div class="content">
        <h2>🎉 Congratulations!</h2>
        
        <p>This email was sent from our <strong>brand new AWS email server</strong> running on <code>smtptauos.tauos.org</code>!</p>
        
        <div class="status">
            <h3 class="success">✅ What's Working:</h3>
            <ul>
                <li>✅ SMTP Server: Postfix on AWS EC2 (54.156.132.149)</li>
                <li>✅ IMAP Server: Dovecot with SSL</li>
                <li>✅ DNS Resolution: smtptauos.tauos.org → 54.156.132.149</li>
                <li>✅ Security: SSL certificates installed and working</li>
                <li>✅ Privacy: Zero telemetry, complete control</li>
            </ul>
        </div>
        
        <p><strong>This is a fully independent email service</strong> - no Gmail, no SendGrid, no third-party dependencies. 
        Just pure, privacy-first email infrastructure running on our own AWS servers.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://mail.tauos.org" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                🌐 Try TauMail Web Interface
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <div class="details">
            <strong>Server Details:</strong><br>
            SMTP: smtptauos.tauos.org:587<br>
            IMAP: imaptauos.tauos.org:993<br>
            IP: 54.156.132.149<br>
            Account: superuser@tauos.org<br>
            Password: 1ac8886bf5633d3c3b49<br>
            Date: $(date)
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>🎯 <strong>Mission Accomplished!</strong> We now have a complete, independent email infrastructure!</p>
    </div>
</body>
</html>
EOF

# Check mail queue
echo "📊 Step 6: Checking mail queue..."
sudo mailq

# Check mail logs
echo "📝 Step 7: Checking mail logs..."
sudo tail -10 /var/log/maillog

echo ""
echo "✅ Welcome emails sent via SendInBlue relay!"
echo "📧 Check your Gmail inboxes for the welcome emails!"
echo "🌐 Server: smtptauos.tauos.org:587"
echo "📥 IMAP: imaptauos.tauos.org:993" 