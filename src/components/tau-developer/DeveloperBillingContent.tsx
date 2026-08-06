'use client';

import { useEffect, useState } from 'react';
import { geistMono, geistSans } from '@/lib/website/fonts';
import { tauAuthHeaders, tauFetchCredentials } from '@/lib/tau-auth-client';
import { tauDev } from '@/lib/tau-developer/theme';

type BillingData = {
  subscription: {
    plan: string;
    status: string;
    current_period_end?: string;
    payment_method_last4?: string;
    payment_method_brand?: string;
  };
  tiers: { id: string; name: string; price: string; active: boolean }[];
  quotas: {
    apiCalls: { used: number; limit: number; pct: number };
    buildMinutes: { used: number; limit: number; pct: number };
  };
  invoices: { id: string; period_label?: string; amount_cents: number; pdf_url?: string; created_at: string }[];
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

export default function DeveloperBillingContent() {
  const [data, setData] = useState<BillingData | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/developers/billing', { credentials: tauFetchCredentials, headers: tauAuthHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => {});
  }, []);

  const upgrade = async (plan: 'pro' | 'enterprise') => {
    setUpgrading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/developers/billing/checkout', {
        method: 'POST',
        credentials: tauFetchCredentials,
        headers: { 'Content-Type': 'application/json', ...tauAuthHeaders() },
        body: JSON.stringify({ plan }),
      });
      const body = await res.json();
      if (body.url) window.location.href = body.url;
      else setMessage(body.message ?? 'Stripe checkout unavailable — configure STRIPE_SECRET_KEY');
    } finally {
      setUpgrading(false);
    }
  };

  const sub = data?.subscription;
  const planLabel = sub?.plan === 'pro' ? 'Pro Developer Tier' : sub?.plan === 'enterprise' ? 'Enterprise' : 'Free Sandbox';
  const price = sub?.plan === 'pro' ? '$49/mo' : sub?.plan === 'enterprise' ? 'Custom' : '$0';

  return (
    <div className={`${geistSans.className} flex flex-col gap-6 p-8`}>
      <div className="rounded-xl border p-6" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.goldBorder }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#fafafa]">{planLabel}</p>
            <p className={`${geistMono.className} mt-1 text-2xl font-bold text-[#f5a623]`}>{price}</p>
            {sub?.current_period_end && (
              <p className="mt-1 text-xs text-[#52525b]">
                Renews {new Date(sub.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
          {sub?.plan !== 'pro' && (
            <button
              type="button"
              disabled={upgrading}
              onClick={() => upgrade('pro')}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-[#060608] disabled:opacity-50"
              style={{ backgroundColor: tauDev.gold }}
            >
              {upgrading ? 'Redirecting…' : 'Upgrade Plan'}
            </button>
          )}
        </div>
        {data && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <QuotaBar label="API Calls" used={fmt(data.quotas.apiCalls.used)} total={fmt(data.quotas.apiCalls.limit)} pct={data.quotas.apiCalls.pct} />
            <QuotaBar label="Build Minutes" used={`${data.quotas.buildMinutes.used}m`} total={`${data.quotas.buildMinutes.limit}m`} pct={data.quotas.buildMinutes.pct} />
          </div>
        )}
        {message && <p className="mt-3 text-xs text-[#a1a1aa]">{message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(data?.tiers ?? []).map((t) => (
          <div
            key={t.id}
            className="rounded-xl border p-5"
            style={{ backgroundColor: tauDev.surface, borderColor: t.active ? tauDev.goldBorder : tauDev.border }}
          >
            <p className="font-semibold text-[#fafafa]">{t.name}</p>
            <p className={`${geistMono.className} mt-2 text-xl text-[#f5a623]`}>{t.price}{t.id === 'pro' ? '/mo' : ''}</p>
            {t.active && (
              <span className="mt-3 inline-block rounded border px-2 py-0.5 text-[10px] font-semibold text-[#f5a623]" style={{ borderColor: tauDev.gold, backgroundColor: tauDev.goldMuted }}>
                ACTIVE
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-6" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
          <p className="mb-3 text-sm font-semibold text-[#fafafa]">Payment Method</p>
          {sub?.payment_method_last4 ? (
            <p className={`${geistMono.className} text-sm text-[#a1a1aa]`}>
              {(sub.payment_method_brand ?? 'CARD').toUpperCase()} •••• {sub.payment_method_last4}
            </p>
          ) : (
            <p className="text-sm text-[#52525b]">No payment method on file</p>
          )}
        </div>
        <div className="rounded-xl border p-6" style={{ backgroundColor: tauDev.surface, borderColor: tauDev.border }}>
          <p className="mb-3 text-sm font-semibold text-[#fafafa]">Invoice History</p>
          {(data?.invoices ?? []).length === 0 && <p className="text-xs text-[#52525b]">No invoices yet</p>}
          {(data?.invoices ?? []).map((inv) => (
            <div key={inv.id} className="flex justify-between border-b py-2 text-xs last:border-0" style={{ borderColor: tauDev.border }}>
              <span className="text-[#a1a1aa]">{inv.period_label ?? new Date(inv.created_at).toLocaleDateString()}</span>
              {inv.pdf_url ? (
                <a href={inv.pdf_url} target="_blank" rel="noreferrer" className="text-[#f5a623]">PDF</a>
              ) : (
                <span className="text-[#52525b]">${(inv.amount_cents / 100).toFixed(2)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuotaBar({ label, used, total, pct }: { label: string; used: string; total: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-[#a1a1aa]">{label}</span>
        <span className={`${geistMono.className} text-[#fafafa]`}>{used} / {total}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded" style={{ backgroundColor: tauDev.surfaceElevated }}>
        <div className="h-full rounded" style={{ width: `${pct}%`, backgroundColor: tauDev.gold }} />
      </div>
    </div>
  );
}
