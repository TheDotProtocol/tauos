#!/bin/bash

# Install Node.js and create simple apps
sudo apt-get update
sudo apt-get install -y nodejs npm nginx

# Create TauMail app
mkdir -p /opt/taumail
cd /opt/taumail

cat > app.js << 'TAUMAIL_EOF'
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

let users = [];
let emails = [];

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>TauMail - Privacy-First Email</title>
        <style>
            body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; margin: 0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 3rem; color: #6366f1; }
            .form { background: #1a1a1a; padding: 30px; border-radius: 12px; margin-bottom: 20px; }
            .form-group { margin-bottom: 15px; }
            .form-group label { display: block; margin-bottom: 5px; }
            .form-group input { width: 100%; padding: 10px; border: 1px solid #333; border-radius: 6px; background: #0f0f0f; color: #fff; }
            .btn { background: #6366f1; color: white; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; }
            .email-interface { display: none; background: #1a1a1a; padding: 20px; border-radius: 12px; }
            .email-list { margin-top: 20px; }
            .email-item { padding: 10px; border-bottom: 1px solid #333; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">τ</div>
                <h1>TauMail</h1>
                <p>Privacy-First Email Service</p>
            </div>
            
            <div id="authForm">
                <div class="form">
                    <h2>Login / Register</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="password" required>
                        </div>
                        <button type="submit" class="btn">Login / Register</button>
                    </form>
                </div>
            </div>
            
            <div id="emailInterface" class="email-interface">
                <h2>Welcome to TauMail!</h2>
                <p>Your privacy-first email service is ready.</p>
                <div class="email-list">
                    <div class="email-item">
                        <strong>Welcome to TauMail</strong><br>
                        <small>Your privacy-first email service is now active!</small>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (email && password) {
                    document.getElementById('authForm').style.display = 'none';
                    document.getElementById('emailInterface').style.display = 'block';
                }
            });
        </script>
    </body>
    </html>
    `);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    res.json({ success: true, user: { email, name: email.split('@')[0] } });
});

app.listen(3000, () => {
    console.log('TauMail running on port 3000');
});
