'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function TauMailDemoBanner() {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-200">Local preview mode</p>
          <p className="text-xs text-yellow-200/70">
            Sample inbox for <span className="font-mono">demo@tauos.org</span> — no backend required.
            UI overhaul preview only.
          </p>
        </div>
      </div>
      <Link
        href="/taumail"
        onClick={() => {
          localStorage.removeItem('tauos_user');
          localStorage.removeItem('tauos_token');
          localStorage.removeItem('tauos_demo_mode');
        }}
        className="text-xs font-medium text-yellow-300 hover:text-yellow-100 underline underline-offset-2 shrink-0"
      >
        Exit preview
      </Link>
    </div>
  );
}
