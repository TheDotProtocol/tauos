'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  FileText,
  Mail,
  Scale,
  Shield,
  X,
} from 'lucide-react';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import JourneyNav from '@/components/website/marketing/shared/JourneyNav';
import JourneyFooter from '@/components/website/marketing/shared/JourneyFooter';
import { inter } from '@/lib/website/fonts';
import { websiteRoutes } from '@/lib/website/routes';

const privacyLevels = [
  {
    name: 'Maximum Privacy',
    description: 'No system monitoring. Zero telemetry.',
    recommended: false,
  },
  {
    name: 'Balanced Privacy',
    description: 'System-level security events only. No personal data access.',
    recommended: true,
  },
  {
    name: 'Enhanced Safety',
    description: 'Extended threat and stability monitoring. System-level only.',
    recommended: false,
  },
] as const;

const allowedUses = [
  'Install Tau Core on supported personal computers and virtual machines',
  'Use bundled Tau applications (TauID, TauMail, TauCloud, TauTalk, TauBrowser, TauStore)',
  'Receive updates through official Tau Core update channels',
] as const;

const restrictedUses = [
  'Reverse engineer, decompile, or disassemble the Software except where permitted by law',
  'Remove proprietary notices or license files',
  'Redistribute modified installers without written permission',
  'Use Tau Core to operate illegal services or violate applicable law',
] as const;

const sections = [
  {
    id: 'agreement',
    title: '1. Agreement',
    body: 'This End User License Agreement ("EULA") is a legal agreement between you ("User") and AR Holdings / TauOS Foundation ("Licensor") for Tau Core™ operating system software, installers, updates, and related documentation ("Software"). By installing, copying, or using Tau Core, you agree to this EULA. If you do not agree, do not install or use the Software.',
  },
  {
    id: 'license',
    title: '2. License Grant',
    body: 'Licensor grants you a non-exclusive, non-transferable, revocable license to install and use Tau Core on devices you own or control, subject to this EULA.',
  },
  {
    id: 'tau-id',
    title: '5. Tau ID & Cloud Services',
    body: 'Creating a Tau ID is optional but enables profile sync, cloud backup, and cross-device continuity. Tau ID usage is governed by the Tau ID Privacy Policy. Local-only use of Tau Core without a Tau ID account is fully supported.',
    link: { href: '/tauid/privacy', label: 'Tau ID Privacy Policy' },
  },
  {
    id: 'open-source',
    title: '6. Open Source Components',
    body: 'Tau Core v1 is built on Linux and Debian components licensed under GPL, LGPL, MIT, and other open-source licenses. Corresponding source notices are included in /usr/share/doc/ on installed systems. Nothing in this EULA limits your rights under those open-source licenses.',
  },
  {
    id: 'updates',
    title: '7. Updates',
    body: 'Licensor may provide updates that add, modify, or remove features. Updates may be delivered via ISO, package manager, or OTA channels. Continued use after an update constitutes acceptance of applicable changes.',
  },
  {
    id: 'warranty',
    title: '8. Disclaimer of Warranties',
    body: 'THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. LICENSOR DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. Tau Core v1 uses a Linux foundation. Hardware compatibility varies by device. Always back up important data before installation.',
    emphasis: true,
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    body: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, LICENSOR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR GOODWILL, ARISING FROM USE OF THE SOFTWARE.',
    emphasis: true,
  },
  {
    id: 'compliance',
    title: '10. Compliance',
    body: 'Tau Core is designed to comply with GDPR, CCPA, and applicable privacy regulations. Users in regulated industries are responsible for their own compliance obligations.',
  },
  {
    id: 'termination',
    title: '11. Termination',
    body: 'This license terminates automatically if you breach this EULA. Upon termination, you must cease use and uninstall the Software.',
  },
] as const;

export default function TauCoreEulaPage() {
  return (
    <ProductPageLayout>
      <JourneyNav active="download" />

      <section className={`${inter.className} border-b border-[#2a2820] px-6 pb-12 pt-24 md:px-20`}>
        <div className="mx-auto max-w-[900px]">
          <Link
            href={websiteRoutes.download}
            className="inline-flex items-center gap-2 text-sm text-[#8e8e93] transition hover:text-[#d4af37]"
          >
            <ArrowLeft className="size-4" />
            Back to Download Center
          </Link>

          <div className="mt-8 flex flex-wrap items-start gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-[#3a3114]">
              <Scale className="size-7 text-[#d4af37]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4af37]">Legal</p>
              <h1 className="mt-2 font-[family-name:var(--font-instrument-serif)] text-4xl md:text-5xl">
                Tau Core End User License Agreement
              </h1>
              <p className="mt-3 text-sm text-[#8e8e93]">
                Version 1.0 · Effective June 15, 2026
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[#d4af37]/25 bg-[#161616] p-6">
            <p className="text-sm leading-relaxed text-[#a0a0a0]">
              This agreement governs installation and use of Tau Core™ — the privacy-first operating
              system, installers, updates, and bundled Tau applications. Read it before you install
              or accept in the Setup Wizard.
            </p>
          </div>
        </div>
      </section>

      <section className={`${inter.className} px-6 py-16 md:px-20`}>
        <div className="mx-auto grid max-w-[900px] gap-10 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:block">
            <p className="text-[11px] font-bold uppercase text-[#d4af37]">On this page</p>
            <ul className="mt-4 space-y-2 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-[#8e8e93] transition hover:text-[#d4af37]">
                    {section.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#privacy" className="text-[#8e8e93] transition hover:text-[#d4af37]">
                  3. Privacy First
                </a>
              </li>
              <li>
                <a href="#monitoring" className="text-[#8e8e93] transition hover:text-[#d4af37]">
                  4. Safety Monitoring
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#8e8e93] transition hover:text-[#d4af37]">
                  12. Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="space-y-8">
            {sections.slice(0, 2).map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-xl border border-[#2a2820] bg-[#161616] p-8"
              >
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
                <p
                  className={`mt-4 text-sm leading-relaxed text-[#a0a0a0] ${
                    'emphasis' in section && section.emphasis ? 'uppercase' : ''
                  }`}
                >
                  {section.body}
                </p>
              </article>
            ))}

            <article className="rounded-xl border border-[#2a2820] bg-[#161616] p-8">
                <h2 className="text-xl font-bold">Permitted & restricted use</h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase text-[#d4af37]">You may</p>
                    <ul className="mt-3 space-y-2">
                      {allowedUses.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-[#a0a0a0]">
                          <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-[#888]">You may not</p>
                    <ul className="mt-3 space-y-2">
                      {restrictedUses.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-[#a0a0a0]">
                          <X className="mt-0.5 size-4 shrink-0 text-red-400/80" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
              </div>
            </article>

            <article id="privacy" className="scroll-mt-28 rounded-xl border border-[#d4af37]/30 bg-[#161616] p-8">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-[#d4af37]" />
                <h2 className="text-xl font-bold">3. Privacy First Principles</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#a0a0a0]">
                Tau Core is designed with privacy as a foundational principle.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[#2a2820] bg-[#0f0f0f] p-5">
                  <p className="text-xs font-bold uppercase text-[#d4af37]">We protect</p>
                  <p className="mt-2 text-sm text-[#a0a0a0]">
                    Your files, communications, browsing activity, application usage, and personal data
                    from unauthorized collection.
                  </p>
                </div>
                <div className="rounded-lg border border-[#2a2820] bg-[#0f0f0f] p-5">
                  <p className="text-xs font-bold uppercase text-[#888]">We do not</p>
                  <p className="mt-2 text-sm text-[#a0a0a0]">
                    Sell personal information, track you for advertising, monitor message contents, or
                    share data with third parties without your explicit consent.
                  </p>
                </div>
              </div>
            </article>

            <article id="monitoring" className="scroll-mt-28 rounded-xl border border-[#2a2820] bg-[#161616] p-8">
              <h2 className="text-xl font-bold">4. Optional Safety Monitoring</h2>
              <p className="mt-3 text-sm text-[#a0a0a0]">
                You may choose a privacy level during setup. Monitoring, if enabled, is limited to
                CPU/memory/disk metrics, failed login attempts, malware signals, and network anomalies
                — never file contents, messages, or browsing history.
              </p>
              <div className="mt-6 overflow-x-auto rounded-lg border border-[#2a2820]">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2820] bg-[#0f0f0f] text-[11px] font-bold uppercase text-[#d4af37]">
                      <th className="px-4 py-3">Level</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {privacyLevels.map((level) => (
                      <tr key={level.name} className="border-b border-[#2a2820] last:border-0">
                        <td className="px-4 py-3 font-semibold">
                          {level.name}
                          {level.recommended && (
                            <span className="ml-2 rounded-full bg-[#3a3114] px-2 py-0.5 text-[10px] font-bold text-[#d4af37]">
                              Recommended
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#8e8e93]">{level.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {sections.slice(2).map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-xl border border-[#2a2820] bg-[#161616] p-8"
              >
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
                <p
                  className={`mt-4 text-sm leading-relaxed text-[#a0a0a0] ${
                    'emphasis' in section && section.emphasis ? 'uppercase' : ''
                  }`}
                >
                  {section.body}
                </p>
                {'link' in section && section.link && (
                  <Link href={section.link.href} className="mt-4 inline-block text-sm font-semibold text-[#d4af37] underline">
                    {section.link.label}
                  </Link>
                )}
              </article>
            ))}

            <article id="contact" className="scroll-mt-28 rounded-xl border border-[#d4af37]/30 bg-[#161616] p-8">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-[#d4af37]" />
                <h2 className="text-xl font-bold">12. Contact</h2>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Privacy', email: 'privacy@tauos.org' },
                  { label: 'Legal', email: 'legal@tauos.org' },
                  { label: 'Support', email: 'support@tauos.org' },
                  { label: 'Website', email: 'www.tauos.org', href: 'https://www.tauos.org' },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-[#2a2820] bg-[#0f0f0f] p-4">
                    <p className="text-xs font-bold uppercase text-[#666]">{item.label}</p>
                    {'href' in item && item.href ? (
                      <a href={item.href} className="mt-1 block text-sm font-semibold text-[#d4af37] hover:underline">
                        {item.email}
                      </a>
                    ) : (
                      <a href={`mailto:${item.email}`} className="mt-1 block text-sm font-semibold text-[#d4af37] hover:underline">
                        {item.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </article>

            <div className="rounded-xl border border-[#2a2820] bg-[#0f0f0f] p-8 text-center">
              <FileText className="mx-auto size-8 text-[#d4af37]" />
              <p className="mt-4 text-sm leading-relaxed text-[#a0a0a0]">
                By clicking &ldquo;I Accept&rdquo; in the Tau Core Setup Wizard, you confirm that you have read,
                understood, and agree to this EULA.
              </p>
              <p className="mt-4 text-xs text-[#666]">
                © 2026 Tau Core™ / AR Holdings. All rights reserved. Tau Core™ is a trademark of AR Holdings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <JourneyFooter />
    </ProductPageLayout>
  );
}
