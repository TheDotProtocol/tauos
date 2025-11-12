import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Play } from 'lucide-react';
import Spline from '@splinetool/react-spline';

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center" style={{ 
      background: 'var(--bg-primary)',
      paddingTop: '80px'
    }}>
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }}></div>
                <span className="body-small">Privacy-First Operating System</span>
              </div>
              
              <h1 className="display-huge leading-tight">
                The Sovereign<br />
                <span style={{ color: 'var(--brand-primary)' }}>Operating System</span>
              </h1>
              
              <p className="body-medium max-w-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
                TauOS is a privacy-first, security-hardened operating system built on TauCore — featuring TauMail, TauCloud, TauID, and more.
              </p>
              
              <p className="body-large max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                Experience true digital sovereignty with zero telemetry, end-to-end encryption, and complete control over your data.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="btn-primary dark-button-animate" onClick={() => window.location.href='https://www.tauos.org/download'}>
                Download TauOS
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button className="btn-secondary dark-button-animate" onClick={() => window.location.href='https://www.tauos.org/apps'}>
                <Play className="w-4 h-4" />
                Explore Apps
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>100%</div>
                <div className="body-small" style={{ color: 'var(--text-muted)' }}>Encrypted</div>
              </div>
              <div className="text-center">
                <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>∞</div>
                <div className="body-small" style={{ color: 'var(--text-muted)' }}>Scalable</div>
              </div>
              <div className="text-center">
                <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>⚡</div>
                <div className="body-small" style={{ color: 'var(--text-muted)' }}>Lightning Fast</div>
              </div>
            </div>
          </div>

          {/* Right - 3D Spline Animation */}
          <div className="relative">
            <div className="w-full h-[600px] overflow-visible relative">
              <Spline 
                scene="https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            
            {/* Glow overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-20" style={{
                background: `radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)`
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};