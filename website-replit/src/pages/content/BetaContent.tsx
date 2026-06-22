/* Ported from src/app/beta/page.tsx — content preserved from legacy site */
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Download, Mail, Shield } from 'lucide-react';

const knownIssues = [
  'Beta is for Intel/AMD PCs only — not for replacing macOS on Apple Silicon.',
  'Live USB session uses test login tau/tauos — change immediately on a network.',
  'Install to disk erases the target drive — back up Windows/macOS first.',
  'TauMail, TauCloud, and TauStore open via web until native apps ship in later betas.',
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

export function BetaContent() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
            <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-4">TauOS Beta 1.0</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Early access to a real, bootable privacy-first desktop for PCs. Best for testers and enthusiasts —
            not yet your only computer unless you are comfortable with beta software.
          </p>
        </motion.section>

        <section className="grid sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
            <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
            <h2 className="font-semibold text-lg mb-2">What works in beta</h2>
            <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
              <li>Bootable 400MB ISO with TauOS desktop UI</li>
              <li>Live USB and install-to-disk path</li>
              <li>Auto-detected downloads + SHA256 checksums</li>
              <li>Network, browser, core desktop shell</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <Clock className="w-8 h-8 text-amber-400 mb-3" />
            <h2 className="font-semibold text-lg mb-2">12-hour launch plan</h2>
            <ul className="text-sm text-gray-400 space-y-2">
              {hourPlan.map((p) => (
                <li key={p.h}>
                  <span className="text-amber-300 font-mono">{p.h}</span> — {p.label}: {p.detail}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Download className="w-6 h-6 text-purple-400" />
            How to install (plain steps)
          </h2>
          <ol className="space-y-4 text-gray-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">1</span>
              <span><a href="/download" className="text-purple-400 underline">Download</a> the PC ISO (x86_64) and verify the SHA256 on the download page.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">2</span>
              <span>Flash to USB with Balena Etcher, Rufus, or the TauOS USB wizard (.dmg / .exe).</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">3</span>
              <span>Reboot the PC, open the boot menu (often F12 / Esc / Del), boot from USB.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">4</span>
              <span>Try <strong className="text-white">TauOS Live Desktop</strong> first, or choose <strong className="text-white">Install to Disk</strong> and set your password when prompted.</span>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Known issues
          </h2>
          <ul className="space-y-2">
            {knownIssues.map((issue) => (
              <li key={issue} className="text-gray-400 text-sm flex gap-2">
                <span className="text-amber-500">•</span> {issue}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 rounded-xl border border-gray-800 bg-gray-900/40">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Beta feedback
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Found a bug or boot failure? Email us with your PC model and what step failed.
          </p>
          <a href="mailto:support@tauos.org?subject=TauOS%20Beta%201.0%20feedback" className="text-purple-400 hover:text-purple-300">
            support@tauos.org
          </a>
        </section>

        <section className="flex flex-wrap gap-4">
          <a
            href="/download"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold"
          >
            <Download className="w-5 h-5" />
            Download Beta ISO
          </a>
          <a href="/docs" className="inline-flex items-center gap-2 border border-gray-700 px-6 py-3 rounded-lg text-gray-300 hover:border-gray-500">
            <Shield className="w-5 h-5" />
            Documentation
          </a>
        </section>
      </main>
    </div>
  );
}
