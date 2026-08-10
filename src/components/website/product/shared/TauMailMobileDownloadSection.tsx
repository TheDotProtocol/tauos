'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Apple, Download, Globe, Smartphone } from 'lucide-react';
import { inter } from '@/lib/website/fonts';
import { tauMailMobileDownloads } from '@/lib/taumail-mobile-downloads';

type TauMailMobileDownloadSectionProps = {
  variant?: 'hero' | 'section';
  id?: string;
};

function PlatformBadge({ text, active }: { text: string; active?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
        active ? 'bg-[#3a3114] text-[#d4af37]' : 'bg-[#222] text-[#888]'
      }`}
    >
      {text}
    </span>
  );
}

function DownloadButton({
  href,
  download,
  label,
  icon: Icon,
}: {
  href: string;
  download?: string;
  label: string;
  icon: typeof Download;
}) {
  return (
    <a
      href={href}
      download={download}
      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4af37] py-3.5 text-sm font-bold text-[#0f0f0f] hover:bg-[#e0bc4a]"
    >
      <Icon className="size-4" />
      {label}
    </a>
  );
}

export default function TauMailMobileDownloadSection({
  variant = 'section',
  id = 'mobile-apps',
}: TauMailMobileDownloadSectionProps) {
  const { android, ios, webmailUrl } = tauMailMobileDownloads;

  if (variant === 'hero') {
    return (
      <div className={`${inter.className} mt-8 flex flex-wrap items-center justify-center gap-3`}>
        {android.available && (
          <a
            href={android.url}
            download={android.filename}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3 text-[14px] font-bold text-[#0f0f0f] hover:bg-[#e0bc4a]"
          >
            <Download className="size-4" />
            {android.buttonLabel}
          </a>
        )}
        {ios.available && (
          <a
            href={ios.url}
            download={ios.filename}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37]/50 bg-[#161616] px-6 py-3 text-[14px] font-semibold text-[#d4af37] hover:bg-[#3a3114]"
          >
            <Apple className="size-4" />
            {ios.buttonLabel}
          </a>
        )}
        <Link
          href={webmailUrl}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2a2820] bg-[#161616] px-6 py-3 text-[14px] font-semibold text-white hover:border-[#d4af37] hover:text-[#d4af37]"
        >
          <Globe className="size-4" />
          Webmail
        </Link>
      </div>
    );
  }

  return (
    <section id={id} className={`${inter.className} border-y border-[#2a2820] bg-[#0f0f0f] px-6 py-24 md:px-20`}>
      <div className="mx-auto max-w-[960px] text-center">
        <p className="text-xs font-bold uppercase text-[#d4af37]">Mobile Apps</p>
        <h2 className="mt-4 font-[family-name:var(--font-instrument-serif)] text-4xl md:text-5xl">
          Tau Mail on your phone
        </h2>
        <p className="mx-auto mt-4 max-w-[640px] text-lg leading-relaxed text-[#a0a0a0]">
          Native Android and iOS apps with push notifications, encrypted inbox sync, calendar, contacts,
          and the same @taumail.org identity as webmail.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-[960px] gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[#d4af37]/40 bg-[#161616] p-8 text-center shadow-[0_12px_24px_rgba(212,175,55,0.06)]">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#3a3114]">
            <Smartphone className="size-8 text-[#d4af37]" />
          </div>
          <PlatformBadge text={android.badge} active={android.available} />
          <h3 className="mt-4 text-2xl font-bold">{android.shortLabel}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#a0a0a0]">{android.description}</p>
          <p className="mt-2 text-xs text-[#666]">
            {android.packageName} · {android.sizeLabel}
          </p>
          {android.available && (
            <DownloadButton
              href={android.url}
              download={android.filename}
              label={android.buttonLabel}
              icon={Download}
            />
          )}
        </div>

        <div className="rounded-xl border border-[#d4af37]/40 bg-[#161616] p-8 text-center shadow-[0_12px_24px_rgba(212,175,55,0.06)]">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#3a3114]">
            <Apple className="size-8 text-[#d4af37]" />
          </div>
          <PlatformBadge text={ios.badge} active={ios.available} />
          <h3 className="mt-4 text-2xl font-bold">{ios.shortLabel}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#a0a0a0]">{ios.description}</p>
          <p className="mt-2 text-xs text-[#666]">
            {ios.bundleId} · {ios.sizeLabel}
          </p>
          {ios.available && (
            <DownloadButton href={ios.url} download={ios.filename} label={ios.buttonLabel} icon={Apple} />
          )}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[960px] flex-col items-center gap-4 rounded-xl border border-[#2a2820] bg-[#161616] p-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4 text-left">
          <Image
            src="/website/logos/tau-mail/logo-primary.png"
            alt=""
            width={48}
            height={48}
            className="rounded-lg"
          />
          <div>
            <p className="font-bold">Prefer the browser?</p>
            <p className="text-sm text-[#a0a0a0]">Full Tau Mail webmail at taumail.org — same login, no install.</p>
          </div>
        </div>
        <Link
          href={webmailUrl}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#2a2820] px-5 py-2.5 text-sm font-semibold hover:border-[#d4af37] hover:text-[#d4af37]"
        >
          <Globe className="size-4" />
          Webmail
        </Link>
      </div>
    </section>
  );
}
