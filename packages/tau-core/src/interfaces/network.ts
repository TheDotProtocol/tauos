export interface TauNetworkRequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface TauNetworkService {
  readonly id: 'tau.network';
  fetch(url: string, init?: TauNetworkRequestInit): Promise<Response>;
}
