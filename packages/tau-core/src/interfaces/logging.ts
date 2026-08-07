export type TauLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface TauLoggingService {
  readonly id: 'tau.logging';
  log(level: TauLogLevel, message: string, meta?: Record<string, unknown>): void;
}
