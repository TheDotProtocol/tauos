import { jsonAuthHeaders } from '../session';
import { tauMobileFetch } from '../network';
import type { TauMailContact } from '../types';

export async function fetchContacts(): Promise<TauMailContact[]> {
  const res = await tauMobileFetch('/api/taumail/contacts', { headers: await jsonAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load contacts');
  const data = (await res.json()) as { contacts?: TauMailContact[] };
  return data.contacts || [];
}

export async function createContact(input: {
  name: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  tauId?: string;
  organization?: string;
  designation?: string;
}): Promise<{ ok: true; contact: TauMailContact } | { ok: false; error: string }> {
  const res = await tauMobileFetch('/api/taumail/contacts', {
    method: 'POST',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as { contact?: TauMailContact; error?: string };
  if (!res.ok || !data.contact) {
    return { ok: false, error: data.error || 'Failed to create contact' };
  }
  return { ok: true, contact: data.contact };
}
