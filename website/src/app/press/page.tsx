import React from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, Download } from 'lucide-react';

export default function Press() {
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
            <Newspaper className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Press & Media</h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-6 h-6 text-purple-400 mr-3" />
                Press Releases
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">TauOS Launches Privacy-First Operating System</h3>
                  <p className="text-white/60 text-sm mb-2">September 12, 2025</p>
                  <p className="text-white/80">TauOS announces the launch of the world's first truly privacy-first operating system...</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Download className="w-6 h-6 text-purple-400 mr-3" />
                Media Kit
              </h2>
              <p className="text-white/80 leading-relaxed">
                Download our press kit including logos, screenshots, and company information for media use.
              </p>
              <div className="mt-4">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Download Media Kit
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
              <p className="text-white/80 leading-relaxed">
                For press inquiries, please contact:
              </p>
              <div className="mt-4 space-y-2 text-white/80">
                <p><strong>Email:</strong> press@tauos.org</p>
                <p><strong>Phone:</strong> +1 1800 TauOS</p>
              </div>
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
