import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Shield, Eye, Users, Lock, Globe, Heart, Code, Award } from 'lucide-react';

const values = [
  {
    icon: Eye,
    title: 'Transparency',
    description: 'We believe in complete transparency. Our code is open source, our processes are documented, and our decisions are made in the open. You can see exactly how your data is handled and why.'
  },
  {
    icon: Lock,
    title: 'Security',
    description: 'Security is not an afterthought - it is built into every layer of our system. From end-to-end encryption to secure boot processes, we protect your data with military-grade security.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We are building this for the community, with the community. Every feature, every decision, and every improvement is driven by what is best for our users, not corporate profits.'
  }
];

const team = [
  {
    title: 'Core Developers',
    count: '50+',
    description: 'contributors building the core operating system and applications'
  },
  {
    title: 'Security Team',
    count: 'Expert',
    description: 'Cryptographers and security researchers ensuring bulletproof protection'
  },
  {
    title: 'Community Team',
    count: 'Global',
    description: 'Community managers and advocates supporting our worldwide user base'
  },
  {
    title: 'Advisory Board',
    count: 'Industry',
    description: 'experts and privacy advocates guiding our strategic direction'
  }
];

export const About = () => {
  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        {/* Hero Section */}
        <section className="py-32" style={{ paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-8">
              <Heart className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <span className="body-small">Our Story</span>
            </div>
            
            <h1 className="display-huge mb-6">
              About <span style={{ color: 'var(--brand-primary)' }}>TauCore™</span>
            </h1>
            
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              We built TauCore™ with one idea in mind: technology should belong to people, not the other way around.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">Our Mission</h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                To create a complete, secure, zero-telemetry operating system that puts users back in control of their digital lives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: 'Privacy First', description: 'Privacy is not just a feature - it is the foundation of everything we build.' },
                { icon: Eye, title: 'Zero Telemetry', description: 'We do not track, we do not sell data, and we do not make you the product.' },
                { icon: Lock, title: 'User Control', description: 'You stay in complete control of your data and digital experience.' },
                { icon: Code, title: 'Open Source', description: 'Transparent, auditable code that anyone can review and contribute to.' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 glass mx-auto mb-6 flex items-center justify-center">
                      <Icon className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <h3 className="heading-3 mb-3">{item.title}</h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">Our Values</h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                The principles that guide everything we do at TauCore™.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="glass-strong p-8" style={{ borderRadius: '0px' }}>
                    <Icon className="w-12 h-12 mb-6" style={{ color: 'var(--brand-primary)' }} />
                    <h3 className="heading-2 mb-4">{value.title}</h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-32" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">Our Team</h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                A diverse team of privacy advocates, security experts, and open-source developers working together to build the future of computing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center glass p-8" style={{ borderRadius: '0px' }}>
                  <div className="heading-1 mb-2" style={{ color: 'var(--brand-primary)' }}>{member.count}</div>
                  <h4 className="heading-3 mb-3">{member.title}</h4>
                  <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="display-medium mb-6">Our Story</h2>
            </div>

            <div className="space-y-8">
              {[
                'TauCore was born from a simple observation: the internet was supposed to be free and open, but it has become a surveillance machine controlled by a few powerful corporations.',
                'Founded in 2024 by privacy advocates and security experts who were tired of the status quo.',
                'Started as a small project to create a truly private email service.',
                'Grew into a complete operating system as we realized the scope of the problem.',
                'Now supported by thousands of contributors and users worldwide.'
              ].map((text, index) => (
                <p key={index} className="body-large text-center" style={{ color: 'var(--text-secondary)' }}>
                  {text}
                </p>
              ))}

              <p className="body-large text-center pt-8" style={{ color: 'var(--text-primary)' }}>
                Today, we are building the operating system that the internet deserves - one that puts users first, respects privacy, and empowers individuals to take control of their digital lives.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="display-medium mb-8">Get in Touch</h2>
            <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
              Want to learn more about TauCore or get involved? We would love to hear from you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="glass p-6" style={{ borderRadius: '0px' }}>
                <h4 className="heading-3 mb-2">San Francisco, USA</h4>
                <p className="body-medium mb-4" style={{ color: 'var(--text-secondary)' }}>2261 Market St, San Francisco, CA 94114</p>
                <a href="mailto:hello@tauos.org" className="body-medium" style={{ color: 'var(--brand-primary)' }}>hello@tauos.org</a>
              </div>
              <div className="glass p-6" style={{ borderRadius: '0px' }}>
                <h4 className="heading-3 mb-2">Kuala Lumpur, Malaysia</h4>
                <p className="body-medium mb-4" style={{ color: 'var(--text-secondary)' }}>IB Tower, Level 33, Kuala Lumpur</p>
                <a href="tel:+60178446206" className="body-medium" style={{ color: 'var(--brand-primary)' }}>+60 178446206</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
