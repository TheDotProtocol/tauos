import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HelpCircle, Book, MessageCircle, Mail, Search } from 'lucide-react';

export const Support = () => {
  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        <section className="py-32" style={{ paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h1 className="display-huge mb-6">
              <span style={{ color: 'var(--brand-primary)' }}>Support</span> Center
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Get help, find answers, and connect with our support team.
            </p>
          </div>
        </section>

        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Book, title: 'Documentation', description: 'Comprehensive guides', link: '/docs' },
                { icon: HelpCircle, title: 'FAQ', description: 'Common questions', link: '#' },
                { icon: MessageCircle, title: 'Community', description: 'Ask the community', link: '/community' },
                { icon: Mail, title: 'Contact Us', description: 'Email support', link: '/contact' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    onClick={() => window.location.href = item.link}
                    className="glass-strong p-8 dark-hover dark-transition cursor-pointer text-center"
                    style={{ borderRadius: '0px' }}
                  >
                    <Icon className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--brand-primary)' }} />
                    <h3 className="heading-2 mb-3">{item.title}</h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <h2 className="display-medium text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: 'How do I install TauOS?', a: 'Visit our download page, select your platform, and follow the installation wizard.' },
                { q: 'Is TauOS free?', a: 'Yes, TauOS is completely free and open-source.' },
                { q: 'What platforms are supported?', a: 'TauOS supports Windows, macOS, Linux, and mobile platforms.' },
                { q: 'How do I report a bug?', a: 'Report bugs on our GitHub repository or contact support@tauos.org.' },
                { q: 'Is my data private?', a: 'Absolutely. We have zero telemetry and never track or collect your data.' }
              ].map((faq, index) => (
                <div key={index} className="glass-strong p-6" style={{ borderRadius: '0px' }}>
                  <h4 className="heading-3 mb-3">{faq.q}</h4>
                  <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
