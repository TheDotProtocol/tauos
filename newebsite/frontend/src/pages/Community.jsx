import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Users, MessageCircle, Github, Heart, Code, Book } from 'lucide-react';

export const Community = () => {
  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        <section className="py-32" style={{ paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h1 className="display-huge mb-6">
              Join the <span style={{ color: 'var(--brand-primary)' }}>Community</span>
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Connect with privacy advocates, developers, and TauOS users worldwide. Together, we're building the future of digital sovereignty.
            </p>
          </div>
        </section>

        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Github, title: 'GitHub', description: 'Contribute to TauOS development', link: 'https://github.com/TheDotProtocol/tauos' },
                { icon: MessageCircle, title: 'Forum', description: 'Join discussions and get help', link: '#' },
                { icon: Users, title: 'Discord', description: 'Chat with the community', link: '#' },
                { icon: Code, title: 'Developer Hub', description: 'Build on TauOS', link: '/developers' },
                { icon: Book, title: 'Documentation', description: 'Learn and explore', link: '/docs' },
                { icon: Heart, title: 'Support', description: 'Get help when you need it', link: '/support' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    onClick={() => window.location.href = item.link}
                    className="glass-strong p-8 dark-hover dark-transition cursor-pointer"
                    style={{ borderRadius: '0px' }}
                  >
                    <Icon className="w-12 h-12 mb-6" style={{ color: 'var(--brand-primary)' }} />
                    <h3 className="heading-2 mb-3">{item.title}</h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="display-medium mb-8">Community Guidelines</h2>
            <div className="text-left space-y-6 glass-strong p-8" style={{ borderRadius: '0px' }}>
              {[
                'Be respectful and inclusive to all community members',
                'Share knowledge and help others learn',
                'Contribute constructively to discussions',
                'Report security issues responsibly',
                'Respect privacy and never share personal information',
                'Follow open-source best practices'
              ].map((guideline, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--brand-primary)' }}></div>
                  <p className="body-large" style={{ color: 'var(--text-secondary)' }}>{guideline}</p>
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
