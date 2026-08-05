'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import JourneyNav from '@/components/website/marketing/shared/JourneyNav';
import JourneyFooter from '@/components/website/marketing/shared/JourneyFooter';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

const benefits = [
  { icon: marketingAssets.startup.database, title: '$100K Cloud Credits', body: 'Scale seamlessly with credit allocation across sovereign Tau Cloud resources.' },
  { icon: marketingAssets.startup.microchip, title: 'Priority API Access', body: 'Direct pathways to high-performance model inferences with guaranteed low latencies.' },
  { icon: marketingAssets.startup.target, title: 'Co-Marketing', body: 'Amplify your launching momentum with targeted distributions to the global Tau ecosystem.' },
  { icon: marketingAssets.startup.shieldCheck, title: 'Technical Mentorship', body: 'Direct operational consulting and code reviews with the core systems architects.' },
] as const;

const eligibility = [
  'Formed less than 3 years ago',
  'Under $5 million in total funding',
  'Building open-source, web3, or sovereign developer tools',
  'Committed to data-ownership and zero-trust protocol defaults',
] as const;

const stories = [
  {
    quote: "Tau's credits allowed us to test and validate our consensus layer without worrying about early infrastructure overhead. The developer community was incredibly welcoming.",
    name: 'Devon Vance',
    role: 'CTO, Arcline Protocol',
    avatar: marketingAssets.startup.founderDevon,
  },
  {
    quote: 'Priority access to Tau OS system integrations completely unblocked our hardware deployment timeline. Highly recommend every deep-tech founder to apply.',
    name: 'Alina Sterling',
    role: 'CEO, Gridspace AI',
    avatar: marketingAssets.startup.founderAlina,
  },
] as const;

export default function TauStartupPage() {
  return (
    <ProductPageLayout>
      <JourneyNav active="startup" />

      <section className={`${inter.className} px-6 py-20 md:px-20`}>
        <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-[#d4af37]">Launch</p>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">Tau Startup Program</h1>
            <p className="mt-6 text-lg leading-relaxed text-[#8e8e93]">
              Everything founders need to build, scale, and secure sovereign software. Gain access to cloud infrastructure, priority developer channels, and specialized hardware.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button type="button" className="rounded bg-[#d4af37] px-8 py-3.5 text-sm font-bold text-[#0f0f0f]">Apply Now</button>
              <Link href={websiteRoutes.docs} className="rounded border border-[#2a2a2a] px-8 py-3.5 text-sm font-semibold transition hover:border-[#d4af37]">
                View Documentation
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-2xl border border-[#2a2a2a]">
            <Image src={marketingAssets.startup.hero} alt="" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className={`${inter.className} px-6 pb-20 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-2xl font-extrabold">Program Benefits</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map(({ icon, title, body }) => (
              <div key={title} className="rounded-lg border border-[#2a2a2a] bg-[#171717] p-7">
                <span className="flex size-11 items-center justify-center rounded-lg bg-[#222]">
                  <Image src={icon} alt="" width={20} height={20} />
                </span>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8e8e93]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${inter.className} px-6 pb-24 md:px-20`}>
        <div className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-[22px] font-extrabold">Program Eligibility</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#8e8e93]">
              The Tau Startup Program is built exclusively for early-stage companies and founders shipping technical infrastructure products.
            </p>
            <ul className="mt-8 space-y-4">
              {eligibility.map((item) => (
                <li key={item} className="flex gap-3 text-[15px]">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[rgba(212,175,55,0.2)]">
                    <Image src={marketingAssets.startup.check} alt="" width={10} height={10} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[#2a2a2a] bg-[#171717] p-10">
            <h3 className="text-lg font-bold">Application Preview</h3>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Company Name', placeholder: 'e.g., Acme Corp' },
                { label: 'Founder Email', placeholder: 'e.g., founder@acme.com' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs text-[#8e8e93]">{field.label}</label>
                  <input placeholder={field.placeholder} className="mt-2 h-10 w-full rounded border border-[#2a2a2a] bg-[#0f0f0f] px-4 text-[13px] outline-none focus:border-[#d4af37]" />
                </div>
              ))}
              <div>
                <label className="text-xs text-[#8e8e93]">What are you building?</label>
                <textarea rows={3} placeholder="Briefly describe your stack and sovereign vision..." className="mt-2 w-full rounded border border-[#2a2a2a] bg-[#0f0f0f] p-4 text-[13px] outline-none focus:border-[#d4af37]" />
              </div>
            </div>
            <button type="button" className="mt-6 h-11 w-full rounded bg-[#d4af37] text-[13px] font-bold text-[#0f0f0f]">
              Submit Application
            </button>
          </div>
        </div>
      </section>

      <section className={`${inter.className} px-6 pb-28 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-[22px] font-extrabold">Founder Stories</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {stories.map((s) => (
              <div key={s.name} className="rounded-xl border border-[#2a2a2a] bg-[#171717] p-8">
                <p className="text-base leading-relaxed text-[#8e8e93]">&ldquo;{s.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Image src={s.avatar} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold">{s.name}</p>
                    <p className="text-xs text-[#d4af37]">{s.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JourneyFooter />
    </ProductPageLayout>
  );
}
