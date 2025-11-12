import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';

export const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50" style={{
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '16px 7.6923%',
      height: '80px'
    }}>
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/taucore-logo.png" alt="TauCore" className="w-10 h-10" />
          </div>
          <div>
            <h1 className="heading-3 m-0">TauCore</h1>
            <p className="body-muted text-xs m-0">OS Foundation</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="body-medium transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>Features</a>
          <Link to="/apps" className="body-medium transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>Apps</Link>
          <Link to="/tauscript" className="body-medium transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>TauScript</Link>
          <Link to="/download" className="body-medium transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>Download</Link>
        </nav>

        {/* CTA Button */}
        <Button className="btn-primary dark-button-animate" onClick={() => window.location.href='/download'}>
          <FileText className="w-4 h-4" />
          Get Started
        </Button>
      </div>
    </header>
  );
};