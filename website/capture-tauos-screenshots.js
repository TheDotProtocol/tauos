#!/usr/bin/env node

/**
 * TauOS Screenshot Capture Script
 * Captures high-quality screenshots of TauOS desktop environment
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class TauOSScreenshotCapture {
    constructor() {
        this.browser = null;
        this.page = null;
        this.screenshots = [];
    }

    async init() {
        console.log('🚀 Initializing TauOS Screenshot Capture...');
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
    }

    async captureDesktop() {
        console.log('📸 Capturing TauOS Desktop...');
        await this.page.goto('file://' + path.resolve(__dirname, 'tauos-desktop-visualization.html'));
        await this.page.waitForSelector('.tauos-desktop');
        
        // Hide mobile UI
        await this.page.evaluate(() => {
            const mobileUI = document.querySelector('.mobile-ui');
            if (mobileUI) mobileUI.style.display = 'none';
        });

        const screenshot = await this.page.screenshot({
            path: 'tauos-desktop-full.png',
            fullPage: true,
            type: 'png'
        });

        this.screenshots.push({
            name: 'TauOS Desktop Environment',
            file: 'tauos-desktop-full.png',
            description: 'Complete TauOS desktop with wallpaper, dock, and status bar'
        });

        return screenshot;
    }

    async captureAppLauncher() {
        console.log('📸 Capturing App Launcher...');
        await this.page.evaluate(() => {
            const launcher = document.getElementById('appLauncher');
            if (launcher) launcher.classList.add('show');
        });

        await this.page.waitForTimeout(500);

        const screenshot = await this.page.screenshot({
            path: 'tauos-app-launcher.png',
            fullPage: true,
            type: 'png'
        });

        this.screenshots.push({
            name: 'TauOS App Launcher',
            file: 'tauos-app-launcher.png',
            description: 'Application launcher with grid of apps'
        });

        return screenshot;
    }

    async captureFileManager() {
        console.log('📸 Capturing File Manager...');
        await this.page.evaluate(() => {
            const fileManager = document.getElementById('fileManager');
            if (fileManager) fileManager.style.display = 'block';
        });

        await this.page.waitForTimeout(500);

        const screenshot = await this.page.screenshot({
            path: 'tauos-file-manager.png',
            fullPage: true,
            type: 'png'
        });

        this.screenshots.push({
            name: 'TauOS File Manager',
            file: 'tauos-file-manager.png',
            description: 'Tau Explorer file manager with sidebar and file grid'
        });

        return screenshot;
    }

    async captureSettings() {
        console.log('📸 Capturing Settings Panel...');
        await this.page.evaluate(() => {
            const settings = document.getElementById('settings');
            if (settings) settings.style.display = 'block';
        });

        await this.page.waitForTimeout(500);

        const screenshot = await this.page.screenshot({
            path: 'tauos-settings.png',
            fullPage: true,
            type: 'png'
        });

        this.screenshots.push({
            name: 'TauOS Settings Panel',
            file: 'tauos-settings.png',
            description: 'System settings with categories and controls'
        });

        return screenshot;
    }

    async captureMobileUI() {
        console.log('📸 Capturing Mobile UI...');
        await this.page.setViewport({ width: 375, height: 812 });
        
        await this.page.evaluate(() => {
            const desktop = document.querySelector('.tauos-desktop');
            const mobile = document.querySelector('.mobile-ui');
            if (desktop) desktop.style.display = 'none';
            if (mobile) mobile.style.display = 'block';
        });

        await this.page.waitForTimeout(500);

        const screenshot = await this.page.screenshot({
            path: 'tauos-mobile-ui.png',
            fullPage: true,
            type: 'png'
        });

        this.screenshots.push({
            name: 'TauOS Mobile UI',
            file: 'tauos-mobile-ui.png',
            description: 'Mobile interface with app grid and dock'
        });

        return screenshot;
    }

    async captureMarketingMockups() {
        console.log('📸 Capturing Marketing Mockups...');
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Scroll to marketing section
        await this.page.evaluate(() => {
            const marketingSection = document.querySelector('.marketing-mockup');
            if (marketingSection) marketingSection.scrollIntoView();
        });

        await this.page.waitForTimeout(1000);

        const screenshot = await this.page.screenshot({
            path: 'tauos-marketing-mockups.png',
            fullPage: true,
            type: 'png'
        });

        this.screenshots.push({
            name: 'TauOS Marketing Mockups',
            file: 'tauos-marketing-mockups.png',
            description: 'Device mockups for laptop, desktop, and mobile'
        });

        return screenshot;
    }

    async generateReport() {
        console.log('📊 Generating Screenshot Report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            totalScreenshots: this.screenshots.length,
            screenshots: this.screenshots,
            summary: {
                desktop: 'Complete TauOS desktop environment with modern UI',
                mobile: 'Mobile interface optimized for touch devices',
                marketing: 'Professional device mockups for presentations',
                features: [
                    'Glassmorphism design effects',
                    'Privacy-first indicators',
                    'Modern dock and launcher',
                    'Comprehensive file manager',
                    'System settings panel',
                    'Cross-platform consistency'
                ]
            }
        };

        fs.writeFileSync('tauos-screenshots-report.json', JSON.stringify(report, null, 2));
        console.log('✅ Screenshot report generated: tauos-screenshots-report.json');
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async captureAll() {
        try {
            await this.init();
            
            console.log('🎯 Starting TauOS Screenshot Capture...');
            
            await this.captureDesktop();
            await this.captureAppLauncher();
            await this.captureFileManager();
            await this.captureSettings();
            await this.captureMobileUI();
            await this.captureMarketingMockups();
            
            await this.generateReport();
            
            console.log('✅ All screenshots captured successfully!');
            console.log('📁 Screenshots saved in current directory');
            console.log('📊 Report generated: tauos-screenshots-report.json');
            
        } catch (error) {
            console.error('❌ Error capturing screenshots:', error);
        } finally {
            await this.cleanup();
        }
    }
}

// Run the capture process
if (require.main === module) {
    const capture = new TauOSScreenshotCapture();
    capture.captureAll();
}

module.exports = TauOSScreenshotCapture;
