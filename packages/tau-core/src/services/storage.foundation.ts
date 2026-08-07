import { TauServiceBase } from '../common/service';
import { notImplemented } from '../common/errors';
import type { TauStorageService } from '../interfaces/storage';

export class TauStorageServiceFoundation extends TauServiceBase implements TauStorageService {
  readonly id = 'tau.storage' as const;

  async get(_key: string): Promise<string | null> {
    return notImplemented('tau.storage.get');
  }

  async set(_key: string, _value: string): Promise<void> {
    return notImplemented('tau.storage.set');
  }

  async remove(_key: string): Promise<void> {
    return notImplemented('tau.storage.remove');
  }
}
