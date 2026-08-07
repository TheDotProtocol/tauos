import type { TauPlatformInfo } from '../../platform/kinds';

/** AOSP adapter placeholder — real Android bindings in Compatibility Platform */
export function createAospPlatformStub(): TauPlatformInfo {
  return {
    kind: 'aosp-beta',
    version: '1.0.0',
    channel: 'beta',
  };
}
