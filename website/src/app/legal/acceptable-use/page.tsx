import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Shield, Ban } from 'lucide-react';

export default function AcceptableUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">τ</span>
              </div>
              <span className="text-white text-xl font-bold">TauOS</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <AlertTriangle className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Acceptable Use Policy</h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 text-purple-400 mr-3" />
                Prohibited Activities
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                The following activities are strictly prohibited when using TauOS services:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Illegal activities or violation of any applicable laws</li>
                <li>Spam, harassment, or abuse of other users</li>
                <li>Distribution of malware, viruses, or harmful content</li>
                <li>Attempting to compromise system security</li>
                <li>Violation of intellectual property rights</li>
                <li>Creating multiple accounts to circumvent restrictions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Ban className="w-6 h-6 text-purple-400 mr-3" />
                Enforcement
              </h2>
              <p className="text-white/80 leading-relaxed">
                Violations of this policy may result in account suspension or termination. 
                We reserve the right to investigate and take appropriate action against any violations.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-white/60 text-sm">© 2025 TauOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
