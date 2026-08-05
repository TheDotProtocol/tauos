import TxpShell from '@/txp/patterns/TxpShell';
import { TxpContainer, TxpGlassCard, TxpSection, TxpSectionHeading } from '@/txp/components/primitives';

export const metadata = {
  title: 'Tau Design System V1 | TXP',
  description: 'Typography, color, spacing, motion, and component tokens for the Tau Universe.',
};

const tokenGroups = [
  {
    title: 'Color',
    items: ['--background / --foreground', '--primary (Gold)', '--txp-titanium', '--txp-surface-0…3', '--txp-glass-border'],
  },
  {
    title: 'Typography',
    items: ['Space Grotesk (sans)', 'Space Mono (mono)', '--txp-text-display → caption scale'],
  },
  {
    title: 'Spacing & Layout',
    items: ['--txp-section-y', '--txp-container (72rem)', '--txp-container-wide (90rem)'],
  },
  {
    title: 'Motion',
    items: ['--txp-ease-out', '--txp-duration-fast/base/slow/keynote', 'fadeUp · scaleIn · staggerContainer'],
  },
  {
    title: 'Components',
    items: ['TxpShell · TxpNavigation · TxpFooter', 'TxpGlassCard · TxpSectionHeading', 'ProductPageTemplate', 'Button · Card (ui/)'],
  },
  {
    title: 'Patterns',
    items: ['Keynote homepage sections', 'Product page template (Hero → FAQ → CTA)', 'Mega menu navigation', 'Download center'],
  },
];

export default function DesignSystemPage() {
  return (
    <TxpShell>
      <TxpSection className="pt-28">
        <TxpContainer>
          <TxpSectionHeading
            eyebrow="TXP V1"
            title="Tau Design System"
            subtitle="The single source of truth for the Tau Universe. Import tokens and patterns from this repository into every future Tau product."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokenGroups.map((g) => (
              <TxpGlassCard key={g.title}>
                <h3 className="font-bold text-primary text-lg mb-4">{g.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {g.items.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </TxpGlassCard>
            ))}
          </div>
          <div className="mt-16 p-8 rounded-2xl border border-primary/30 bg-primary/5 text-center">
            <p className="text-2xl font-bold mb-2">Join Tau. Build Your World.</p>
            <p className="text-muted-foreground">Components live in <code className="text-primary">src/txp/</code> · Content in <code className="text-primary">src/content/txp/</code></p>
          </div>
        </TxpContainer>
      </TxpSection>
    </TxpShell>
  );
}
