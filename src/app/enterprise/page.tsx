'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import Link from 'next/link';
import { Shield, Building, Lock } from 'lucide-react';

export default function EnterprisePage() {
  return (
    <MarketingPageShell
      title="Enterprise"
      subtitle="Privacy, security, and compliance for organizations that take trust seriously."
    >
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Security', href: '/enterprise/security', desc: 'Defense in depth for your org' },
            { icon: Lock, title: 'MDM', href: '/enterprise/mdm', desc: 'Manage devices with privacy' },
            { icon: Building, title: 'OTA Updates', href: '/enterprise/ota', desc: 'Controlled fleet rollouts' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-8 rounded-2xl bg-gray-900/30 border border-gray-800 hover:border-yellow-400/30 transition-all"
            >
              <item.icon className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingPageShell>
  );
}
