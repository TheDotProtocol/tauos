import TxpShell from '@/txp/patterns/TxpShell';
import TxpHero from '@/txp/sections/TxpHero';
import EcosystemSection from '@/txp/sections/EcosystemSection';
import DownloadSection from '@/txp/sections/DownloadSection';
import {
  WhyTauSection,
  PrivacyFirstSection,
  BuiltForSection,
  TauAISection,
  GrayscaleSection,
  DeveloperSection,
  PhilosophySection,
} from '@/txp/sections/ContentSections';

/**
 * Tau Experience Platform — keynote storytelling flow.
 * Each section is a chapter. Each scroll is a page turn.
 */
export default function TxpHome() {
  return (
    <TxpShell>
      <TxpHero />
      <WhyTauSection />
      <EcosystemSection />
      <PrivacyFirstSection />
      <TauAISection />
      <BuiltForSection />
      <DeveloperSection />
      <GrayscaleSection />
      <PhilosophySection />
      <DownloadSection />
    </TxpShell>
  );
}
