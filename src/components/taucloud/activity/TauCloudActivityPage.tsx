'use client';

import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import ActivityLog from '@/components/taucloud/shared/ActivityLog';

export default function TauCloudActivityPage() {
  return (
    <TauCloudAppShell active="activity" title="Activity Log" subtitle="Real-time sync and authorization events.">
      <div className="p-8">
        <ActivityLog />
      </div>
    </TauCloudAppShell>
  );
}
