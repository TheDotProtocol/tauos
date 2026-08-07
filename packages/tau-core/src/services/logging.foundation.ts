import { TauServiceBase } from '../common/service';
import type { TauLoggingService, TauLogLevel } from '../interfaces/logging';

export class TauLoggingServiceFoundation extends TauServiceBase implements TauLoggingService {
  readonly id = 'tau.logging' as const;

  log(level: TauLogLevel, message: string, meta?: Record<string, unknown>): void {
    const line = meta ? `${message} ${JSON.stringify(meta)}` : message;
    // Foundation: console only — platform adapter replaces in M6+
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn(`[tau.${level}]`, line);
  }
}
