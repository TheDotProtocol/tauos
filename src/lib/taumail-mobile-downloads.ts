/** Tau Mail native app download links — single source for marketing + manifest. */

export const TAUMAIL_MOBILE_RELEASE_TAG = 'taumail-v1.0.0-beta.1';
export const TAUMAIL_MOBILE_RELEASE_BASE = `https://github.com/TheDotProtocol/tauos/releases/download/${TAUMAIL_MOBILE_RELEASE_TAG}`;

export const tauMailMobileDownloads = {
  android: {
    id: 'taumail-android-apk',
    label: 'Tau Mail for Android',
    shortLabel: 'Android',
    buttonLabel: 'Download for Android',
    filename: 'TauMail-1.0.0-beta.apk',
    url: `${TAUMAIL_MOBILE_RELEASE_BASE}/TauMail-1.0.0-beta.apk`,
    packageName: 'com.taumail.mobile',
    sizeLabel: '~45 MB',
    available: true,
    badge: 'Public Beta',
    description:
      'Install the APK on your phone. Sign in with your @taumail.org account — push notifications, inbox, calendar, and contacts sync with webmail.',
  },
  ios: {
    id: 'taumail-ios-ipa',
    label: 'Tau Mail for iOS',
    shortLabel: 'iOS',
    buttonLabel: 'Download for iOS',
    filename: 'TauMail-1.0.0-beta.ipa',
    url: `${TAUMAIL_MOBILE_RELEASE_BASE}/TauMail-1.0.0-beta.ipa`,
    bundleId: 'com.taumail.mobile',
    sizeLabel: '~52 MB',
    available: true,
    badge: 'Public Beta',
    description:
      'Native iPhone app with inbox sync, calendar, contacts, and in-app notifications. Remote push when the app is open; full background push after APNs is configured.',
    note: 'com.taumail.mobile · iPhone',
  },
  webmailUrl: '/taumail/login',
} as const;

export type TauMailMobilePlatform = 'android' | 'ios';
