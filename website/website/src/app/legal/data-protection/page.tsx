import React from 'react';
import Link from 'next/link';
import { Shield, Database, Lock, Eye } from 'lucide-react';

export default function DataProtection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">τ</span>
              </div>
              <span className="text-white text-xl font-bold">TauCore™</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Data Protection Addendum</h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Database className="w-6 h-6 text-purple-400 mr-3" />
                GDPR Compliance
              </h2>
              <p className="text-white/80 leading-relaxed">
                TauCore™ is fully compliant with the General Data Protection Regulation (GDPR). We implement 
                privacy by design principles and provide you with complete control over your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Lock className="w-6 h-6 text-purple-400 mr-3" />
                Data Processing
              </h2>
              <p className="text-white/80 leading-relaxed">
                We process your data only for the purposes of providing our services. All data is encrypted 
                in transit and at rest, and we never share your personal information with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Eye className="w-6 h-6 text-purple-400 mr-3" />
                Your Rights
              </h2>
              <p className="text-white/80 leading-relaxed">
                Under GDPR, you have the right to access, rectify, erase, restrict, port, and object to 
                the processing of your personal data. Contact us at privacy@tauos.org to exercise these rights.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-white/60 text-sm">© 2025 TauCore™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
