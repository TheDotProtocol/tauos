export type TauErrorCode =
  | 'UNKNOWN'
  | 'NOT_IMPLEMENTED'
  | 'NETWORK'
  | 'AUTH'
  | 'PERMISSION'
  | 'STORAGE'
  | 'CONFIG';

export class TauError extends Error {
  constructor(
    message: string,
    readonly code: TauErrorCode = 'UNKNOWN',
    readonly cause?: unknown
  ) {
    super(message);
    this.name = 'TauError';
  }
}

export function notImplemented(feature: string): never {
  throw new TauError(`${feature} not implemented`, 'NOT_IMPLEMENTED');
}
