'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TauCloudAppShell from '@/components/taucloud/shared/TauCloudAppShell';
import { fetchTauCloudShares, revokeTauCloudShare } from '@/lib/taucloud/api-client';
import type { TauCloudShareLink } from '@/lib/taucloud/types';

export default function TauCloudSharingPage() {
  const [shares, setShares] = useState<TauCloudShareLink[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = () =>
    fetchTauCloudShares()
      .then(setShares)
      .catch(() => setError('Could not load share links'));

  useEffect(() => {
    load();
  }, []);

  const handleCopy = async (shareUrl: string) => {
    await navigator.clipboard.writeText(shareUrl);
    setMessage('Share link copied');
  };

  const handleRevoke = async (shareId: string) => {
    const result = await revokeTauCloudShare(shareId);
    if (!result.ok) {
      setMessage(result.error || 'Could not revoke link');
      return;
    }
    setMessage('Share link revoked');
    load();
  };

  return (
    <TauCloudAppShell active="sharing" title="Sharing Controls" subtitle="Manage links, permissions, and workspace invites.">
      <div className="space-y-6 p-8">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-[#ffb800]">{message}</p> : null}

        <div className="rounded-xl border border-[#222228] bg-[#16161b] p-6">
          <h2 className="text-lg font-semibold text-white">Active Share Links</h2>
          <p className="mt-2 text-sm text-[#71717a]">
            Share links you create from Files or Preview appear here. Revoke a link anytime to stop public access.
          </p>
        </div>

        {shares.length === 0 ? (
          <p className="text-sm text-[#71717a]">No active share links yet. Share a file from the Files view to generate one.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#222228]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#16161b] text-[#71717a]">
                <tr>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Expires</th>
                  <th className="px-4 py-3 font-medium">Downloads</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shares.map((share) => (
                  <tr key={share.id} className="border-t border-[#222228] bg-[#121214]">
                    <td className="px-4 py-3">
                      <Link href={`/taucloud/preview/${share.fileId}`} className="font-medium text-white hover:text-[#ffb800]">
                        {share.fileName}
                      </Link>
                      <p className="text-xs text-[#71717a]">{share.fileSizeLabel}</p>
                    </td>
                    <td className="px-4 py-3 text-[#a1a1aa]">{share.timeLabel}</td>
                    <td className="px-4 py-3 text-[#a1a1aa]">
                      {share.isExpired ? 'Expired' : share.expiresAt ? new Date(share.expiresAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-[#a1a1aa]">{share.downloadCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3 text-xs">
                        <button type="button" className="text-[#ffb800]" onClick={() => handleCopy(share.shareUrl)}>
                          Copy link
                        </button>
                        <button type="button" className="text-red-400" onClick={() => handleRevoke(share.id)}>
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TauCloudAppShell>
  );
}
