export interface TauPluginService {
  readonly id: 'tau.plugins';
  list(): Promise<string[]>;
  invoke(pluginId: string, method: string, args?: unknown): Promise<unknown>;
}
