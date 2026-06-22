import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatIsTau from "@/components/WhatIsTau";
import TauOSDesktop from "@/components/TauOSDesktop";
import TauMobile from "@/components/TauMobile";
import WhyTauExists from "@/components/WhyTauExists";
import PrivacySafety from "@/components/PrivacySafety";
import TauAI from "@/components/TauAI";
import DeveloperPlatform from "@/components/DeveloperPlatform";
import Enterprise from "@/components/Enterprise";
import Roadmap from "@/components/Roadmap";
import OpenLetter from "@/components/OpenLetter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
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
  );
}
