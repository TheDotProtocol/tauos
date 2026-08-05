'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import WebsiteShell from '@/components/website/layout/WebsiteShell';
import OpeningExperience from '@/components/website/opening/OpeningExperience';
import HeroSection from '@/components/website/sections/HeroSection';
import ExperienceSection from '@/components/website/sections/ExperienceSection';
import {
  WelcomeSection,
  EcosystemSection,
  PrivacySection,
  BuiltForEveryoneSection,
  BusinessSection,
  DevelopersSection,
  CommunitySection,
  JoinTauSection,
} from '@/components/website/sections/HomeSections';

export default function TauWebsiteHome() {
  const searchParams = useSearchParams();
  const [showOpening, setShowOpening] = useState(false);

  useEffect(() => {
    const skip =
      searchParams.get('skip-opening') === '1' ||
      sessionStorage.getItem('tau-opening-seen') === '1';
    if (!skip) setShowOpening(true);
  }, [searchParams]);

  return (
    <>
      <WebsiteShell>
        <HeroSection />
        <WelcomeSection />
        <EcosystemSection />
        <ExperienceSection />
        <PrivacySection />
        <BuiltForEveryoneSection />
        <BusinessSection />
        <DevelopersSection />
        <CommunitySection />
        <JoinTauSection />
      </WebsiteShell>
      {showOpening && (
        <OpeningExperience onComplete={() => setShowOpening(false)} />
      )}
    </>
  );
}
