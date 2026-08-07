import { TauServiceBase } from '../common/service';
import { notImplemented } from '../common/errors';
import type { TauIdentityService } from '../interfaces/identity';

export class TauIdentityServiceFoundation extends TauServiceBase implements TauIdentityService {
  readonly id = 'tau.identity' as const;

  async getDeviceId(): Promise<string> {
    return notImplemented('tau.identity.getDeviceId');
  }

  async isAuthenticated(): Promise<boolean> {
    return false;
  }
}
