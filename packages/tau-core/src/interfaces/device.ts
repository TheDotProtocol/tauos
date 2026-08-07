export interface TauDeviceInfo {
  model: string;
  manufacturer: string;
  osVersion: string;
}

export interface TauDeviceService {
  readonly id: 'tau.device';
  getInfo(): Promise<TauDeviceInfo>;
}
