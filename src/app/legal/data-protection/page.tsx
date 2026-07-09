'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { motion } from 'framer-motion';
import { Shield, Database, Lock, Eye } from 'lucide-react';

export default function DataProtectionPage() {
  return (
    <MarketingPageShell
      title="Data Protection Addendum"
      subtitle="How Tau Core Inc. processes data under GDPR and enterprise agreements."
    >
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-10 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl space-y-10"
          >
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-yellow-400" />
                GDPR Compliance
              </h2>
              <p className="text-gray-300 leading-relaxed">
                TAU CORE™ is built with privacy by design. Tau Core Inc. implements GDPR-aligned
                controls and gives users meaningful control over personal data across Mail, Cloud,
                and Identity services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-yellow-400" />
                Data Processing
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We process data only to deliver the services you request. Data is encrypted in
                transit and at rest. We do not sell personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-yellow-400" />
                Your Rights
              </h2>
              <p className="text-gray-300 leading-relaxed">
                You may request access, correction, deletion, restriction, portability, or objection
                to processing. Contact{' '}
                <a href="mailto:privacy@tauos.org" className="text-yellow-400 hover:underline">
                  privacy@tauos.org
                </a>{' '}
                to exercise these rights.
              </p>
            </section>

            <section className="pt-4 border-t border-gray-800">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-400">
                  © 2026 Tau Foundation &amp; Tau LLC, a Unit of AR Holdings Group Corporation.
                  All Rights Reserved.
                </p>
              </div>
            </section>
          </motion.div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
