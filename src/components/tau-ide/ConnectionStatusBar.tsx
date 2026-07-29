'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertTriangle, HardDrive } from 'lucide-react';
import {
  subscribeConnectionStatus, probeConnection, connectionLabel, type ConnectionStatus, type ConnectionState
} from '@/lib/tau-ide/connection-status';
import { getStoredToken } from '@/lib/tau-ide/auth-client';

function iconFor(state: ConnectionState) {
  switch (state) {
    case 'connected': return Cloud;
    case 'local-only': return HardDrive;
    case 'offline': return WifiOff;
    case 'sync-pending': return RefreshCw;
    case 'sync-failed':
    case 'cloud-unavailable': return CloudOff;
    case 'auth-required': return AlertTriangle;
    default: return Wifi;
  }
}

function colorFor(state: ConnectionState): string {
  switch (state) {
    case 'connected': return 'text-green-400 border-green-500/30 bg-green-500/10';
    case 'local-only': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    case 'sync-pending': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    case 'sync-failed':
    case 'cloud-unavailable': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    case 'offline': return 'text-red-400 border-red-500/30 bg-red-500/10';
    default: return 'text-gray-400 border-white/10 bg-white/5';
  }
}

export default function ConnectionStatusBar() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const unsub = subscribeConnectionStatus(setStatus);
    probeConnection(Boolean(getStoredToken()));
    const interval = setInterval(() => probeConnection(Boolean(getStoredToken())), 60_000);
    return () => { unsub(); clearInterval(interval); };
  }, []);

  if (!status) return null;

  const Icon = iconFor(status.state);
  const color = colorFor(status.state);

  return (
    <div className="border-t border-white/10 bg-[#0d0d0d] px-4 py-1.5" role="status" aria-live="polite">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1 border ${color} w-full text-left`}
        aria-expanded={expanded}
        aria-label={`Connection status: ${connectionLabel(status.state)}`}
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 ${status.state === 'sync-pending' ? 'animate-spin' : ''}`} />
        <span className="font-medium">{connectionLabel(status.state)}</span>
        <span className="text-gray-500 truncate hidden sm:inline">— {status.message}</span>
      </button>
      {expanded && (
        <div className="mt-2 text-xs text-gray-500 space-y-1 pl-1">
          <p>Database: {status.database ? 'Connected' : 'Unavailable'}</p>
          <p>Authenticated: {status.authenticated ? 'Yes' : 'No'}</p>
          {status.lastChecked && <p>Last checked: {new Date(status.lastChecked).toLocaleTimeString()}</p>}
          {status.lastError && <p className="text-orange-400">Error: {status.lastError}</p>}
          <button
            type="button"
            onClick={() => probeConnection(Boolean(getStoredToken()))}
            className="text-cyan-400 hover:underline mt-1"
          >
            Retry connection
          </button>
        </div>
      )}
    </div>
  );
}
