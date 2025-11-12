import React from 'react';
import { Mail, Cloud, Shield, Store } from 'lucide-react';

const features = [
  {
    icon: Mail,
    title: 'TauMail',
    description: 'Privacy-first email with end-to-end encryption.\nYour communications, completely secure.',
    highlight: 'Zero tracking'
  },
  {
    icon: Cloud,
    title: 'TauCloud',
    description: 'Sovereign cloud storage with military-grade encryption.\nYour files, your control, always.',
    highlight: 'Military-grade'
  },
  {
    icon: Shield,
    title: 'TauID',
    description: 'Universal identity management across the TauOS ecosystem.\nOne identity, infinite possibilities.',
    highlight: 'Single sign-on'
  },
  {
    icon: Store,
    title: 'TauStore',
    description: 'Curated app marketplace for privacy-respecting applications.\nDiscover, install, and manage apps securely.',
    highlight: 'Privacy-first apps'
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-32" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="display-medium mb-6">
            The <span style={{ color: 'var(--brand-primary)' }}>TauOS</span> Ecosystem
          </h2>
          <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A complete suite of privacy-first applications built on the TauCore foundation. From secure email to sovereign cloud storage, TauOS empowers you with complete digital autonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass-strong p-8 dark-hover dark-transition group"
                style={{ borderRadius: '0px' }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="heading-2 mb-2">{feature.title}</h3>
                      <div className="inline-flex items-center px-3 py-1 glass rounded-full mb-4">
                        <span className="body-small" style={{ color: 'var(--brand-primary)' }}>
                          {feature.highlight}
                        </span>
                      </div>
                    </div>
                    
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      {feature.description.split('\n').map((line, idx) => (
                        <span key={idx}>
                          {line}
                          {idx < feature.description.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300" style={{ color: 'var(--brand-primary)' }}>
                      <span>Learn more</span>
                      <div className="w-4 h-[1px]" style={{ background: 'var(--brand-primary)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};