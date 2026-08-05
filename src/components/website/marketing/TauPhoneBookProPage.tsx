'use client';

import Image from 'next/image';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import HardwareNav from '@/components/website/marketing/shared/HardwareNav';
import HardwareFooter from '@/components/website/marketing/shared/HardwareFooter';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';

type ProductSection = {
  badge: string;
  title: string;
  tagline: string;
  description: string;
  price: string;
  primaryCta: string;
  imageSide: 'left' | 'right';
  image: string;
  specs: { label: string; value: string }[];
  features: { title: string; body: string }[];
};

const phone: ProductSection = {
  badge: 'Hardware',
  title: 'Tau Phone',
  tagline: 'Privacy in your pocket.',
  description: 'Sovereign architecture from the silicon up. A pure, hardened communication device designed for those who demand ultimate data ownership. No cloud telemetry, no embedded trackers.',
  price: '$699',
  primaryCta: 'Pre-Order',
  imageSide: 'right',
  image: marketingAssets.hardware.phoneRender,
  specs: [
    { label: 'Display', value: '6.4" OLED 120Hz' },
    { label: 'Processor', value: 'Snapdragon 8 Gen 4' },
    { label: 'Memory', value: '8GB LPDDR5X' },
    { label: 'Storage', value: '256GB / 512GB' },
    { label: 'Camera', value: '50MP F/1.4 Sovereign Prime' },
    { label: 'Battery', value: '5000mAh with Smart-Bypass' },
  ],
  features: [
    { title: 'Hardware Kill Switches', body: 'Physical, slide-actuated mechanical disconnects for the camera arrays and dual microphones. Absolute trust via physical isolation.' },
    { title: 'Titan M3 Sovereign Security Core', body: 'Independent isolated secure enclave that stores zero biometric data outside of physical sandboxed registers.' },
    { title: '7 Years Guaranteed Sovereign OS Updates', body: 'A pure open-source software stack engineered for longevity, zero-day mitigation, and completely on-device telemetry blocks.' },
  ],
};

const book: ProductSection = {
  badge: 'Creative Workstation',
  title: 'Tau Book Pro',
  tagline: 'Your creative canvas.',
  description: 'An uncompromising fanless notebook crafted for developers, creators, and professionals who refuse cloud overreach. Absolute performance with completely silent operations.',
  price: '$1,299',
  primaryCta: 'Configure',
  imageSide: 'left',
  image: marketingAssets.hardware.laptopRender,
  specs: [
    { label: 'Display', value: '14.2" ProMotion HDR (1600 nits)' },
    { label: 'Processor', value: 'Sovereign M4 Pro Silicon equivalent' },
    { label: 'Unified Memory', value: '16GB - 64GB Extreme Channel' },
    { label: 'SSD Storage', value: 'Up to 2TB Sovereign Flash' },
    { label: 'Battery Life', value: 'Up to 22 hours active offline work' },
    { label: 'I/O Ports', value: 'Thunderbolt 5, HDMI, Card Reader' },
  ],
  features: [
    { title: 'Tau Desktop OS Pre-Installed', body: 'Hardened Unix derivative optimized specifically for the custom silicon. Zero analytics backdoors, built-in virtualization containers.' },
    { title: 'Monolithic Fanless Thermal Chassis', body: 'Crafted out of custom heavy recycled titanium alloys allowing full performance profiles under load without high temperatures or noise.' },
    { title: 'Thunderbolt 5 Secure Direct I/O', body: 'Optically isolated ports preventing DMA hardware exploit vectors. Absolute protection when plugging in external storage arrays.' },
  ],
};

function ProductBlock({ product, showLogo }: { product: ProductSection; showLogo?: boolean }) {
  const textCol = (
    <div className="flex flex-col gap-6 lg:max-w-lg">
      {showLogo && (
        <Image src={marketingAssets.hardware.devicesLogo} alt="" width={64} height={64} className="rounded-xl object-contain" />
      )}
      <p className="text-xs font-bold uppercase text-[#d4af37]">{product.badge}</p>
      <h2 className="text-5xl font-extrabold tracking-tight md:text-6xl">{product.title}</h2>
      <p className="text-2xl font-medium text-[#a4a4a6]">{product.tagline}</p>
      <p className="text-base leading-relaxed text-[#a4a4a6]">{product.description}</p>
      <p className="text-sm text-[#a4a4a6]">
        Starting at <span className="text-[28px] font-bold text-[#d4af37]">{product.price}</span>
      </p>
      <div className="flex flex-wrap gap-4">
        <button type="button" className="rounded border border-[#e5c05b] bg-[#d4af37] px-7 py-3.5 text-sm font-bold uppercase text-[#0f0f0f]">
          {product.primaryCta}
        </button>
        <button type="button" className="rounded border-[1.5px] border-[#d4af37] px-7 py-3.5 text-sm font-bold uppercase text-[#d4af37]">
          Learn More
        </button>
      </div>
    </div>
  );

  const imageCol = (
    <div className="relative h-[400px] overflow-hidden rounded-2xl border border-[#262628] bg-[#161616] lg:h-[500px]">
      <Image src={product.image} alt="" fill className="object-cover" />
    </div>
  );

  return (
    <div className="space-y-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {product.imageSide === 'left' ? (
          <>
            {imageCol}
            {textCol}
          </>
        ) : (
          <>
            {textCol}
            {imageCol}
          </>
        )}
      </div>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-bold">Technical Specifications</h3>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {product.specs.map((spec) => (
              <div key={spec.label} className="rounded-md border border-[#262628] bg-[#161616] p-4">
                <p className="text-[11px] font-bold uppercase text-[#d4af37]">{spec.label}</p>
                <p className="mt-1.5 text-[15px] font-semibold">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold">Sovereignty Features</h3>
          <div className="mt-6 space-y-4">
            {product.features.map((f) => (
              <div key={f.title} className="rounded-md rounded-tl-sm border border-[rgba(212,175,55,0.2)] bg-[#161616] p-5">
                <p className="text-sm font-bold">{f.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#a4a4a6]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TauPhoneBookProPage() {
  return (
    <ProductPageLayout>
      <HardwareNav active="hardware" />
      <div className={`${inter.className} px-6 py-20 md:px-20`}>
        <div className="mx-auto max-w-[1280px] space-y-24">
          <ProductBlock product={phone} showLogo />
          <div className="relative h-px w-full">
            <Image src={marketingAssets.hardware.divider} alt="" fill className="object-cover" />
          </div>
          <ProductBlock product={book} />
        </div>
      </div>
      <HardwareFooter />
    </ProductPageLayout>
  );
}
