import TauCloudFilesPage from '@/components/taucloud/files/TauCloudFilesPage';
import { Suspense } from 'react';

export const metadata = {
  title: 'Files | Tau Cloud',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0d0d0f] text-[#71717a]">Loading...</div>}>
      <TauCloudFilesPage mode="files" />
    </Suspense>
  );
}
