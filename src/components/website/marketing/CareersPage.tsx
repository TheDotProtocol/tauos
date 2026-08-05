'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import CompanyNav from '@/components/website/marketing/shared/CompanyNav';
import CompanyFooter from '@/components/website/marketing/shared/CompanyFooter';
import SectionLabel from '@/components/website/marketing/shared/SectionLabel';
import { inter, instrumentSerif } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import { websiteRoutes } from '@/lib/website/routes';

const culture = [
  { icon: marketingAssets.careers.lock, title: 'Privacy as a Right', body: "We believe privacy isn't a premium feature. It is a fundamental blueprint in every line of code we write." },
  { icon: marketingAssets.careers.ruler, title: 'Craftsmanship Over Speed', body: 'We build systems meant to survive decades. We favor thorough testing and formal verification over hasty hotfixes.' },
  { icon: marketingAssets.careers.users, title: 'People Over Profit', body: "Our team's health, autonomy, and families come first. Sustainable, self-directed work always yields the best engineering." },
] as const;

const roles = [
  { title: 'Senior Rust Engineer', team: 'Core Team' },
  { title: 'Product Designer', team: 'Design' },
  { title: 'iOS Engineer', team: 'Mobile' },
  { title: 'Security Researcher', team: 'Security' },
  { title: 'Developer Advocate', team: 'Community' },
  { title: 'Infrastructure Engineer', team: 'Cloud' },
] as const;

const perks = [
  { icon: marketingAssets.careers.network, title: 'Remote-First', body: 'Work from wherever you are happiest. We support asynchronous collaboration.' },
  { icon: marketingAssets.careers.trendingUp, title: 'Competitive Equity', body: 'Generous equity packages so we all share in the long-term value we build.' },
  { icon: marketingAssets.careers.activity, title: 'Health & Wellness', body: 'Premium healthcare coverage, mental health resources, and a fitness stipend.' },
  { icon: marketingAssets.careers.bookOpen, title: 'Learning Budget', body: 'Annual stipend for books, conferences, courses, and professional growth.' },
] as const;

export default function CareersPage() {
  return (
    <ProductPageLayout>
      <CompanyNav active="careers" />

      <section className={`${inter.className} px-6 py-24 md:px-20`}>
        <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionLabel>Join Us</SectionLabel>
            <h1 className={`${instrumentSerif.className} mt-6 text-5xl font-extrabold leading-tight md:text-6xl`}>Careers</h1>
            <p className="mt-6 text-[22px] leading-relaxed text-[#a0a0a0]">
              Build technology that matters. Join a distributed team engineering robust, sovereign digital foundations.
            </p>
            <a href="#roles" className="mt-8 inline-block rounded bg-[#d4af37] px-7 py-4 text-base font-semibold text-[#0f0f0f]">
              Explore Roles
            </a>
          </div>
          <div className="relative h-[380px] overflow-hidden rounded-xl border border-[#2a2820]">
            <Image src={marketingAssets.careers.hero} alt="" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className={`${inter.className} border-y border-[#2a2820] bg-[#181818] px-6 py-24 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>Culture</SectionLabel>
          <h2 className={`${instrumentSerif.className} mt-4 text-4xl font-bold`}>What drives us</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {culture.map(({ icon, title, body }) => (
              <div key={title} className="rounded-lg border border-[#2a2820] bg-[#0f0f0f] p-8">
                <span className="flex size-12 items-center justify-center rounded-full bg-[rgba(212,175,55,0.12)]">
                  <Image src={icon} alt="" width={24} height={24} />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#a0a0a0]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className={`${inter.className} px-6 py-24 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>Open Roles</SectionLabel>
          <h2 className={`${instrumentSerif.className} mt-4 text-4xl font-bold`}>Join the mission</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <div key={role.title} className="flex items-center justify-between rounded-lg border border-[#2a2820] bg-[#181818] p-8">
                <div>
                  <h3 className="text-lg font-semibold">{role.title}</h3>
                  <p className="mt-2 text-sm text-[#a0a0a0]">
                    {role.team} <span className="mx-2 text-[#666]">·</span> <span className="text-[#d4af37]">Remote</span>
                  </p>
                </div>
                <Link href={websiteRoutes.contact} className="flex items-center gap-2 text-[15px] font-semibold text-[#d4af37]">
                  Apply <Image src={marketingAssets.careers.arrowRight} alt="" width={16} height={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${inter.className} border-t border-[#2a2820] bg-[#181818] px-6 py-24 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>Perks & Benefits</SectionLabel>
          <h2 className={`${instrumentSerif.className} mt-4 text-4xl font-bold`}>How we take care of you</h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {perks.map(({ icon, title, body }) => (
              <div key={title} className="rounded-lg border border-[#2a2820] bg-[#0f0f0f] p-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.12)]">
                  <Image src={icon} alt="" width={20} height={20} />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a0a0a0]">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href="#roles" className="inline-block rounded bg-[#d4af37] px-10 py-4 text-base font-semibold text-[#0f0f0f]">
              See All Openings
            </a>
          </div>
        </div>
      </section>

      <CompanyFooter />
    </ProductPageLayout>
  );
}
