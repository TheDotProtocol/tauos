import MarketingWebsitePage from '@/components/website/marketing/MarketingWebsitePage';
import { websiteRoutes } from '@/lib/website/routes';

export const metadata = {
  title: 'About | Tau',
  description: 'Technology should belong to people, not the other way around.',
};

export default function AboutPage() {
  return (
    <MarketingWebsitePage
      badge="Company"
      title="About Tau"
      description="We built Tau with one idea: sovereignty, privacy, and tools that work together without harvesting your attention or data."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Privacy First', body: 'Every product defaults to zero telemetry and local-first processing.' },
          { title: 'Open Ecosystem', body: 'Tau Core powers a connected suite of apps, hardware, and developer tools.' },
          { title: 'Built to Last', body: 'Engineering decisions favor auditability, portability, and user control.' },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#121214] p-8 text-left">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[rgba(255,255,255,0.5)]">{item.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 text-center text-sm text-[rgba(255,255,255,0.5)]">
        Questions? <a href={websiteRoutes.contact} className="text-[#d4af37] hover:underline">Contact our team</a>.
      </p>
    </MarketingWebsitePage>
  );
}
