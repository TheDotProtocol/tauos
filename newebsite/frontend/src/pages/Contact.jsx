import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        {/* Hero */}
        <section className="py-32" style={{ paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h1 className="display-huge mb-6">
              Contact <span style={{ color: 'var(--brand-primary)' }}>Us</span>
            </h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Get in touch with our team for support, partnerships, or general inquiries. We're here to help and would love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Mail, title: 'General Inquiries', detail: 'hello@tauos.org', response: '24 hours' },
                { icon: Mail, title: 'Support', detail: 'support@tauos.org', response: '24 hours' },
                { icon: Mail, title: 'Press & Media', detail: 'press@tauos.org', response: '48 hours' },
                { icon: Mail, title: 'Partnerships', detail: 'partnerships@tauos.org', response: '72 hours' }
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="glass p-6 text-center" style={{ borderRadius: '0px' }}>
                    <Icon className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--brand-primary)' }} />
                    <h4 className="heading-3 mb-2">{contact.title}</h4>
                    <a href={`mailto:${contact.detail}`} className="body-medium block mb-2" style={{ color: 'var(--brand-primary)' }}>
                      {contact.detail}
                    </a>
                    <p className="body-small" style={{ color: 'var(--text-muted)' }}>Response: {contact.response}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="display-medium text-center mb-16">Our Offices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="glass-strong p-8" style={{ borderRadius: '0px' }}>
                <MapPin className="w-8 h-8 mb-6" style={{ color: 'var(--brand-primary)' }} />
                <h3 className="heading-2 mb-4">San Francisco, USA</h3>
                <p className="body-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Our headquarters and main development center</p>
                <p className="body-medium mb-4" style={{ color: 'var(--text-secondary)' }}>2261 Market St, San Francisco, CA 94114</p>
                <p className="body-medium mb-2" style={{ color: 'var(--brand-primary)' }}>+1 1800 TauOS</p>
                <a href="mailto:hello@tauos.org" className="body-medium" style={{ color: 'var(--brand-primary)' }}>hello@tauos.org</a>
              </div>
              <div className="glass-strong p-8" style={{ borderRadius: '0px' }}>
                <MapPin className="w-8 h-8 mb-6" style={{ color: 'var(--brand-primary)' }} />
                <h3 className="heading-2 mb-4">Kuala Lumpur, Malaysia</h3>
                <p className="body-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Asia-Pacific operations and regional support</p>
                <p className="body-medium mb-4" style={{ color: 'var(--text-secondary)' }}>IB Tower, Level 33, 8, Lrg Binjai, Kuala Lumpur, 50450</p>
                <p className="body-medium mb-2" style={{ color: 'var(--brand-primary)' }}>+60 178446206</p>
                <a href="mailto:malaysia@tauos.org" className="body-medium" style={{ color: 'var(--brand-primary)' }}>malaysia@tauos.org</a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-32" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <h2 className="display-medium text-center mb-12">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="glass-strong p-8" style={{ borderRadius: '0px' }}>
              <div className="space-y-6">
                <div>
                  <label className="body-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 glass border border-white border-opacity-20 text-white"
                    style={{ borderRadius: '0px', background: 'rgba(255,255,255,0.05)' }}
                  />
                </div>
                <div>
                  <label className="body-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 glass border border-white border-opacity-20 text-white"
                    style={{ borderRadius: '0px', background: 'rgba(255,255,255,0.05)' }}
                  />
                </div>
                <div>
                  <label className="body-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 glass border border-white border-opacity-20 text-white"
                    style={{ borderRadius: '0px', background: 'rgba(255,255,255,0.05)' }}
                  />
                </div>
                <div>
                  <label className="body-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 glass border border-white border-opacity-20 text-white resize-none"
                    style={{ borderRadius: '0px', background: 'rgba(255,255,255,0.05)' }}
                  />
                </div>
                <button type="submit" className="btn-primary dark-button-animate w-full">
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
