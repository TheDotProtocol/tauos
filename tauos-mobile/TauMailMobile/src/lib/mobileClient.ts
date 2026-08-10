import {
  createNetInfoAdapter,
  createReactNativeSessionStorage,
  initTauMailMobileClient,
} from '@tau/taumail-mobile-client';
import { TAUMAIL_API_BASE_URL } from '../config/env';

let initialized = false;

export function ensureTauMailMobileClient(): void {
  if (initialized) return;
  initTauMailMobileClient({
    apiBaseUrl: TAUMAIL_API_BASE_URL,
    storage: createReactNativeSessionStorage(),
    network: createNetInfoAdapter(),
  });
  initialized = true;
}

export { TAUMAIL_API_BASE_URL };
