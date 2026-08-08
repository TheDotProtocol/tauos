import { tauFetch } from '@/lib/tau-auth-client';

export type ProductSubstrateStatus = {
  id: string;
  label: string;
  kind: string;
  availability: string;
  configured: boolean;
  defaultModel?: string;
  isTauFoundation: boolean;
};

export async function fetchProductSubstrates(): Promise<ProductSubstrateStatus[]> {
  const res = await tauFetch('/api/tau-foundation/substrates', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load substrates');
  const data = (await res.json()) as { substrates: ProductSubstrateStatus[] };
  return data.substrates;
}
