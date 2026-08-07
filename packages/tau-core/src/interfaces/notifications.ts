export interface TauNotificationService {
  readonly id: 'tau.notifications';
  registerChannel(id: string, name: string): Promise<void>;
  show(title: string, body: string, channelId?: string): Promise<void>;
}
