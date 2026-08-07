import type { TauService } from '../common/service';
import type { TauServiceContext } from '../platform/kinds';
import { TauIdentityServiceFoundation } from './identity.foundation';
import { TauStorageServiceFoundation } from './storage.foundation';
import { TauLoggingServiceFoundation } from './logging.foundation';

/** Runtime Service Registry — resolves Tau Core Services by id */
export class TauServiceRegistry {
  private readonly services = new Map<string, TauService>();
  private initialized = false;

  register(service: TauService): void {
    this.services.set(service.id, service);
  }

  get<T extends TauService>(id: string): T {
    const s = this.services.get(id);
    if (!s) throw new Error(`Tau service not registered: ${id}`);
    return s as T;
  }

  async initializeAll(ctx: TauServiceContext): Promise<void> {
    if (this.initialized) return;
    for (const s of this.services.values()) {
      await s.initialize(ctx);
    }
    this.initialized = true;
  }

  list(): string[] {
    return [...this.services.keys()];
  }
}

/** Default foundation registry (M6) — extend with adapters later */
export function createFoundationRegistry(): TauServiceRegistry {
  const registry = new TauServiceRegistry();
  registry.register(new TauIdentityServiceFoundation());
  registry.register(new TauStorageServiceFoundation());
  registry.register(new TauLoggingServiceFoundation());
  return registry;
}
