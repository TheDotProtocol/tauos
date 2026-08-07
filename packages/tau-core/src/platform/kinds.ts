/** Platform kind — telemetry/config only; apps must not branch on Android APIs */
export type TauPlatformKind = 'aosp-beta' | 'native' | 'desktop' | 'web';

export interface TauPlatformInfo {
  kind: TauPlatformKind;
  version: string;
  channel: 'beta' | 'stable' | 'dev';
}

export interface TauServiceContext {
  platform: TauPlatformInfo;
}
