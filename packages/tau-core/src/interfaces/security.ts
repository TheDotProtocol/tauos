export interface TauSecurityService {
  readonly id: 'tau.security';
  hash(data: string): Promise<string>;
  encrypt(plain: string): Promise<string>;
  decrypt(cipher: string): Promise<string>;
}
