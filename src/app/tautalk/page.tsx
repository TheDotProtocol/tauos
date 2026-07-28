import MarketingChrome from '@/components/marketing/MarketingChrome';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import TauTalkMarketing from '@/components/marketing/TauTalkMarketing';

export const metadata = {
  title: 'TauTalk — Encrypted Messaging | TAU CORE',
  description:
    'Download TauTalk for Android. End-to-end encrypted messaging with email OTP signup, no telemetry, and OpenStreetMap locations. Public beta.',
};

export default function TauTalkPage() {
  return (
    <MarketingChrome>
      <main className="min-h-screen bg-background text-foreground">
        <Navigation />
        <TauTalkMarketing />
        <Footer />
      </main>
    </MarketingChrome>
  );
}
