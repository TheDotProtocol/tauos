import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Download as DownloadIcon, Monitor, Apple, Laptop, Smartphone, CheckCircle, Square } from 'lucide-react';

// Windows icon component (using Square as placeholder since lucide-react doesn't have a Windows icon)
const WindowsIcon = Square;

export const Download = () => {
  const [detectedOS, setDetectedOS] = useState('');
  const [detectedIcon, setDetectedIcon] = useState(Monitor);

  useEffect(() => {
    const detectOS = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Win')) {
        setDetectedOS('Windows');
        setDetectedIcon(WindowsIcon);
      } else if (userAgent.includes('Mac')) {
        setDetectedOS('macOS');
        setDetectedIcon(Apple);
      } else if (userAgent.includes('Linux')) {
        setDetectedOS('Linux');
        setDetectedIcon(Laptop);
      } else if (userAgent.includes('Android')) {
        setDetectedOS('Android');
        setDetectedIcon(Smartphone);
      } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        setDetectedOS('iOS');
        setDetectedIcon(Apple);
      } else {
        setDetectedOS('Unknown');
        setDetectedIcon(Monitor);
      }
    };
    detectOS();
  }, []);

  const downloads = [
    {
      os: 'Windows',
      icon: WindowsIcon,
      file: 'TauOS-Setup-v1.0.0.exe',
      size: '14.9 MB',
      link: '/release-files/TauOS-Setup-v1.0.0.exe'
    },
    {
      os: 'macOS',
      icon: Apple,
      file: 'TauOS-v1.0.0.dmg',
      size: '14.9 MB',
      link: '/release-files/TauOS-v1.0.0.dmg'
    },
    {
      os: 'Linux',
      icon: Laptop,
      file: 'TauOS-Linux-v1.0.0.AppImage',
      size: '14.9 MB',
      link: '/release-files/TauOS-Linux-v1.0.0.AppImage'
    },
    {
      os: 'Desktop ISO',
      icon: Monitor,
      file: 'TauOS-Desktop-v1.0.0.iso',
      size: '503 KB',
      link: '/release-files/TauOS-Desktop-v1.0.0.iso'
    }
  ];

  const DetectedIcon = detectedIcon;

  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center" style={{ paddingTop: '80px' }}>
          <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-8">
              <DownloadIcon className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <span className="body-small">Production Ready</span>
            </div>
            
            <h1 className="display-huge mb-6">
              Download <span style={{ color: 'var(--brand-primary)' }}>TauOS</span>
            </h1>
            
            <p className="body-large max-w-2xl mx-auto mb-12" style={{ color: 'var(--text-secondary)' }}>
              Experience true digital sovereignty. Choose your platform and start your journey to privacy and freedom.
            </p>

            {/* Detected OS */}
            {detectedOS !== 'Unknown' && (
              <div className="glass-strong p-8 mb-12 mx-auto max-w-lg" style={{ borderRadius: '0px' }}>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <DetectedIcon className="w-12 h-12" style={{ color: 'var(--brand-primary)' }} />
                  <div className="text-left">
                    <p className="body-small" style={{ color: 'var(--text-muted)' }}>Detected:</p>
                    <h3 className="heading-2">{detectedOS}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const download = downloads.find(d => d.os === detectedOS);
                    if (download) window.location.href = download.link;
                  }}
                  className="btn-primary dark-button-animate w-full"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Download for {detectedOS}
                </button>
              </div>
            )}

            {/* All Downloads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {downloads.map((download, index) => {
                const Icon = download.icon;
                return (
                  <div 
                    key={index}
                    onClick={() => window.location.href = download.link}
                    className="glass p-6 dark-hover dark-transition group cursor-pointer"
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="heading-3 mb-1">{download.os}</h4>
                        <p className="body-small" style={{ color: 'var(--text-muted)' }}>{download.size}</p>
                      </div>
                      <DownloadIcon className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Features */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--brand-primary)' }} />
                <h4 className="heading-3 mb-2">Zero Telemetry</h4>
                <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>No tracking, no surveillance</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--brand-primary)' }} />
                <h4 className="heading-3 mb-2">100% Secure</h4>
                <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Military-grade encryption</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--brand-primary)' }} />
                <h4 className="heading-3 mb-2">OTA Updates</h4>
                <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Automatic updates</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
