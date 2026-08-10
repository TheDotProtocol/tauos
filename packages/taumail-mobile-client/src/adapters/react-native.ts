import type { NetworkAdapter, SessionStorageAdapter } from '../config';

/** In-memory storage for tests and simulators without native modules. */
export function createMemorySessionStorage(): SessionStorageAdapter {
  const map = new Map<string, string>();
  return {
    getItem: async (key) => map.get(key) ?? null,
    setItem: async (key, value) => {
      map.set(key, value);
    },
    removeItem: async (key) => {
      map.delete(key);
    },
  };
}

export function createReactNativeSessionStorage(): SessionStorageAdapter {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const EncryptedStorage = require('react-native-encrypted-storage').default as {
    getItem: (k: string) => Promise<string | null>;
    setItem: (k: string, v: string) => Promise<void>;
    removeItem: (k: string) => Promise<void>;
  };

  return {
    getItem: (key) => EncryptedStorage.getItem(key),
    setItem: (key, value) => EncryptedStorage.setItem(key, value),
    removeItem: (key) => EncryptedStorage.removeItem(key),
  };
}

export function createNetInfoAdapter(): NetworkAdapter {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const NetInfo = require('@react-native-community/netinfo').default as {
    fetch: () => Promise<{ isConnected: boolean | null }>;
    addEventListener: (cb: (state: { isConnected: boolean | null }) => void) => () => void;
  };

  return {
    isConnected: async () => {
      const state = await NetInfo.fetch();
      return Boolean(state.isConnected);
    },
    subscribe: (listener) =>
      NetInfo.addEventListener((state) => {
        listener(Boolean(state.isConnected));
      }),
  };
}
