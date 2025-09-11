import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          
          <p className="text-white/80 text-lg mb-8">
            <strong>Effective Date:</strong> September 12, 2025<br />
            <strong>Last Updated:</strong> September 12, 2025
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Lock className="w-6 h-6 text-purple-400 mr-3" />
                Our Commitment to Privacy
              </h2>
              <p className="text-white/80 leading-relaxed">
                At TauOS, privacy isn't just a feature—it's our foundation. We believe that your data belongs to you, 
                and we've built our entire ecosystem around this principle. This Privacy Policy explains how we collect, 
                use, and protect your information when you use TauOS services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Eye className="w-6 h-6 text-purple-400 mr-3" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Account Information</h3>
                  <p className="text-white/80">
                    When you create an account, we collect only the essential information needed to provide our services:
                  </p>
                  <ul className="list-disc list-inside text-white/80 mt-2 space-y-1">
                    <li>Email address (for account verification and communication)</li>
                    <li>Username (chosen by you)</li>
                    <li>Password (encrypted and never stored in plain text)</li>
                    <li>Full name (optional, for personalization)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Usage Data</h3>
                  <p className="text-white/80">
                    We collect minimal usage data to improve our services:
                  </p>
                  <ul className="list-disc list-inside text-white/80 mt-2 space-y-1">
                    <li>App performance metrics (anonymized)</li>
                    <li>Error logs (for debugging, no personal data)</li>
                    <li>Feature usage statistics (aggregated and anonymous)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Database className="w-6 h-6 text-purple-400 mr-3" />
                How We Use Your Information
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We use your information solely to provide and improve our services:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>To provide TauMail, TauCloud, TauID, and other TauOS services</li>
                <li>To authenticate your identity and secure your account</li>
                <li>To send important service notifications (not marketing)</li>
                <li>To improve our applications and fix bugs</li>
                <li>To ensure compliance with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 text-purple-400 mr-3" />
                Data Sharing and Disclosure
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong>We do not sell, rent, or trade your personal information.</strong> We may share your information only in these limited circumstances:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>With service providers who help us operate our services (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 text-purple-400 mr-3" />
                Data Security
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We implement industry-leading security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>End-to-end encryption for all communications</li>
                <li>Zero-knowledge architecture for file storage</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure data centers with physical and digital security</li>
                <li>Employee access controls and background checks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 text-purple-400 mr-3" />
                Your Rights
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to certain types of data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p className="text-white/80 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 space-y-2 text-white/80">
                <p><strong>Email:</strong> privacy@tauos.org</p>
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
