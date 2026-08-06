'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Apple, Download, HardDrive, Monitor, Smartphone, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TxpContainer, TxpGlassCard, TxpSection, TxpSectionHeading } from '@/txp/components/primitives';
import { txpStory } from '@/content/txp/story';
import { txpNav } from '@/content/txp/navigation';

const TAUTALK_APK =
  'https://github.com/TheDotProtocol/tauos/releases/download/taubrowser-v1.0.0-beta.2/TauTalk-1.0.0-beta.apk';

const platforms = [
  { icon: Smartphone, name: 'Android', status: 'Public Beta', href: TAUTALK_APK, highlight: true },
  { icon: Monitor, name: 'Windows', status: 'Available', href: '/download' },
  { icon: Apple, name: 'macOS', status: 'Available', href: '/download' },
  { icon: Terminal, name: 'Linux', status: 'Available', href: '/download' },
];

export default function DownloadSection() {
  const { join } = txpStory;

  return (
    <TxpSection id="download-center">
      <TxpContainer wide>
        <TxpSectionHeading eyebrow={join.eyebrow} title={join.title} subtitle={join.subtitle} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-14 md:mb-16 max-w-6xl mx-auto">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TxpGlassCard
                className={`p-8 md:p-9 ${p.highlight ? 'border-yellow-400/30 ring-1 ring-yellow-400/10' : ''}`}
              >
                <p.icon className="w-8 h-8 text-yellow-400/90 mb-5" />
                <h3 className="font-semibold text-lg text-white">{p.name}</h3>
                <p className="text-xs text-yellow-400/80 mt-2 mb-5 tracking-wide">{p.status}</p>
                <Link href={p.href} className="text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-500">
                  Download →
                </Link>
              </TxpGlassCard>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 h-12 border-0">
            <Link href="/download">
              <Download className="w-5 h-5 mr-2" />
              {join.cta}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:border-yellow-400/30 h-12 px-8">
            <Link href={txpNav.actions.join.href}>Join Tau</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-gray-400 hover:text-yellow-400 h-12">
            <Link href="/download#checksums">
              <HardDrive className="w-5 h-5 mr-2" />
              Checksums & Release Notes
            </Link>
          </Button>
        </div>
      </TxpContainer>
    </TxpSection>
  );
}
