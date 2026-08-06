'use client';

import ActivityLog from '@/components/taucloud/shared/ActivityLog';

export default function ActivityFeed() {
  return <ActivityLog limit={8} compact />;
}
