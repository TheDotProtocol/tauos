import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import {
  fetchNotifications,
  registerPushDevice,
  fetchPushPreference,
  type TauMailNotification,
} from '@tau/taumail-mobile-client';

const DEVICE_ID_KEY = 'taumail_push_device_id';
const SEEN_NOTIFICATIONS_KEY = 'taumail_seen_notification_ids';

let pollTimer: ReturnType<typeof setInterval> | null = null;
let configured = false;
let iosPermissionsRequested = false;
let fcmListenersAttached = false;

type PushNotificationModule = typeof import('react-native-push-notification').default;
type PushNotificationIOSModule = typeof import('@react-native-community/push-notification-ios').default;
type FirebaseMessagingModule = typeof import('@react-native-firebase/messaging').default;

function getFirebaseMessaging(): FirebaseMessagingModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-firebase/messaging').default as FirebaseMessagingModule;
  } catch {
    return null;
  }
}

/** Android-only — top-level require crashes iOS with NativeEventEmitter error. */
function getAndroidPushModule(): PushNotificationModule | null {
  if (Platform.OS !== 'android') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-push-notification').default as PushNotificationModule;
  } catch {
    return null;
  }
}

/** iOS-only — must check native module exists before require (same NativeEventEmitter crash). */
function getIosPushModule(): PushNotificationIOSModule | null {
  if (Platform.OS !== 'ios') return null;
  if (!NativeModules.RNCPushNotificationIOS) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-community/push-notification-ios').default as PushNotificationIOSModule;
  } catch {
    return null;
  }
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = `tm-${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

async function ensureAndroidNotificationPermission(): Promise<void> {
  if (Platform.OS !== 'android' || Platform.Version < 33) return;
  try {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  } catch {
    /* ignore */
  }
}

async function ensureIosPermissions(): Promise<void> {
  if (Platform.OS !== 'ios' || iosPermissionsRequested) return;
  const PushNotificationIOS = getIosPushModule();
  if (!PushNotificationIOS) return;
  iosPermissionsRequested = true;
  try {
    await PushNotificationIOS.requestPermissions({ alert: true, badge: true, sound: true });
  } catch {
    /* ignore */
  }
}

async function requestFcmPermission(messaging: FirebaseMessagingModule): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  await ensureAndroidNotificationPermission();
  return true;
}

async function getFcmToken(): Promise<string | null> {
  const messaging = getFirebaseMessaging();
  if (!messaging) return null;

  try {
    const allowed = await requestFcmPermission(messaging);
    if (!allowed) return null;
    if (Platform.OS === 'ios' && !messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    const token = await messaging().getToken();
    return token?.trim() || null;
  } catch {
    return null;
  }
}

async function registerDeviceToken(pushToken: string | null): Promise<void> {
  const deviceId = await getOrCreateDeviceId();
  await registerPushDevice({
    deviceId,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    pushToken: pushToken || `poll:${deviceId}`,
  });
}

function attachFcmListeners(): void {
  if (fcmListenersAttached) return;
  const messaging = getFirebaseMessaging();
  if (!messaging) return;

  fcmListenersAttached = true;

  messaging().onTokenRefresh((token) => {
    registerDeviceToken(token).catch(() => undefined);
  });

  messaging().onMessage((remoteMessage) => {
    const title = remoteMessage.notification?.title || 'Tau Mail';
    const body = remoteMessage.notification?.body || '';
    const id = remoteMessage.messageId || String(Date.now());
    showLocalNotification(id, title, body);
  });
}

function configureLocalNotifications(): void {
  if (configured) return;

  const PushNotification = getAndroidPushModule();
  if (PushNotification) {
    try {
      PushNotification.configure({
        onNotification(notification) {
          notification.finish?.();
        },
        permissions: { alert: true, badge: true, sound: true },
        popInitialNotification: false,
        requestPermissions: Platform.OS === 'ios',
      });
    } catch {
      /* ignore */
    }
  }

  configured = true;
}

async function loadSeenIds(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(SEEN_NOTIFICATIONS_KEY);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

async function saveSeenIds(ids: Set<string>): Promise<void> {
  await AsyncStorage.setItem(SEEN_NOTIFICATIONS_KEY, JSON.stringify(Array.from(ids).slice(-200)));
}

function showLocalNotification(id: string, title: string, message: string): void {
  const PushNotificationIOS = getIosPushModule();
  if (PushNotificationIOS) {
    try {
      PushNotificationIOS.addNotificationRequest({
        id,
        title,
        body: message,
        sound: 'default',
      });
    } catch {
      /* ignore */
    }
    return;
  }

  const PushNotification = getAndroidPushModule();
  if (!PushNotification) return;

  try {
    PushNotification.localNotification({
      channelId: 'taumail-inbox',
      title,
      message,
      playSound: true,
      importance: 'high',
      vibrate: true,
    });
  } catch {
    /* ignore */
  }
}

async function pollNotifications(): Promise<void> {
  const prefs = await fetchPushPreference().catch(() => ({ enabled: true, remotePushConfigured: false }));
  if (!prefs.enabled) return;

  const notifications = await fetchNotifications();
  const seen = await loadSeenIds();
  const fresh = notifications.filter((n) => !n.isRead && !seen.has(n.id));

  for (const note of fresh.slice(0, 3)) {
    showLocalNotification(note.id, 'Tau Mail', note.title);
    seen.add(note.id);
  }

  if (fresh.length > 0) {
    await saveSeenIds(seen);
  }
}

export async function startPushNotifications(): Promise<void> {
  configureLocalNotifications();
  attachFcmListeners();
  await ensureIosPermissions();
  await ensureAndroidNotificationPermission();

  const PushNotification = getAndroidPushModule();
  if (PushNotification) {
    try {
      PushNotification.createChannel(
        {
          channelId: 'taumail-inbox',
          channelName: 'Tau Mail Inbox',
          importance: 4,
          vibrate: true,
        },
        () => undefined,
      );
    } catch {
      /* ignore */
    }
  }

  const fcmToken = await getFcmToken();
  await registerDeviceToken(fcmToken);

  await pollNotifications();
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(() => {
    pollNotifications().catch(() => undefined);
  }, 60_000);
}

export function stopPushNotifications(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

export type { TauMailNotification };
