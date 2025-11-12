import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Github, FileText, Users } from 'lucide-react';

const resources = [
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Complete guides for installation and usage',
    link: '/docs'
  },
  {
    icon: Github,
    title: 'Open Source',
    description: 'Contribute to the TauOS ecosystem on GitHub',
    link: 'https://github.com/TheDotProtocol/tauos'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join our community of privacy advocates',
    link: 'https://www.tauos.org/community'
  }
];

export const DeveloperCTA = () => {
  return (
    <section id="developers" className="py-32" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main CTA */}
        <div className="text-center mb-20">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }}></div>
              <span className="body-small">Join the Movement</span>
            </div>
            
            <h2 className="display-large max-w-4xl mx-auto">
              Ready for <span style={{ color: 'var(--brand-primary)' }}>Digital Sovereignty</span>?
            </h2>
            
            <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Download TauOS today and experience true privacy. With TauMail, TauCloud, TauID, and TauStore—all working together to give you complete control over your digital life.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="btn-primary dark-button-animate text-lg px-8" onClick={() => window.location.href='https://www.tauos.org/download'}>
                Download Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button className="btn-secondary dark-button-animate text-lg px-8" onClick={() => window.location.href='/docs'}>
                <FileText className="w-5 h-5" />
                Read the Docs
              </Button>
            </div>
          </div>
        </div>

        {/* Developer Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div 
                key={index}
                onClick={() => window.location.href = resource.link}
                className="glass p-8 text-center dark-hover dark-transition group cursor-pointer"
                style={{ borderRadius: '0px' }}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
                  </div>
                  
                  <div>
                    <h3 className="heading-3 mb-2">{resource.title}</h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      {resource.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300" style={{ color: 'var(--brand-primary)' }}>
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="heading-1" style={{ color: 'var(--brand-primary)' }}>100%</div>
            <div className="body-small" style={{ color: 'var(--text-muted)' }}>Security Hardened</div>
          </div>
          <div>
            <div className="heading-1" style={{ color: 'var(--brand-primary)' }}>Zero</div>
            <div className="body-small" style={{ color: 'var(--text-muted)' }}>Telemetry</div>
          </div>
          <div>
            <div className="heading-1" style={{ color: 'var(--brand-primary)' }}>∞</div>
            <div className="body-small" style={{ color: 'var(--text-muted)' }}>Privacy</div>
          </div>
          <div>
            <div className="heading-1" style={{ color: 'var(--brand-primary)' }}>24/7</div>
            <div className="body-small" style={{ color: 'var(--text-muted)' }}>Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};