import { notFound } from 'next/navigation';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import MarkdownDocViewer from '@/components/docs/MarkdownDocViewer';
import { getDocBySlug } from '@/lib/tau-docs';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const doc = getDocBySlug(params.slug);
  if (!doc) return { title: 'Documentation | Tau' };
  return { title: `${doc.title} | Tau Documentation`, description: doc.description };
}

export default function DocPage({ params }: Props) {
  const doc = getDocBySlug(params.slug);
  if (!doc) notFound();

  return (
    <MarketingPageShell title={doc.title} subtitle={doc.description} hero={false}>
      <section className="py-10 md:py-14 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarkdownDocViewer title={doc.title} content={doc.content} />
        </div>
      </section>
    </MarketingPageShell>
  );
}
