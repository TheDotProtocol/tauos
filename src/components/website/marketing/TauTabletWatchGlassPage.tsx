'use client';

import Image from 'next/image';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import HardwareNav from '@/components/website/marketing/shared/HardwareNav';
import HardwareFooter from '@/components/website/marketing/shared/HardwareFooter';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';

const devices = [
  {
    badge: 'Coming 2027',
    title: 'Tau Tablet',
    tagline: 'Create without boundaries.',
    description: 'A high-precision 12.9" ProMotion OLED display paired with state-of-the-art pen digitization. Supports completely offline local-rendered graphic creation and desktop productivity suites with no subscription models required.',
    image: marketingAssets.hardware.tabletRender,
    imageSide: 'right' as const,
    specs: [
      { label: 'Screen', value: '12.9" ProMotion OLED' },
      { label: 'Stylus', value: 'Ultra-Low Latency Pen' },
      { label: 'Ecosystem', value: 'Hardened Pro Apps' },
    ],
  },
  {
    badge: 'Coming 2027',
    title: 'Tau Watch',
    tagline: 'Health. Privacy. Your wrist.',
    description: 'All health metrics, sleep analyses, and diagnostic ECG readings are computed exclusively on-device. No upload, no cloud, no leaks. Encrypted end-to-end to physical keys on your Tau Phone.',
    image: marketingAssets.hardware.watchRender,
    imageSide: 'left' as const,
    specs: [
      { label: 'Health Engine', value: '100% On-device ECG' },
      { label: 'Battery Life', value: '5-Day Continuous' },
      { label: 'Security Link', value: 'Hardware Key Sync' },
    ],
  },
  {
    badge: 'Coming 2027',
    title: 'Tau Glass',
    tagline: 'See more. Share less.',
    description: "Ultra-light titanium augmented glasses that layer contextual data without filming the public. Equipped with a physical shutter block for the front camera array, guaranteeing others that they aren't being recorded.",
    image: marketingAssets.hardware.glassRender,
    imageSide: 'right' as const,
    specs: [
      { label: 'Frame', value: 'Aerospace Titanium' },
      { label: 'Assistance', value: 'Offline AI Copilot' },
      { label: 'Protection', value: 'Physical Cam Block' },
    ],
  },
] as const;

export default function TauTabletWatchGlassPage() {
  return (
    <ProductPageLayout>
      <HardwareNav active="future" />

      <section className={`${inter.className} px-6 pb-16 pt-24 md:px-20`}>
        <p className="text-xs font-bold uppercase text-[#d4af37]">Committed Roadmap</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight md:text-6xl">Sovereign Ecosystem</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#a4a4a6]">
          Expanding the boundaries of local-first secure devices. Engineering prototypes in final validation trials. Scheduled release 2027.
        </p>
      </section>

      <section className={`${inter.className} space-y-32 px-6 pb-28 md:px-20`}>
        {devices.map((device) => (
          <div
            key={device.title}
            className={`mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-2 ${device.imageSide === 'left' ? 'lg:[&>*:first-child]:order-2' : ''}`}
          >
            <div className="relative h-[360px] overflow-hidden rounded-2xl border border-[#262628] bg-[#161616] lg:h-[440px]">
              <Image src={device.image} alt="" fill className="object-cover" />
            </div>
            <div>
              <span className="rounded border border-[#d4af37] bg-[rgba(212,175,55,0.2)] px-3 py-1.5 text-[10px] font-bold uppercase text-[#d4af37]">
                {device.badge}
              </span>
              <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">{device.title}</h2>
              <p className="mt-3 text-xl font-medium text-[#a4a4a6]">{device.tagline}</p>
              <p className="mt-4 text-base leading-relaxed text-[#a4a4a6]">{device.description}</p>
              <div className="mt-8 flex flex-wrap gap-8">
                {device.specs.map((s) => (
                  <div key={s.label}>
                    <p className="text-[11px] font-bold uppercase text-[#d4af37]">{s.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <HardwareFooter />
    </ProductPageLayout>
  );
}
