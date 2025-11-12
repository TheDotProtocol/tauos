import React from 'react';
import { CheckCircle, Zap, Lock, Globe } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Zero Telemetry',
    description: 'No data collection, no tracking, no surveillance. Your privacy is absolute.'
  },
  {
    icon: Lock,
    title: '100% Security Hardened', 
    description: 'Pen-tested and certified. Military-grade encryption across all services.'
  },
  {
    icon: Globe,
    title: 'Universal Compatibility',
    description: 'Works on any hardware. Windows, macOS, Linux - TauOS runs everywhere.'
  }
];

export const WhyTauCore = () => {
  return (
    <section id="about" className="py-32" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full">
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                <span className="body-small">Your Digital Sovereignty</span>
              </div>
              
              <h2 className="display-large">
                Why <span style={{ color: 'var(--brand-primary)' }}>TauOS</span>?
              </h2>
              
              <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                Big Tech operating systems spy on you, collect your data, and compromise your privacy. TauOS is different. Built on the TauCore kernel, it's designed from the ground up to be completely sovereign—giving you total control over your digital life.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <div>
                      <h3 className="heading-3 mb-2">{benefit.title}</h3>
                      <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="glass-strong p-12" style={{ borderRadius: '0px' }}>
              {/* Code-like visualization */}
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--brand-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>TauCore.initialize()</span>
                </div>
                
                <div className="ml-6 space-y-2">
                  <div style={{ color: 'var(--text-muted)' }}>├── encryption: quantum-resistant</div>
                  <div style={{ color: 'var(--text-muted)' }}>├── sync: real-time</div>
                  <div style={{ color: 'var(--text-muted)' }}>├── performance: optimized</div>
                  <div style={{ color: 'var(--text-muted)' }}>└── scalability: infinite</div>
                </div>
                
                <div className="flex items-center space-x-2 mt-6">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--brand-primary)' }}></div>
                  <span style={{ color: 'var(--brand-primary)' }}>System ready</span>
                </div>
              </div>
            </div>
            
            {/* Background glow */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10" style={{
                background: `radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)`
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};