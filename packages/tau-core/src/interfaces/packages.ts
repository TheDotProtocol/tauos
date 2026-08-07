export interface TauPackageInfo {
  id: string;
  version: string;
}

export interface TauPackageService {
  readonly id: 'tau.packages';
  listInstalled(): Promise<TauPackageInfo[]>;
}
