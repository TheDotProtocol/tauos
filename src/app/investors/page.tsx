import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import Link from 'next/link';

export const metadata = {
  title: 'Investors — Tau OS',
  description: 'Contact the Tau OS team for investor relations.',
};

export default function InvestorsPage() {
  return (
    <MarketingPageShell>
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">Investor Relations</h1>
        <p className="mt-6 text-lg text-zinc-400">
          Financial materials and detailed metrics are available to qualified investors on request.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="mailto:investors@tauos.org"
            className="rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-zinc-200"
          >
            Contact investors@tauos.org
          </a>
          <Link href="/" className="text-zinc-400 underline-offset-4 hover:text-white hover:underline">
            Back to home
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
