'use client';

import Image from 'next/image';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import HardwareNav from '@/components/website/marketing/shared/HardwareNav';
import HardwareFooter from '@/components/website/marketing/shared/HardwareFooter';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';

type ProductCard = {
  name: string;
  subtitle: string;
  image: string;
  price?: string;
  coming?: boolean;
  cta: string;
  ctaStyle: 'filled' | 'outline';
};

const products: ProductCard[] = [
  { name: 'Tau Phone', subtitle: 'Hardened communication', image: marketingAssets.store.productPhone, price: '$699', cta: 'Shop', ctaStyle: 'filled' },
  { name: 'Tau Book Pro', subtitle: 'Silent creative powerhouse', image: marketingAssets.store.productBook, price: '$1,299', cta: 'Configure', ctaStyle: 'filled' },
  { name: 'Tau Tablet', subtitle: 'Online and offline freedom', image: marketingAssets.store.productTablet, coming: true, cta: 'Notify Me', ctaStyle: 'outline' },
  { name: 'Tau Watch', subtitle: 'Sovereign wrist companion', image: marketingAssets.store.productWatch, coming: true, cta: 'Notify Me', ctaStyle: 'outline' },
  { name: 'Tau Glass', subtitle: 'The hardware AR paradigm', image: marketingAssets.store.productGlass, coming: true, cta: 'Notify Me', ctaStyle: 'outline' },
  { name: 'Accessories Suite', subtitle: 'Cases, charging blocks, pens', image: marketingAssets.store.accessoriesHero, price: 'From $39', cta: 'Browse', ctaStyle: 'filled' },
];

const accessories = [
  { name: 'Alcantara Phone Shell', price: '$59', image: marketingAssets.store.accessory1 },
  { name: 'Sovereign Gold Charger', price: '$79', image: marketingAssets.store.accessory2 },
  { name: 'Braided Gold-Tip Cable', price: '$39', image: marketingAssets.store.accessory3 },
  { name: 'Sovereign Digital Stylus', price: '$129', image: marketingAssets.store.accessory4 },
] as const;

const trustBadges = [
  { title: 'Complimentary Delivery', body: 'Expedited shipping on all hardware systems.' },
  { title: '30-Day Evaluation', body: 'Return for a complete refund if it does not fit your security profile.' },
  { title: '2-Year System Warranty', body: 'Hardware components guaranteed against dynamic wear.' },
] as const;

function ProductCardBlock({ product }: { product: ProductCard }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#262628] bg-[#161616]">
      <div className="relative h-[220px] bg-[#0f0f0f]">
        <Image src={product.image} alt="" fill className="object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="mt-1 text-xs text-[#a4a4a6]">{product.subtitle}</p>
          </div>
          {product.coming ? (
            <span className="rounded border border-[#d4af37] bg-[rgba(212,175,55,0.2)] px-2 py-1 text-[10px] font-bold uppercase text-[#d4af37]">
              Coming
            </span>
          ) : (
            <p className="text-lg font-bold text-[#d4af37]">{product.price}</p>
          )}
        </div>
        <button
          type="button"
          className={`mt-5 flex h-11 w-full items-center justify-center rounded text-xs font-bold uppercase ${
            product.ctaStyle === 'filled'
              ? 'bg-[#d4af37] text-[#0f0f0f]'
              : 'border border-[#d4af37] text-[#d4af37]'
          }`}
        >
          {product.cta}
        </button>
      </div>
    </div>
  );
}

export default function TauStoreMarketingPage() {
  return (
    <ProductPageLayout>
      <HardwareNav active="store" />

      <section className={`${inter.className} px-6 pb-16 pt-24 md:px-20`}>
        <p className="text-xs font-bold uppercase text-[#d4af37]">Shop</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight md:text-6xl">Tau Store</h1>
        <p className="mt-6 text-xl text-[#a4a4a6]">
          Everything Tau. Engineered for sovereign performance. One place.
        </p>
      </section>

      <section className={`${inter.className} px-6 pb-20 md:px-20`}>
        <div className="mx-auto grid max-w-[1280px] gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCardBlock key={product.name} product={product} />
          ))}
        </div>
      </section>

      <section className={`${inter.className} px-6 pb-20 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold">Essentials & Accessories</h2>
            <button type="button" className="text-sm font-semibold uppercase text-[#d4af37]">View All</button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {accessories.map((a) => (
              <div key={a.name} className="flex items-center gap-4 rounded-lg border border-[#262628] bg-[#161616] p-4">
                <div className="relative size-[72px] shrink-0 overflow-hidden rounded bg-[#0f0f0f]">
                  <Image src={a.image} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold">{a.name}</p>
                  <p className="text-[13px] font-semibold text-[#d4af37]">{a.price}</p>
                </div>
                <button type="button" className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#1e1e20]">
                  <Image src={marketingAssets.store.plus} alt="" width={14} height={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${inter.className} border-y border-[#262628] bg-[#161616] px-6 py-16 md:px-20`}>
        <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-3">
          {trustBadges.map((badge) => (
            <div key={badge.title}>
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-xl bg-[#d4af37]">
                  <Image src={marketingAssets.store.shieldCheck} alt="" width={14} height={14} />
                </span>
                <h3 className="text-[15px] font-bold">{badge.title}</h3>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#a4a4a6]">{badge.body}</p>
            </div>
          ))}
        </div>
      </section>

      <HardwareFooter />
    </ProductPageLayout>
  );
}
