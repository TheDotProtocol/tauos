import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';

export const Security = () => {
  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        <section className="py-32" style={{ paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h1 className="display-huge mb-6">
              <span style={{ color: 'var(--brand-primary)' }}>Security</span> Features
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Military-grade security built into every layer of TauOS.
            </p>
          </div>
        </section>

        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="glass-strong p-8" style={{ borderRadius: '0px' }}>
                <Shield className="w-12 h-12 mb-6" style={{ color: 'var(--brand-primary)' }} />
                <h3 className="heading-2 mb-4">100% Security Hardened</h3>
                <p className="body-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
                  TauOS has undergone comprehensive penetration testing and security audits. We maintain 100% compliance with security best practices.
                </p>
                <div className="space-y-3">
                  {[
                    'Pen-tested and certified',
                    'ASLR, SMEP/SMAP enabled',
                    'Kernel hardening',
                    'Application sandboxing'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                      <span className="body-medium" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-strong p-8" style={{ borderRadius: '0px' }}>
                <Lock className="w-12 h-12 mb-6" style={{ color: 'var(--brand-primary)' }} />
                <h3 className="heading-2 mb-4">End-to-End Encryption</h3>
                <p className="body-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Every file, email, and communication is encrypted using AES-256 encryption. Only you have the keys.
                </p>
                <div className="space-y-3">
                  {[
                    'AES-256 encryption',
                    'Quantum-resistant algorithms',
                    'Zero-knowledge architecture',
                    'Encrypted at rest and in transit'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                      <span className="body-medium" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="display-medium mb-8">Report Security Issues</h2>
            <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
              Found a security vulnerability? We take security seriously and appreciate responsible disclosure.
            </p>
            <a href="mailto:security@tauos.org" className="btn-primary dark-button-animate">
              Report Vulnerability
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
