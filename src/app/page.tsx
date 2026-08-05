import { Suspense } from 'react';
import TauWebsiteHome from '@/components/website/TauWebsiteHome';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0b]" />}>
      <TauWebsiteHome />
    </Suspense>
  );
}
