import type { TauServiceContext } from '../platform/kinds';

/** Base for all Tau Core Services */
export interface TauService {
  readonly id: string;
  initialize(ctx: TauServiceContext): Promise<void>;
  shutdown?(): Promise<void>;
}

export abstract class TauServiceBase implements TauService {
  abstract readonly id: string;
  protected ctx!: TauServiceContext;

  async initialize(ctx: TauServiceContext): Promise<void> {
    this.ctx = ctx;
  }
}
