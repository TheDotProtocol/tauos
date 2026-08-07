export interface TauConfigurationService {
  readonly id: 'tau.configuration';
  get(key: string): Promise<string | undefined>;
  getAll(prefix: string): Promise<Record<string, string>>;
}
