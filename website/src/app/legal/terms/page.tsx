import React from 'react';
import Link from 'next/link';
import { FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">τ</span>
              </div>
              <span className="text-white text-xl font-bold">TauOS</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
              <Link href="/taumail" className="text-white/80 hover:text-white transition-colors">TauMail</Link>
              <Link href="/taucloud" className="text-white/80 hover:text-white transition-colors">TauCloud</Link>
              <Link href="/tauid" className="text-white/80 hover:text-white transition-colors">TauID</Link>
              <Link href="/taustore" className="text-white/80 hover:text-white transition-colors">TauStore</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <FileText className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          </div>
          
          <p className="text-white/80 text-lg mb-8">
            <strong>Effective Date:</strong> September 12, 2025<br />
            <strong>Last Updated:</strong> September 12, 2025
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Scale className="w-6 h-6 text-purple-400 mr-3" />
                Agreement to Terms
              </h2>
              <p className="text-white/80 leading-relaxed">
                By accessing or using TauOS services, you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 text-purple-400 mr-3" />
                Description of Service
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                TauOS provides a privacy-first operating system and ecosystem including:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>TauOS Desktop and Mobile operating systems</li>
                <li>TauMail - Private email service</li>
                <li>TauCloud - Encrypted cloud storage</li>
                <li>TauID - Decentralized identity management</li>
                <li>TauStore - Privacy-focused app store</li>
                <li>TauBrowser - Privacy-first web browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-purple-400 mr-3" />
                User Responsibilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Account Security</h3>
                  <p className="text-white/80">
                    You are responsible for maintaining the security of your account and password. 
                    You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Acceptable Use</h3>
                  <p className="text-white/80 mb-2">You agree not to use our services for:</p>
                  <ul className="list-disc list-inside text-white/80 space-y-1">
                    <li>Illegal activities or violation of any laws</li>
                    <li>Spam, harassment, or abuse</li>
                    <li>Distribution of malware or harmful content</li>
                    <li>Attempting to compromise our security</li>
                    <li>Violation of intellectual property rights</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Privacy and Data Protection</h2>
              <p className="text-white/80 leading-relaxed">
                Your privacy is fundamental to our service. We collect minimal data necessary to provide our services 
                and never sell your personal information. Please review our Privacy Policy for detailed information 
                about our data practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <p className="text-white/80 leading-relaxed">
                While we strive to provide reliable service, we cannot guarantee uninterrupted access. 
                We may temporarily suspend services for maintenance, updates, or security reasons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p className="text-white/80 leading-relaxed">
                To the maximum extent permitted by law, TauOS shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
              <p className="text-white/80 leading-relaxed">
                We may terminate or suspend your account at any time for violation of these Terms. 
                You may also terminate your account at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <p className="text-white/80 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes 
                via email or through our services. Continued use after changes constitutes acceptance of new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p className="text-white/80 leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="mt-4 space-y-2 text-white/80">
                <p><strong>Email:</strong> legal@tauos.org</p>
                <p><strong>Address:</strong> Tau Foundation & Tau LLC, 2261 Market St, San Francisco, CA 94114</p>
                <p><strong>Phone:</strong> +1 1800 TauOS</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">τ</span>
                </div>
                <span className="text-white text-lg font-bold">TauOS</span>
              </div>
              <p className="text-white/60 text-sm">Privacy-First Computing</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/data-protection" className="text-white/60 hover:text-white transition-colors">Data Protection</Link></li>
                <li><Link href="/legal/cookies" className="text-white/60 hover:text-white transition-colors">Cookies Policy</Link></li>
                <li><Link href="/legal/acceptable-use" className="text-white/60 hover:text-white transition-colors">Acceptable Use</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-white/60 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/press" className="text-white/60 hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/careers" className="text-white/60 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="text-sm text-white/60 space-y-2">
                <p><strong>Tau Foundation & Tau LLC</strong></p>
                <p>2261 Market St, San Francisco, CA 94114</p>
                <p>+1 1800 TauOS</p>
                <p className="mt-4"><strong>Malaysia Office</strong></p>
                <p>IB Tower, Level 33, 8, Lrg Binjai</p>
                <p>Kuala Lumpur, 50450 Kuala Lumpur</p>
                <p>+60 178446206</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">© 2025 TauOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
