'use client';

import Image from 'next/image';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import JourneyNav from '@/components/website/marketing/shared/JourneyNav';
import JourneyFooter from '@/components/website/marketing/shared/JourneyFooter';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';

const downloads = [
  { name: 'Tau Core', version: '1.2.0', platforms: ['macOS', 'Windows', 'Linux'], size: '48.2 MB', icon: marketingAssets.download.package },
  { name: 'Tau Browser', version: '0.9.1', platforms: ['macOS', 'Windows', 'Linux'], size: '82.1 MB', icon: marketingAssets.download.globe },
  { name: 'Tau Mail', version: '1.0.3', platforms: ['Web', 'Desktop', 'Mobile'], size: '35.4 MB', icon: marketingAssets.download.circleX },
  { name: 'Tau Cloud', version: '1.1.0', platforms: ['Web', 'Desktop', 'Mobile'], size: '14.5 MB', icon: marketingAssets.download.database },
  { name: 'Tau Talk', version: '0.8.2', platforms: ['Desktop', 'Mobile'], size: '55.0 MB', icon: marketingAssets.download.messageLock },
  { name: 'Tau Developer CLI', version: '2.0.1', platforms: ['npm', 'brew', 'cargo'], size: '8.9 MB', icon: marketingAssets.download.terminal },
] as const;

const matrix = [
  { product: 'Tau Core', mac: true, win: true, linux: true, version: '1.2.0', size: '48.2 MB' },
  { product: 'Tau Browser', mac: true, win: true, linux: true, version: '0.9.1', size: '82.1 MB' },
  { product: 'Tau Mail', mac: true, win: true, linux: true, version: '1.0.3', size: '35.4 MB' },
  { product: 'Tau Cloud', mac: true, win: true, linux: true, version: '1.1.0', size: '14.5 MB' },
  { product: 'Tau Talk', mac: true, win: true, linux: false, version: '0.8.2', size: '55.0 MB' },
  { product: 'Tau Developer CLI', mac: true, win: true, linux: true, version: '2.0.1', size: '8.9 MB' },
] as const;

function DownloadCard({ item }: { item: (typeof downloads)[number] }) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-[#2a2a2a] bg-[#171717] p-8">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{item.name}</h3>
          <p className="mt-1 text-[13px] text-[#8e8e93]">Version {item.version}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-md bg-[#222]">
          <Image src={item.icon} alt="" width={20} height={20} />
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.platforms.map((p) => (
          <span key={p} className="rounded bg-[#222] px-2 py-1 text-[11px] font-semibold text-[#8e8e93]">
            {p}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 text-[13px]">
        <span className="text-[#555]">Size: {item.size}</span>
        <button type="button" className="text-[#a68a2e] underline">Sys Requirements</button>
      </div>
      <button type="button" className="flex h-11 items-center justify-center gap-2 rounded bg-[#d4af37] text-[13px] font-bold text-[#0f0f0f]">
        <Image src={marketingAssets.download.download} alt="" width={16} height={16} />
        Download Installer
      </button>
    </div>
  );
}

export default function DownloadCenterPage() {
  return (
    <ProductPageLayout>
      <JourneyNav active="download" />

      <section className={`${inter.className} px-6 pb-16 pt-20 text-center md:px-20`}>
        <p className="text-xs font-bold uppercase text-[#d4af37]">Get Started</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight md:text-6xl">Download Center</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[#8e8e93]">Get Tau. Free. No strings attached.</p>
      </section>

      <section className={`${inter.className} px-6 pb-20 md:px-20`}>
        <div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-2 xl:grid-cols-3">
          {downloads.map((item) => (
            <DownloadCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className={`${inter.className} border-t border-[#2a2a2a] px-6 pb-24 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-2xl font-extrabold">Comprehensive Platform Matrix</h2>
          <div className="mt-8 overflow-x-auto rounded-lg border border-[#2a2a2a]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#171717] text-[11px] font-bold uppercase text-[#d4af37]">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-4 py-4 text-center">macOS</th>
                  <th className="px-4 py-4 text-center">Windows</th>
                  <th className="px-4 py-4 text-center">Linux</th>
                  <th className="px-4 py-4">Version</th>
                  <th className="px-6 py-4">File Size</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.product} className="border-b border-[#2a2a2a] last:border-0">
                    <td className="px-6 py-4 font-semibold">{row.product}</td>
                    {[row.mac, row.win, row.linux].map((supported, i) => (
                      <td key={i} className="px-4 py-4 text-center">
                        {supported ? (
                          <Image src={marketingAssets.download.check} alt="" width={16} height={16} className="mx-auto" />
                        ) : (
                          <span className="text-[#555]">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-4 text-[#8e8e93]">{row.version}</td>
                    <td className="px-6 py-4 text-[#8e8e93]">{row.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <JourneyFooter />
    </ProductPageLayout>
  );
}
