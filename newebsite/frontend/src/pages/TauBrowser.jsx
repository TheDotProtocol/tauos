import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Globe, Shield, Zap, Lock, EyeOff, ArrowRight, CheckCircle, Download, RefreshCw, Home, ArrowLeft, ExternalLink, AlertCircle, Plus, X } from 'lucide-react';

export const TauBrowser = () => {
  const [showBrowser, setShowBrowser] = useState(false);
  const [tabs, setTabs] = useState([
    { id: 1, url: 'https://www.google.com', title: 'Google', active: true, blocked: false }
  ]);
  const [currentTabId, setCurrentTabId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('https://www.google.com');

  const features = [
    {
      icon: Shield,
      title: 'Privacy by Default',
      description: 'Built-in ad blocking, tracker protection, and fingerprint resistance. Browse without being tracked.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed. Pages load faster with our privacy-first architecture.'
    },
    {
      icon: Lock,
      title: 'End-to-End Encrypted',
      description: 'All connections are encrypted by default. Your browsing history stays private.'
    },
    {
      icon: EyeOff,
      title: 'No Telemetry',
      description: 'Zero tracking. We don\'t collect, analyze, or sell your browsing data. Ever.'
    }
  ];

  const privacyFeatures = [
    'Built-in ad blocker',
    'Tracker protection',
    'Fingerprint resistance',
    'DNS-over-HTTPS',
    'Private browsing mode',
    'No data collection'
  ];

  const quickLinks = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'Gmail', url: 'https://www.gmail.com' },
    { name: 'GitHub', url: 'https://www.github.com' },
    { name: 'TauOS Docs', url: 'https://www.tauos.org/docs' }
  ];

  const getCurrentTab = () => {
    return tabs.find(tab => tab.id === currentTabId) || tabs[0];
  };

  const handleNavigate = (url, tabId = null) => {
    const targetTabId = tabId || currentTabId;
    let finalUrl = url;
    
    // Add https:// if not present
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it's a domain or search query
      if (url.includes('.') && !url.includes(' ')) {
        finalUrl = 'https://' + url;
      } else {
        // It's a search query, use Google
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    // Update the tab
    setTabs(prevTabs => prevTabs.map(tab => 
      tab.id === targetTabId 
        ? { ...tab, url: finalUrl, blocked: false, title: new URL(finalUrl).hostname.replace('www.', '') }
        : tab
    ));
    
    setUrlInput(finalUrl);
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleIframeError = (tabId) => {
    setIsLoading(false);
    const tab = tabs.find(t => t.id === tabId);
    // Only mark as blocked if the tab is active and we're certain it's blocked
    if (tab && tab.active && !tab.blocked) {
      // Double-check: only mark as blocked if we're absolutely sure
      const iframe = document.querySelector(`iframe[title="TauBrowser-${tabId}"]`);
      if (iframe) {
        try {
          // Try one more time to access - if we can't, mark as blocked
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) {
            // Can't access - likely X-Frame-Options, but could also be CSP
            // Mark as blocked only after confirmation
            setTabs(prevTabs => prevTabs.map(t => 
              t.id === tabId 
                ? { ...t, blocked: true }
                : t
            ));
          }
        } catch (e) {
          // SecurityError - likely blocked
          if (e.name === 'SecurityError') {
            setTabs(prevTabs => prevTabs.map(t => 
              t.id === tabId 
                ? { ...t, blocked: true }
                : t
            ));
          }
        }
      }
    }
  };

  const createNewTab = (url = null) => {
    const urlToUse = url || getCurrentTab()?.url || 'https://www.google.com';
    const newTabId = Math.max(...tabs.map(t => t.id), 0) + 1;
    let finalUrl = urlToUse;
    
    // Process URL if needed
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      }
    }
    
    const newTab = {
      id: newTabId,
      url: finalUrl,
      title: finalUrl.includes('http') ? new URL(finalUrl).hostname.replace('www.', '') : 'New Tab',
      active: true,
      blocked: false
    };
    
    setTabs(prevTabs => 
      prevTabs.map(tab => ({ ...tab, active: false })).concat(newTab)
    );
    setCurrentTabId(newTabId);
    setUrlInput(finalUrl);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const closeTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // Don't close the last tab, just navigate to home
      handleNavigate('https://www.google.com', tabId);
      return;
    }
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    const activeIndex = newTabs.findIndex(tab => tab.id === currentTabId);
    
    setTabs(newTabs.map((tab, index) => ({
      ...tab,
      active: tabId === currentTabId ? (index === newTabs.length - 1) : tab.active
    })));
    
    if (tabId === currentTabId) {
      const nextTab = activeIndex >= newTabs.length - 1 
        ? newTabs[newTabs.length - 1] 
        : newTabs[activeIndex] || newTabs[0];
      setCurrentTabId(nextTab.id);
      setUrlInput(nextTab.url);
    }
  };

  const switchTab = (tabId) => {
    setCurrentTabId(tabId);
    setTabs(prevTabs => prevTabs.map(tab => ({
      ...tab,
      active: tab.id === tabId
    })));
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setUrlInput(tab.url);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    handleNavigate(urlInput);
  };

  const handleQuickLink = (url) => {
    handleNavigate(url);
  };

  const getSecureIcon = () => {
    const currentTab = getCurrentTab();
    const url = currentTab?.url || '';
    if (url.startsWith('https://')) {
      return <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />;
    }
    return <AlertCircle className="w-4 h-4" style={{ color: '#ffbd2e' }} />;
  };

  const openInNewBrowserTab = () => {
    const currentTab = getCurrentTab();
    createNewTab(currentTab?.url);
  };

  // Landing Page View
  if (!showBrowser) {
    return (
      <div className="App">
        <Header />
        <main style={{ background: 'var(--bg-primary)' }}>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center" style={{ 
            paddingTop: '80px',
            background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
          }}>
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full">
                      <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                      <span className="body-small">Privacy-First Web Browser</span>
                    </div>
                    
                    <h1 className="display-huge leading-tight">
                      Browse the Web<br />
                      <span style={{ color: 'var(--brand-primary)' }}>Without Being Tracked</span>
                    </h1>
                    
                    <p className="body-large max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                      TauBrowser puts privacy first. Built-in ad blocking, tracker protection, and zero telemetry. Browse Google, Gmail, GitHub, and any site—completely private.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button 
                      className="btn-primary dark-button-animate text-lg px-8 py-6" 
                      onClick={() => setShowBrowser(true)}
                    >
                      <Globe className="w-5 h-5" />
                      Launch Browser
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    
                    <Button 
                      className="btn-secondary dark-button-animate text-lg px-8 py-6" 
                      onClick={() => window.open('/download', '_self')}
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center space-x-8 pt-8">
                    <div className="text-center">
                      <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>100%</div>
                      <div className="body-small" style={{ color: 'var(--text-muted)' }}>Private</div>
                    </div>
                    <div className="text-center">
                      <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>0</div>
                      <div className="body-small" style={{ color: 'var(--text-muted)' }}>Tracking</div>
                    </div>
                    <div className="text-center">
                      <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>∞</div>
                      <div className="body-small" style={{ color: 'var(--text-muted)' }}>Freedom</div>
                    </div>
                  </div>
                </div>

                {/* Right - Browser Preview */}
                <div className="glass p-8 rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }}></div>
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }}></div>
                      <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }}></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                      <span className="body-small" style={{ color: 'var(--text-muted)' }}>TauBrowser</span>
                    </div>
                  </div>
                  <div className="glass rounded-lg p-4 mb-4 flex items-center space-x-2">
                    <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                    <span className="body-medium flex-1" style={{ color: 'var(--text-secondary)' }}>
                      https://www.google.com
                    </span>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }}></div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-8 text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--brand-primary)' }} />
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      Your browsing session is completely private
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-32" style={{ background: 'var(--bg-secondary)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="text-center mb-20">
                <h2 className="display-medium mb-6">
                  Privacy <span style={{ color: 'var(--brand-primary)' }}>Built In</span>
                </h2>
                <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Every feature is designed to protect your privacy and give you control over your data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="glass p-8 rounded-xl dark-hover dark-transition">
                      <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-6">
                        <Icon className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                      </div>
                      <h3 className="heading-3 mb-4">{feature.title}</h3>
                      <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Privacy Features */}
          <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="display-medium mb-8">
                    Complete <span style={{ color: 'var(--brand-primary)' }}>Privacy Protection</span>
                  </h2>
                  <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Browse the web without leaving a trace. TauBrowser blocks trackers, ads, and fingerprinting by default. Visit Google, Gmail, GitHub, or any site—all with complete privacy.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {privacyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-primary)' }} />
                        <span className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass p-8 rounded-xl">
                  <Lock className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--brand-primary)' }} />
                  <h3 className="heading-3 mb-4 text-center">Try It Now</h3>
                  <p className="body-medium text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Launch TauBrowser and visit any website. Google, Gmail, GitHub—all private and secure.
                  </p>
                  <Button 
                    className="btn-primary dark-button-animate w-full" 
                    onClick={() => setShowBrowser(true)}
                  >
                    <Globe className="w-4 h-4" />
                    Launch Browser
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32" style={{ background: 'var(--bg-secondary)' }}>
            <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
              <h2 className="display-medium mb-8">Ready to Browse Privately?</h2>
              <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
                Experience the web without tracking. Launch TauBrowser now and visit Google, Gmail, or any site you want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="btn-primary dark-button-animate text-lg px-8"
                  onClick={() => setShowBrowser(true)}
                >
                  <Globe className="w-5 h-5" />
                  Launch Browser Now
                </Button>
                <Button 
                  className="btn-secondary dark-button-animate text-lg px-8"
                  onClick={() => window.open('/download', '_self')}
                >
                  <Download className="w-5 h-5" />
                  Download TauBrowser
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Browser View
  return (
    <div className="App" style={{ height: '100vh', overflow: 'hidden' }}>
      <div style={{ 
        background: 'var(--bg-primary)', 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Browser Toolbar */}
        <div className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          {/* Tabs */}
          <div className="flex items-center space-x-1 px-2 pt-2 overflow-x-auto" style={{ background: 'var(--bg-secondary)' }}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg cursor-pointer min-w-[150px] max-w-[250px] ${
                  tab.active ? 'glass' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="body-small truncate flex-1" style={{ color: tab.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {tab.blocked ? '🚫 ' : ''}{tab.title}
                </span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  title="Close tab"
                >
                  <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            ))}
            <button
              onClick={() => createNewTab()}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="New tab"
            >
              <Plus className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>

          {/* Toolbar */}
          <div className="glass p-4">
            <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowBrowser(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Back to Landing"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" style={{ color: 'var(--text-muted)' }} />
            </button>
            
            <button 
              onClick={() => window.history.forward()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Forward"
            >
              <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
            
            <button 
              onClick={() => handleNavigate(getCurrentTab()?.url || 'https://www.google.com')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
            </button>
            
            <button 
              onClick={() => handleNavigate('https://www.google.com')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Home"
            >
              <Home className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
            
            {/* Address Bar */}
            <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center space-x-2">
              <div className="flex-1 glass rounded-lg px-4 py-2 flex items-center space-x-2">
                {getSecureIcon()}
                <input 
                  type="text" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL or search..."
                  className="flex-1 bg-transparent border-none outline-none body-medium"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </form>
            
            <button
              onClick={() => createNewTab()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="New Tab"
            >
              <Plus className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Privacy Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1 glass rounded-lg">
              <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <span className="body-small" style={{ color: 'var(--text-muted)' }}>Private</span>
            </div>
            
            {/* Manual "Site Blocked" Button - for user to report if page isn't loading */}
            <button
              onClick={() => {
                const currentTab = getCurrentTab();
                if (currentTab && confirm('Is this page not loading? This will open it in a new TauBrowser tab.')) {
                  createNewTab(currentTab.url);
                }
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Report page not loading"
            >
              <AlertCircle className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>

            {/* Quick Links */}
            <div className="flex items-center space-x-2 mt-4 overflow-x-auto">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLink(link.url)}
                  className="px-3 py-1 glass rounded-lg body-small whitespace-nowrap dark-hover dark-transition"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Browser Content - iframe for actual websites */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20" style={{ background: 'var(--bg-primary)' }}>
              <RefreshCw className="w-8 h-8 animate-spin" style={{ color: 'var(--brand-primary)' }} />
            </div>
          )}
          
          {/* Render all tabs - active tab shown, others hidden */}
          {tabs.map((tab) => {
            // Remove automatic blocking - let sites load normally
            // Only show blocked message if user manually reports it
            if (false && tab.blocked && tab.active) {
              return (
                <div
                  key={tab.id}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ 
                    display: tab.active ? 'flex' : 'none',
                    zIndex: tab.active ? 10 : 1
                  }}
                >
                  <div className="glass p-8 rounded-xl max-w-md text-center">
                    <AlertCircle className="w-16 h-16 mx-auto mb-6" style={{ color: '#ffbd2e' }} />
                    <h3 className="heading-3 mb-4">Cannot Display Page</h3>
                    <p className="body-medium mb-8" style={{ color: 'var(--text-secondary)' }}>
                      This website does not allow embedding in frames. Click the button below to open it in a new TauBrowser tab.
                    </p>
                    <div className="flex flex-col space-y-4">
                      <Button 
                        className="btn-primary dark-button-animate w-full"
                        onClick={() => {
                          createNewTab(tab.url);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Open in New Tab
                      </Button>
                      <Button 
                        className="btn-secondary dark-button-animate w-full"
                        onClick={() => handleNavigate('https://www.github.com', tab.id)}
                      >
                        Try Another Site
                      </Button>
                    </div>
                    <p className="body-small mt-6" style={{ color: 'var(--text-muted)' }}>
                      Current URL: {tab.url}
                    </p>
                  </div>
                </div>
              );
            }
            
            return (
              <iframe
                key={tab.id}
                src={tab.url}
                title={`TauBrowser-${tab.id}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'white',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: tab.active && !tab.blocked ? 'block' : 'none',
                  zIndex: tab.active ? 5 : 1
                }}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation"
                onLoad={() => {
                  if (tab.active) {
                    setIsLoading(false);
                  }
                  
                  // Don't automatically detect X-Frame-Options blocking
                  // Many cross-origin sites can't be accessed via JavaScript but still display fine
                  // Only manually check if user reports an issue
                  // Sites that are truly blocked will show a blank iframe, but we can't detect that
                  // programmatically for cross-origin sites without false positives
                  
                  // Clear any existing blocked status when page loads
                  setTabs(prevTabs => prevTabs.map(t => 
                    t.id === tab.id ? { ...t, blocked: false } : t
                  ));
                }}
                onError={() => {
                  // Network errors are different from X-Frame-Options
                  // Don't mark as blocked for network errors
                  setIsLoading(false);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
