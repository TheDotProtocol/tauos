export type TauMailMobileClientConfig = {
  /** e.g. https://www.tauos.org — no trailing slash */
  apiBaseUrl: string;
  storage: SessionStorageAdapter;
  network?: NetworkAdapter;
  fetchImpl?: typeof fetch;
};

export type SessionStorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

export type NetworkAdapter = {
  isConnected(): Promise<boolean>;
  subscribe(listener: (online: boolean) => void): () => void;
};

let _config: TauMailMobileClientConfig | null = null;

export function initTauMailMobileClient(config: TauMailMobileClientConfig): void {
  const base = config.apiBaseUrl.replace(/\/$/, '');
  _config = { ...config, apiBaseUrl: base };
}

export function getTauMailMobileConfig(): TauMailMobileClientConfig {
  if (!_config) {
    throw new Error('TauMail mobile client not initialized — call initTauMailMobileClient()');
  }
  return _config;
}

export function resolveApiUrl(path: string): string {
  const { apiBaseUrl } = getTauMailMobileConfig();
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
