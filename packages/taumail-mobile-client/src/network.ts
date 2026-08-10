import { getTauMailMobileConfig, resolveApiUrl } from './config';
import { authHeaders, refreshSession } from './session';

export class OfflineError extends Error {
  constructor(message = 'Device is offline') {
    super(message);
    this.name = 'OfflineError';
  }
}

async function ensureOnline(): Promise<void> {
  const { network } = getTauMailMobileConfig();
  if (!network) return;
  const online = await network.isConnected();
  if (!online) throw new OfflineError();
}

export async function tauMobileFetch(
  path: string,
  init: RequestInit = {},
  options?: { skipOfflineCheck?: boolean; retries?: number },
): Promise<Response> {
  if (!options?.skipOfflineCheck) {
    await ensureOnline();
  }

  const { fetchImpl = fetch } = getTauMailMobileConfig();
  const url = resolveApiUrl(path);
  const baseHeaders = await authHeaders();
  const extra =
    init.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : ((init.headers as Record<string, string>) ?? {});

  const mergedHeaders = { ...baseHeaders, ...extra };
  const maxRetries = options?.retries ?? 1;

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      let res = await fetchImpl(url, { ...init, headers: mergedHeaders });

      if (
        res.status === 401 &&
        !(init.method === 'POST' && path.includes('/api/auth/session'))
      ) {
        const refreshed = await refreshSession();
        if (refreshed) {
          const retryHeaders = { ...(await authHeaders()), ...extra };
          res = await fetchImpl(url, { ...init, headers: retryHeaders });
        }
      }

      return res;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Network request failed');
}

export async function tauMobileJson<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number }> {
  const res = await tauMobileFetch(path, init);
  let body: Record<string, unknown> = {};
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    /* non-json */
  }
  if (!res.ok) {
    return {
      ok: false,
      error: String(body.error || res.statusText || 'Request failed'),
      status: res.status,
    };
  }
  return { ok: true, data: body as T };
}
