'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Download, Mail, Shield } from 'lucide-react';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { Button } from '@/components/ui/button';
import { site } from '@/content/site';

const knownIssues = [
  'Beta is for Intel/AMD PCs only — not for replacing macOS on Apple Silicon.',
  'Live USB session uses test credentials — change immediately on a network.',
  'Install to disk erases the target drive — back up your existing OS first.',
  'Tau Mail, Tau Cloud, and Tau Store open via web until native apps ship in later betas.',
  'Mobile OS is not included in Beta 1.0.',
  'Some Wi‑Fi chips may need a reboot or second connection attempt.',
];

const hourPlan = [
  { h: '0–2h', label: 'Boot proof', detail: 'QEMU + one real PC boot' },
  { h: '2–4h', label: 'Install proof', detail: 'USB → disk install → reboot' },
  { h: '4–6h', label: 'Beta polish', detail: 'Branding, password, docs' },
  { h: '6–8h', label: 'Ship bits', detail: 'Host ISO, deploy site, manifest' },
  { h: '8–10h', label: 'Launch', detail: 'Invite first testers' },
];

export default function BetaPage() {
  return (
    <MarketingPageShell
      title="Tau OS Beta 1.0"
      subtitle="Early access to a real, bootable privacy-first desktop for PCs — from Tau Core Inc."
      hero
    >
      <div className="container mx-auto px-6 py-12 max-w-4xl space-y-12">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Best for testers and enthusiasts — not yet your only computer unless you are comfortable with beta
            software.
          </p>
        </motion.section>

        <section className="grid sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
            <CheckCircle className="w-8 h-8 text-primary mb-3" />
            <h2 className="font-semibold text-lg mb-2 text-white">What works in beta</h2>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Bootable ISO with Tau OS desktop UI</li>
              <li>Live USB and install-to-disk path</li>
              <li>Auto-detected downloads + SHA256 checksums</li>
              <li>Network, browser, core desktop shell</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <Clock className="w-8 h-8 text-primary mb-3" />
            <h2 className="font-semibold text-lg mb-2 text-white">12-hour launch plan</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              {hourPlan.map((p) => (
                <li key={p.h}>
                  <span className="text-primary font-mono">{p.h}</span> — {p.label}: {p.detail}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <Download className="w-6 h-6 text-primary" />
            How to install
          </h2>
          <ol className="space-y-4 text-muted-foreground">
            {[
              <>
                <Link href="/download" className="text-primary underline">
                  Download
                </Link>{' '}
                the PC ISO (x86_64) and verify the SHA256 on the download page.
              </>,
              'Flash to USB with Balena Etcher, Rufus, or the Tau OS USB wizard.',
              'Reboot the PC, open the boot menu (often F12 / Esc / Del), boot from USB.',
              <>
                Try <strong className="text-white">Tau OS Live Desktop</strong> first, or choose{' '}
                <strong className="text-white">Install to Disk</strong> and set your password when prompted.
              </>,
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Known issues
          </h2>
          <ul className="space-y-2">
            {knownIssues.map((issue) => (
              <li key={issue} className="text-muted-foreground text-sm flex gap-2">
                <span className="text-primary">•</span> {issue}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 rounded-xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
            <Mail className="w-5 h-5 text-primary" />
            Beta feedback
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Found a bug or boot failure? Email us with your PC model and what step failed.
          </p>
          <a
            href={`mailto:${site.supportEmail}?subject=Tau%20OS%20Beta%201.0%20feedback`}
            className="text-primary hover:text-primary/80"
          >
            {site.supportEmail}
          </a>
        </section>

        <section className="flex flex-wrap gap-4 pb-8">
          <Button asChild size="lg" className="rounded-none">
            <Link href="/download">
              <Download className="w-5 h-5 mr-2" />
              Download Beta ISO
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-none">
            <Link href="/docs">
              <Shield className="w-5 h-5 mr-2" />
              Documentation
            </Link>
          </Button>
        </section>
      </div>
    </MarketingPageShell>
  );
}
