const fs = require('fs');

// Check if Puppeteer is available
let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (error) {
    console.log('Puppeteer not available, creating screenshot guide instead...');
}

async function takeScreenshots() {
    if (!puppeteer) {
        createScreenshotGuide();
        return;
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const screenshots = [
        {
            name: 'taumail-dashboard',
            url: 'http://localhost:3001/dashboard',
            description: 'TauMail Dashboard'
        },
        {
            name: 'taucloud-dashboard',
            url: 'http://localhost:3002/dashboard',
            description: 'TauCloud Dashboard'
        },
        {
            name: 'website-landing',
            url: 'http://localhost:3000',
            description: 'TauOS Website Landing Page'
        },
        {
            name: 'website-about',
            url: 'http://localhost:3000/about',
            description: 'TauOS About Page'
        },
        {
            name: 'website-developers',
            url: 'http://localhost:3000/developers',
            description: 'TauOS Developers Page'
        },
        {
            name: 'website-governance',
            url: 'http://localhost:3000/governance',
            description: 'TauOS Governance Page'
        },
        {
            name: 'website-tauid',
            url: 'http://localhost:3000/tauid',
            description: 'TauID Dashboard'
        },
        {
            name: 'website-taustore',
            url: 'http://localhost:3000/taustore',
            description: 'TauStore Dashboard'
        },
        {
            name: 'website-taumail',
            url: 'http://localhost:3000/taumail',
            description: 'TauMail Web Dashboard'
        },
        {
            name: 'website-taucloud',
            url: 'http://localhost:3000/taucloud',
            description: 'TauCloud Web Dashboard'
        },
        {
            name: 'website-enterprise-mdm',
            url: 'http://localhost:3000/enterprise/mdm',
            description: 'Enterprise MDM Dashboard'
        },
        {
            name: 'website-enterprise-ota',
            url: 'http://localhost:3000/enterprise/ota',
            description: 'Enterprise OTA Dashboard'
        },
        {
            name: 'website-enterprise-security',
            url: 'http://localhost:3000/enterprise/security',
            description: 'Enterprise Security Dashboard'
        }
    ];

    console.log('📸 Taking screenshots of TauOS applications...');

    for (const screenshot of screenshots) {
        try {
            console.log(`📱 Capturing ${screenshot.description}...`);
            
            await page.goto(screenshot.url, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            // Wait a bit for any animations to complete
            await page.waitForTimeout(2000);

            const filename = `screenshots/${screenshot.name}.png`;
            await page.screenshot({ 
                path: filename,
                fullPage: true 
            });

            console.log(`✅ Saved: ${filename}`);
        } catch (error) {
            console.error(`❌ Failed to capture ${screenshot.description}:`, error.message);
        }
    }

    await browser.close();
    console.log('🎉 Screenshot capture complete!');
}

function createScreenshotGuide() {
    const screenshotList = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TauOS Screenshot Guide</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: #000000;
            color: #ffffff;
            padding: 40px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #fbbf24;
            font-size: 2.5rem;
            margin-bottom: 2rem;
        }
        .screenshot-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 2rem;
        }
        .screenshot-item {
            background: rgba(17, 24, 39, 0.5);
            border: 1px solid rgba(75, 85, 99, 0.5);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        .screenshot-item:hover {
            border-color: #fbbf24;
            transform: translateY(-2px);
        }
        .screenshot-item h3 {
            color: #fbbf24;
            margin-bottom: 10px;
        }
        .screenshot-item a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }
        .screenshot-item a:hover {
            text-decoration: underline;
        }
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
        }
        .status.ready {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📸 TauOS Screenshot Guide</h1>
        <p>Use this guide to capture screenshots of all TauOS applications for marketing and documentation purposes.</p>
        
        <div class="screenshot-list">
            <div class="screenshot-item">
                <h3>🌐 Website Pages</h3>
                <p><a href="http://localhost:3000" target="_blank">Landing Page</a></p>
                <p><a href="http://localhost:3000/about" target="_blank">About Page</a></p>
                <p><a href="http://localhost:3000/developers" target="_blank">Developers Page</a></p>
                <p><a href="http://localhost:3000/governance" target="_blank">Governance Page</a></p>
                <span class="status ready">Ready</span>
            </div>
            
            <div class="screenshot-item">
                <h3>📧 TauMail Applications</h3>
                <p><a href="http://localhost:3001/dashboard" target="_blank">TauMail Dashboard (App)</a></p>
                <p><a href="http://localhost:3000/taumail" target="_blank">TauMail Dashboard (Web)</a></p>
                <span class="status ready">Ready</span>
            </div>
            
            <div class="screenshot-item">
                <h3>☁️ TauCloud Applications</h3>
                <p><a href="http://localhost:3002/dashboard" target="_blank">TauCloud Dashboard (App)</a></p>
                <p><a href="http://localhost:3000/taucloud" target="_blank">TauCloud Dashboard (Web)</a></p>
                <span class="status ready">Ready</span>
            </div>
            
            <div class="screenshot-item">
                <h3>🆔 TauID & TauStore</h3>
                <p><a href="http://localhost:3000/tauid" target="_blank">TauID Dashboard</a></p>
                <p><a href="http://localhost:3000/taustore" target="_blank">TauStore Dashboard</a></p>
                <span class="status ready">Ready</span>
            </div>
            
            <div class="screenshot-item">
                <h3>🏢 Enterprise Tools</h3>
                <p><a href="http://localhost:3000/enterprise/mdm" target="_blank">MDM Dashboard</a></p>
                <p><a href="http://localhost:3000/enterprise/ota" target="_blank">OTA Dashboard</a></p>
                <p><a href="http://localhost:3000/enterprise/security" target="_blank">Security Dashboard</a></p>
                <span class="status ready">Ready</span>
            </div>
        </div>
        
        <div style="margin-top: 40px; padding: 20px; background: rgba(251, 191, 36, 0.1); border-radius: 12px;">
            <h3>📋 Screenshot Instructions:</h3>
            <ol>
                <li>Click on each link above to open the application</li>
                <li>Use your browser's developer tools (F12) to set viewport to 1920x1080</li>
                <li>Take full-page screenshots using browser dev tools or system screenshot tool</li>
                <li>Save screenshots in the <code>screenshots/</code> folder</li>
                <li>Use consistent naming: <code>app-name-view.png</code></li>
            </ol>
        </div>
    </div>
</body>
</html>
    `;
    
    fs.writeFileSync('screenshots/screenshot-guide.html', screenshotList);
    console.log('📄 Created screenshot guide at: screenshots/screenshot-guide.html');
    console.log('🌐 Open this file in your browser to access all TauOS applications for screenshots');
}

// Run the appropriate function
if (puppeteer) {
    takeScreenshots().catch(console.error);
} else {
    createScreenshotGuide();
}
