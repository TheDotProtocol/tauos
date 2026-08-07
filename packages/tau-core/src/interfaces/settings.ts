export interface TauSettingsService {
  readonly id: 'tau.settings';
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}
