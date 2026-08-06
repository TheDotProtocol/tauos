'use client';

import { useCallback, useEffect, useState } from 'react';
import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import HeroBanner from '@/components/taucloud/shared/HeroBanner';
import { FileSection } from '@/components/taucloud/shared/FileCard';
import StorageGaugeCard from '@/components/taucloud/shared/StorageGaugeCard';
import ActivityFeed from '@/components/taucloud/shared/ActivityFeed';
import { fetchTauCloudFiles, fetchTauCloudProfile, toggleTauCloudStar } from '@/lib/taucloud/api-client';
import type { TauCloudFile, TauCloudProfile } from '@/lib/taucloud/types';
import { useTauCloudSession } from '@/hooks/useTauCloudSession';

export default function TauCloudDashboardPage() {
  const { user } = useTauCloudSession();
  const [recent, setRecent] = useState<TauCloudFile[]>([]);
  const [pinned, setPinned] = useState<TauCloudFile[]>([]);
  const [profile, setProfile] = useState<TauCloudProfile | null>(null);

  const load = useCallback(async () => {
    const [recentRows, pinnedRows, profileRow] = await Promise.all([
      fetchTauCloudFiles({ view: 'recent' }).catch(() => []),
      fetchTauCloudFiles({ view: 'starred' }).catch(() => []),
      fetchTauCloudProfile().catch(() => null),
    ]);
    setRecent(recentRows.slice(0, 3));
    setPinned(pinnedRows.slice(0, 3));
    setProfile(profileRow);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStar = async (fileId: string) => {
    await toggleTauCloudStar(fileId);
    load();
  };

  const displayName = profile?.fullName || user?.fullName || user?.username || 'User';
  const fileCount = recent.length;

  return (
    <TauCloudAppShell active="dashboard">
      <div className="space-y-8 p-8">
        <HeroBanner
          userName={displayName}
          syncSummary={
            fileCount
              ? `Your quantum encrypted vaults are secure. ${fileCount} recent file${fileCount === 1 ? '' : 's'} in your vault.`
              : undefined
          }
          onUploaded={load}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <FileSection
              title="Recent Vault Ingests"
              actionLabel="View all Files"
              actionHref="/taucloud/files"
              files={recent}
              onStarToggle={handleStar}
            />
            <FileSection
              title="Pinned Items"
              actionLabel="Manage Pins"
              actionHref="/taucloud/files"
              files={pinned}
              starred
              onStarToggle={handleStar}
            />
          </div>
          <div className="space-y-6">
            {profile ? <StorageGaugeCard storage={profile.storage} /> : null}
            <ActivityFeed />
          </div>
        </div>
      </div>
    </TauCloudAppShell>
  );
}
