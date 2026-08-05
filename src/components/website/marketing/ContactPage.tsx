'use client';

import Image from 'next/image';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import CompanyNav from '@/components/website/marketing/shared/CompanyNav';
import CompanyFooter from '@/components/website/marketing/shared/CompanyFooter';
import SectionLabel from '@/components/website/marketing/shared/SectionLabel';
import { inter, instrumentSerif } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';

const channels = [
  { title: 'General Inquiries', body: 'Partner questions, association membership, and general info.', email: 'hello@tauos.org' },
  { title: 'Technical Support', body: 'Kernel developer support, node running, and technical help.', email: 'support@tauos.org' },
  { title: 'Media & Press', body: 'Interview requests, brand guidelines, and media packets.', email: 'press@tauos.org' },
] as const;

const socials = [
  { label: 'Twitter', icon: marketingAssets.contact.twitter },
  { label: 'GitHub', icon: marketingAssets.contact.github },
  { label: 'Discord', icon: marketingAssets.shared.messageSquare },
  { label: 'LinkedIn', icon: marketingAssets.contact.linkedin },
] as const;

export default function ContactPage() {
  return (
    <ProductPageLayout>
      <CompanyNav active="contact" />

      <section className={`${inter.className} px-6 pb-16 pt-28 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>Connect</SectionLabel>
          <h1 className={`${instrumentSerif.className} mt-6 text-5xl font-extrabold md:text-6xl`}>Contact</h1>
          <p className="mt-6 max-w-2xl text-[22px] leading-relaxed text-[#a0a0a0]">
            We would love to hear from you. Reach out with questions, collaboration ideas, or research inquiries.
          </p>
        </div>
      </section>

      <section className={`${inter.className} px-6 pb-24 md:px-20`}>
        <div className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[640px_1fr]">
          <div className="rounded-xl border border-[#2a2820] bg-[#181818] p-12">
            <h2 className="text-2xl font-bold">Send a message</h2>
            <form className="mt-8 space-y-5">
              {[
                { label: 'NAME', placeholder: 'Enter your full name' },
                { label: 'EMAIL ADDRESS', placeholder: 'you@example.com' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-[13px] font-semibold text-[#a0a0a0]">{field.label}</label>
                  <input placeholder={field.placeholder} className="mt-2 h-12 w-full rounded bg-[#222] px-3.5 text-[15px] outline-none focus:ring-1 focus:ring-[#d4af37]" />
                </div>
              ))}
              <div>
                <label className="text-[13px] font-semibold text-[#a0a0a0]">SUBJECT</label>
                <div className="mt-2 flex h-12 items-center justify-between rounded bg-[#222] px-3.5">
                  <span className="text-[15px]">Select an inquiry topic</span>
                  <Image src={marketingAssets.contact.chevronDown} alt="" width={16} height={16} />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#a0a0a0]">MESSAGE</label>
                <textarea rows={5} placeholder="Write your message here..." className="mt-2 w-full rounded bg-[#222] p-3.5 text-[15px] outline-none focus:ring-1 focus:ring-[#d4af37]" />
              </div>
              <button type="submit" className="h-[52px] w-full rounded bg-[#d4af37] text-base font-semibold text-[#0f0f0f]">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-14">
            <div>
              <SectionLabel>Location</SectionLabel>
              <h2 className={`${instrumentSerif.className} mt-6 text-[32px] font-bold`}>Global. Remote-First.</h2>
              <p className="mt-4 text-base leading-relaxed text-[#a0a0a0]">
                Tau acts as a global association of sovereign teams. Our operations are fully decentralized across five continents, ensuring resilient infrastructure.
              </p>
              <div className="relative mt-6 h-[260px] overflow-hidden rounded-lg border border-[#2a2820]">
                <Image src={marketingAssets.contact.globeMap} alt="" fill className="object-cover" />
              </div>
            </div>
            <div>
              <SectionLabel>Social Networks</SectionLabel>
              <div className="mt-6 flex flex-wrap gap-4">
                {socials.map(({ label, icon }) => (
                  <button key={label} type="button" className="flex items-center gap-2.5 rounded border border-[#2a2820] bg-[#181818] px-5 py-3 text-sm font-medium">
                    <Image src={icon} alt="" width={16} height={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${inter.className} border-t border-[#2a2820] bg-[#181818] px-6 py-24 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <SectionLabel>Channels</SectionLabel>
          <h2 className={`${instrumentSerif.className} mt-4 text-4xl font-bold`}>Direct contact</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {channels.map((c) => (
              <div key={c.title} className="rounded-lg border border-[#2a2820] bg-[#0f0f0f] p-8">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a0a0a0]">{c.body}</p>
                <a href={`mailto:${c.email}`} className="mt-4 block text-base font-semibold text-[#d4af37]">{c.email}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CompanyFooter />
    </ProductPageLayout>
  );
}
