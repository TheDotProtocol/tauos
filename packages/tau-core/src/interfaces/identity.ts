/** Tau Identity — maps to Runtime.auth + Runtime.identity (M6 foundation) */
export interface TauIdentityService {
  readonly id: 'tau.identity';
  getDeviceId(): Promise<string>;
  isAuthenticated(): Promise<boolean>;
}
