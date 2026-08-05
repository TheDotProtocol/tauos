import Link from 'next/link';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { getDocsForHub } from '@/lib/tau-docs';
import {
  BookOpen,
  Code2,
  Rocket,
  Shield,
  Layers,
  Briefcase,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const sectionIcons: Record<string, typeof BookOpen> = {
  'Getting Started': Rocket,
  'Platform & Architecture': Layers,
  Products: BookOpen,
  Developers: Code2,
  'Security & Privacy': Shield,
  'Business & Launch': Briefcase,
};

export default function DocumentationHub() {
  const sections = getDocsForHub();

  return (
    <MarketingPageShell
      title="Documentation"
      subtitle="Read Tau OS and TAU CORE guides in your browser — setup, security, developers, and product docs."
    >
      <section className="py-10 md:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6 md:p-8 mb-10 md:mb-14">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Quick links</h2>
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              Jump to installation, beta program, or product landings.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[
                { href: '/docs/installation-guides', label: 'Installation', sub: 'Desktop & mobile setup' },
                { href: '/docs/faq', label: 'FAQ', sub: 'Common questions' },
                { href: '/downloads', label: 'Downloads', sub: 'APK & installers' },
                { href: '/beta', label: 'Beta Program', sub: 'Join public beta' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 hover:border-yellow-400/40 transition-colors"
                >
                  <h3 className="font-semibold text-white">{item.label}</h3>
                  <p className="text-sm text-gray-400 mt-1">{item.sub}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {sections.map((section) => {
              const Icon = sectionIcons[section.title] ?? BookOpen;
              return (
                <div
                  key={section.title}
                  className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6 hover:border-yellow-400/25 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 shrink-0">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-white">{section.title}</h2>
                      <p className="text-sm text-gray-400 mt-1">{section.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {section.docs.map((doc) => (
                      <li key={doc.slug}>
                        <Link
                          href={doc.href}
                          className="block rounded-lg px-3 py-2.5 hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
                        >
                          <span className="font-medium text-white text-sm md:text-base">{doc.title}</span>
                          {doc.description ? (
                            <span className="block text-xs md:text-sm text-gray-400 mt-0.5 line-clamp-2">
                              {doc.description}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
