import TxpShell from '@/txp/patterns/TxpShell';
import DownloadSection from '@/txp/sections/DownloadSection';
import Link from 'next/link';
import { TxpContainer, TxpGlassCard, TxpSection, TxpSectionHeading } from '@/txp/components/primitives';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Download Center | Tau Experience Platform',
  description: 'Download Tau Core, TauTalk, and developer previews for every platform.',
};

export default function DownloadsPage() {
  return (
    <TxpShell>
      <TxpSection className="pt-28">
        <TxpContainer>
          <TxpSectionHeading
            eyebrow="Downloads"
            title="Download Center"
            subtitle="Public beta builds, checksums, release notes, and system requirements."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <TxpGlassCard>
              <h3 className="font-bold text-lg mb-2">TauTalk Android Beta</h3>
              <p className="text-sm text-muted-foreground mb-4">~77 MB · Public beta with WebRTC calls</p>
              <Button asChild>
                <Link href="/downloads/TauTalk-1.0.0-beta.apk">Download APK</Link>
              </Button>
            </TxpGlassCard>
            <TxpGlassCard>
              <h3 className="font-bold text-lg mb-2">Tau Core Preview</h3>
              <p className="text-sm text-muted-foreground mb-4">ISO and platform installers</p>
              <Button asChild variant="outline" className="border-primary/30">
                <Link href="/download">Full installer page →</Link>
              </Button>
            </TxpGlassCard>
          </div>
        </TxpContainer>
      </TxpSection>
      <DownloadSection />
    </TxpShell>
  );
}
