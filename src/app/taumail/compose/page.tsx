import { Suspense } from 'react';
import TauMailComposePage from '@/components/taumail/compose/TauMailComposePage';

export const metadata = {
  title: 'Compose | Tau Mail',
};

export default function ComposePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#070708] text-[#a1a1aa]">Loading...</div>}>
      <TauMailComposePage />
    </Suspense>
  );
}
