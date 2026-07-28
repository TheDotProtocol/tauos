'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  Shield,
  Lock,
  MessageCircle,
  MapPin,
  Ban,
  Smartphone,
  Check,
  X,
  ArrowLeft,
  Globe,
  Apple,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ANDROID_APK = '/downloads/TauTalk-1.0.0-beta.apk';
const APK_SIZE = '~77 MB';

const comparisons = [
  { feature: 'End-to-end encrypted messages', tautalk: true, whatsapp: true, telegram: 'optional', signal: true },
  { feature: 'No phone number required', tautalk: true, whatsapp: false, telegram: 'optional', signal: true },
  { feature: 'Register with Gmail / any email', tautalk: true, whatsapp: false, telegram: true, signal: false },
  { feature: 'No ads or data mining', tautalk: true, whatsapp: false, telegram: true, signal: true },
  { feature: 'All telemetry blocked in app', tautalk: true, whatsapp: false, telegram: false, signal: true },
  { feature: 'OpenStreetMap (no Google tracking)', tautalk: true, whatsapp: false, telegram: false, signal: false },
  { feature: 'Part of privacy-first Tau ecosystem', tautalk: true, whatsapp: false, telegram: false, signal: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-5 h-5 text-primary mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-red-400/70 mx-auto" />;
  return <span className="text-xs text-muted-foreground">{value}</span>;
}

export default function TauTalkMarketing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.08),transparent_60%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to TAU CORE
          </Link>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />
                Public Beta · Android
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                TauTalk
                <span className="block text-2xl md:text-3xl text-primary mt-2 font-semibold">
                  Message without being the product
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
                Encrypted messaging built for the Tau ecosystem. Register with Gmail or any email.
                No telemetry. No Google Maps. Your conversations stay yours.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground font-bold shadow-[0_0_20px_rgba(255,215,0,0.25)]"
                >
                  <a href={ANDROID_APK} download>
                    <Download className="w-5 h-5 mr-2" />
                    Download for Android
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/40">
                  <Link href="/tautalk/chat">
                    <Globe className="w-5 h-5 mr-2" />
                    Use in browser
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20">
                  <a href="#compare">See how we compare</a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 justify-center lg:justify-start">
                <span>APK {APK_SIZE}</span>
                <span className="hidden sm:inline">·</span>
                <span className="inline-flex items-center gap-1">
                  <Apple className="w-3 h-3" />
                  iPhone & iPad — use browser chat until native iOS ships
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="shrink-0"
            >
              <Image
                src="/brand/tautalk-icon.png"
                alt="TauTalk app icon"
                width={200}
                height={200}
                className="rounded-[2.5rem] ring-4 ring-primary/30 shadow-2xl shadow-primary/10"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What & Why */}
      <section className="py-20 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">What is TauTalk?</h2>
              <p className="text-muted-foreground leading-relaxed">
                TauTalk is the encrypted messenger for TAU CORE — direct chats tied to your @username
                and Tau ID. Messages are encrypted on your device before they leave your phone. The
                server only stores ciphertext it cannot read.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Why it exists</h2>
              <p className="text-muted-foreground leading-relaxed">
                WhatsApp is owned by Meta. Telegram defaults are not E2E by default. Signal is excellent
                but siloed. TauTalk is part of a privacy-first OS ecosystem — mail, cloud, browser, and
                talk — with one identity and zero ad business model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Built for real privacy</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Lock, title: 'E2E encryption', desc: 'ECDH key agreement · encrypted payloads on device' },
              { icon: Ban, title: 'Telemetry blocked', desc: 'No analytics SDKs · no behavioral tracking in the app' },
              { icon: MessageCircle, title: 'Rich messages', desc: 'Photos, documents, and location sharing' },
              { icon: MapPin, title: 'OpenStreetMap', desc: 'Shared locations open in OSM — not Google Maps' },
              { icon: Shield, title: 'Email OTP signup', desc: 'Verify Gmail, Outlook, or any email you own' },
              { icon: Smartphone, title: 'Tau ID identity', desc: '@username across Tau Mail, Cloud, and Talk' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm"
              >
                <f.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="py-20 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">How TauTalk compares</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            We are not trying to clone WhatsApp. We are building the messenger privacy-conscious users
            deserve inside an OS that respects them.
          </p>
          <div className="overflow-x-auto max-w-4xl mx-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold text-primary">TauTalk</th>
                  <th className="p-4 font-semibold text-muted-foreground">WhatsApp</th>
                  <th className="p-4 font-semibold text-muted-foreground">Telegram</th>
                  <th className="p-4 font-semibold text-muted-foreground">Signal</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.feature} className="border-b border-white/5">
                    <td className="p-4 text-muted-foreground">{row.feature}</td>
                    <td className="p-4 bg-primary/5"><Cell value={row.tautalk} /></td>
                    <td className="p-4"><Cell value={row.whatsapp} /></td>
                    <td className="p-4"><Cell value={row.telegram} /></td>
                    <td className="p-4"><Cell value={row.signal} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="py-24">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Download TauTalk</h2>
          <p className="text-muted-foreground mb-10">
            Install the Android APK, create your account with email verification, and start encrypted
            chats with family and friends in the public beta.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl border border-primary/40 bg-primary/5">
              <Smartphone className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Android</h3>
              <p className="text-sm text-muted-foreground mb-6">Available now · Public Beta</p>
              <Button asChild className="w-full bg-primary text-primary-foreground font-bold">
                <a href={ANDROID_APK} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download APK
                </a>
              </Button>
            </div>
            <div className="p-8 rounded-2xl border border-white/10 bg-card/30 opacity-80">
              <Smartphone className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">iOS</h3>
              <p className="text-sm text-muted-foreground mb-6">TestFlight & App Store — next sprint</p>
              <Button disabled className="w-full" variant="outline">
                Coming soon
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-8">
            Web chat for desktop beta:{' '}
            <Link href="/tautalk/chat" className="text-primary hover:underline">
              talk in browser
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
