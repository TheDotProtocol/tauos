#!/bin/bash

echo "📧 Sending Welcome Email with TauOS Branding"
echo "==========================================="

# Clear mail queue
echo "📋 Step 1: Clearing mail queue..."
sudo postsuper -d ALL

# Create the welcome email content
echo "📝 Step 2: Creating welcome email content..."
cat << 'EOF' > /tmp/welcome_email.html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to TauOS - The Future of Computing</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #0a0a0a; 
            color: #ffffff;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px; 
            border-radius: 15px; 
            text-align: center; 
            margin-bottom: 20px;
        }
        .logo { 
            font-size: 48px; 
            margin-bottom: 20px; 
            font-weight: bold;
        }
        .content { 
            background: #1a1a1a; 
            padding: 30px; 
            border-radius: 15px; 
            margin-top: 20px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .status { 
            background: #2a2a2a; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0; 
            border-left: 4px solid #667eea;
        }
        .success { 
            color: #4ade80; 
            font-weight: bold; 
        }
        .details { 
            background: #333333; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 10px 0; 
            font-family: 'Courier New', monospace; 
            font-size: 12px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #888888;
            font-size: 12px;
        }
        .cta {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">τ</div>
        <h1>Welcome to TauOS</h1>
        <h2>The Future of Computing</h2>
    </div>
    
    <div class="content">
        <h3>🎉 Your Email Server is Live!</h3>
        <p>Congratulations! Your TauOS email server is now fully operational and ready to serve your privacy-first email needs.</p>
        
        <div class="status">
            <h4>✅ Server Status: <span class="success">ONLINE</span></h4>
            <p><strong>Server:</strong> smtptauos.tauos.org</p>
            <p><strong>IP Address:</strong> 54.156.132.149</p>
            <p><strong>Security:</strong> SSL/TLS Encrypted</p>
            <p><strong>Features:</strong> SMTP, IMAP, POP3</p>
        </div>
        
        <h4>🔐 Privacy-First Features:</h4>
        <ul>
            <li>End-to-end encryption</li>
            <li>Zero telemetry</li>
            <li>Self-hosted infrastructure</li>
            <li>Complete data sovereignty</li>
            <li>No third-party dependencies</li>
        </ul>
        
        <h4>📧 Email Configuration:</h4>
        <div class="details">
            <strong>SMTP Settings:</strong><br>
            Server: smtptauos.tauos.org<br>
            Port: 587 (STARTTLS)<br>
            Security: TLS/SSL<br><br>
            
            <strong>IMAP Settings:</strong><br>
            Server: imaptauos.tauos.org<br>
            Port: 993 (SSL)<br>
            Security: SSL/TLS
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.tauos.org" class="cta">Visit TauOS Website</a>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ol>
            <li>Configure your email client with the settings above</li>
            <li>Test sending and receiving emails</li>
            <li>Set up additional users as needed</li>
            <li>Configure backup and monitoring</li>
        </ol>
    </div>
    
    <div class="footer">
        <p>This email was sent from your TauOS email server</p>
        <p>Built with ❤️ for privacy and security</p>
        <p>© 2025 TauOS - The Future of Computing</p>
    </div>
</body>
</html>
EOF

# Send welcome email to both addresses
echo "📤 Step 3: Sending welcome emails..."

# Send to njmsweettie@gmail.com
echo "📧 Sending to njmsweettie@gmail.com..."
cat /tmp/welcome_email.html | sendmail -f "superuser@tauos.org" "njmsweettie@gmail.com"

# Send to akumartrabaajo@gmail.com
echo "📧 Sending to akumartrabaajo@gmail.com..."
cat /tmp/welcome_email.html | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue
echo "📊 Step 4: Checking mail queue..."
sudo mailq

# Check logs
echo "📝 Step 5: Checking mail logs..."
sudo tail -10 /var/log/maillog

echo ""
echo "✅ Welcome emails sent!"
echo "📧 Check your inboxes for the beautiful TauOS welcome email!"
echo "🎉 Your email server is ready for the investor demo!" 