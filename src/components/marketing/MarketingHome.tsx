import MarketingChrome from '@/components/marketing/MarketingChrome';
import Navigation from '@/components/marketing/Navigation';
import Hero from '@/components/marketing/Hero';
import WhatIsTau from '@/components/marketing/WhatIsTau';
import TauOSDesktop from '@/components/marketing/TauOSDesktop';
import TauMobile from '@/components/marketing/TauMobile';
import WhyTauExists from '@/components/marketing/WhyTauExists';
import PrivacySafety from '@/components/marketing/PrivacySafety';
import TauAI from '@/components/marketing/TauAI';
import DeveloperPlatform from '@/components/marketing/DeveloperPlatform';
import Enterprise from '@/components/marketing/Enterprise';
import Roadmap from '@/components/marketing/Roadmap';
import OpenLetter from '@/components/marketing/OpenLetter';
import Footer from '@/components/marketing/Footer';

/** Homepage — 1:1 with Website-Redesign-tau-replit/artifacts/tau-website/src/pages/Home.tsx */
export default function MarketingHome() {
  return (
    <MarketingChrome>
      <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
        <Navigation />
        <Hero />
        <WhatIsTau />
        <TauOSDesktop />
        <TauMobile />
        <WhyTauExists />
        <PrivacySafety />
        <TauAI />
        <DeveloperPlatform />
        <Enterprise />
        <Roadmap />
        <OpenLetter />
        <Footer />
      </main>
    </MarketingChrome>
  );
}
