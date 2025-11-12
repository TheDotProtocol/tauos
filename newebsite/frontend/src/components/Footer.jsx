import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'TauMail', href: 'https://www.tauos.org/apps/taumail' },
    { name: 'TauCloud', href: 'https://www.tauos.org/apps/taucloud' },
    { name: 'TauID', href: 'https://www.tauos.org/apps/tauid' },
    { name: 'TauStore', href: 'https://www.tauos.org/apps/taustore' }
  ],
  developers: [
    { name: 'Documentation', href: '/docs' },
    { name: 'GitHub', href: 'https://github.com/TheDotProtocol/tauos' },
    { name: 'Download', href: '/download' },
    { name: 'Contact', href: '/contact' }
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Apps', href: '/apps' },
    { name: 'Support', href: '/support' },
    { name: 'Community', href: '/community' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'Open Source', href: 'https://github.com/TheDotProtocol/tauos' }
  ]
};

const socialLinks = [
  { icon: Github, href: 'https://github.com/TheDotProtocol/tauos', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/tauos', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/tauos', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contact@tauos.org', label: 'Email' }
];

export const Footer = () => {
  return (
    <footer className="py-20" style={{ 
      background: 'var(--bg-secondary)', 
      borderTop: '1px solid var(--border-subtle)' 
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/taucore-logo.png" alt="TauCore" className="w-10 h-10" />
              </div>
              <div>
                <h3 className="heading-3 m-0">TauCore</h3>
                <p className="body-muted text-xs m-0">OS Foundation</p>
              </div>
            </div>
            
            <p className="body-medium max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              The secure, scalable kernel powering the next generation of operating systems.
            </p>
            
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href}
                    className="w-10 h-10 glass flex items-center justify-center dark-hover dark-transition"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="heading-3 mb-6">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('http') ? (
                    <a 
                      href={link.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-medium transition-colors hover:text-white" 
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.href} 
                      className="body-medium transition-colors hover:text-white" 
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="heading-3 mb-6">Developers</h4>
            <ul className="space-y-3">
              {footerLinks.developers.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('http') ? (
                    <a 
                      href={link.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-medium transition-colors hover:text-white" 
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.href} 
                      className="body-medium transition-colors hover:text-white" 
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="heading-3 mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('http') ? (
                    <a 
                      href={link.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-medium transition-colors hover:text-white" 
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.href} 
                      className="body-medium transition-colors hover:text-white" 
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="heading-3 mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('http') ? (
                    <a 
                      href={link.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-medium transition-colors hover:text-white" 
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.href} 
                      className="body-medium transition-colors hover:text-white" 
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white border-opacity-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="body-small" style={{ color: 'var(--text-muted)' }}>
            © 2025 TauOS. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <span className="body-small font-medium">Powered by Tau Foundation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};