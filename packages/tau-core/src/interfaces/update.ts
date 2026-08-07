export interface TauUpdateInfo {
  version: string;
  available: boolean;
}

export interface TauUpdateService {
  readonly id: 'tau.update';
  check(): Promise<TauUpdateInfo>;
}
