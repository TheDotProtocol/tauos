import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';

type FirebaseServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

type AccessTokenCache = {
  accessToken: string;
  expiresAt: number;
};

const FCM_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

let serviceAccountCache: FirebaseServiceAccount | null | undefined;
let accessTokenCache: AccessTokenCache | null = null;

function parseServiceAccount(raw: string): FirebaseServiceAccount | null {
  try {
    const parsed = JSON.parse(raw) as Partial<FirebaseServiceAccount>;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      return null;
    }
    return {
      project_id: parsed.project_id,
      client_email: parsed.client_email,
      private_key: parsed.private_key,
    };
  } catch {
    return null;
  }
}

export function loadFirebaseServiceAccount(): FirebaseServiceAccount | null {
  if (serviceAccountCache !== undefined) {
    return serviceAccountCache;
  }

  const inlineJson = process.env.FCM_SERVICE_ACCOUNT_JSON?.trim();
  if (inlineJson) {
    serviceAccountCache = parseServiceAccount(inlineJson);
    return serviceAccountCache;
  }

  const credentialsPath =
    process.env.FCM_SERVICE_ACCOUNT_PATH?.trim() ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

  if (credentialsPath) {
    try {
      serviceAccountCache = parseServiceAccount(readFileSync(credentialsPath, 'utf8'));
      return serviceAccountCache;
    } catch (error) {
      console.warn('[push] Failed to read FCM service account file:', error);
      serviceAccountCache = null;
      return null;
    }
  }

  serviceAccountCache = null;
  return null;
}

export function isFcmV1Configured(): boolean {
  return loadFirebaseServiceAccount() !== null;
}

export function isRemotePushConfigured(): boolean {
  return isFcmV1Configured() || Boolean(process.env.FCM_SERVER_KEY?.trim());
}

async function getFcmAccessToken(account: FirebaseServiceAccount): Promise<string | null> {
  const now = Date.now();
  if (accessTokenCache && accessTokenCache.expiresAt > now + 60_000) {
    return accessTokenCache.accessToken;
  }

  const issuedAt = Math.floor(now / 1000);
  const assertion = jwt.sign(
    {
      iss: account.client_email,
      sub: account.client_email,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + 3600,
      scope: FCM_SCOPE,
    },
    account.private_key,
    { algorithm: 'RS256' },
  );

  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    });

    if (!res.ok) {
      console.warn('[push] FCM token exchange failed:', await res.text());
      return null;
    }

    const payload = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!payload.access_token) return null;

    accessTokenCache = {
      accessToken: payload.access_token,
      expiresAt: now + (payload.expires_in ?? 3600) * 1000,
    };
    return payload.access_token;
  } catch (error) {
    console.warn('[push] FCM token exchange error:', error);
    return null;
  }
}

export async function sendFcmV1Notification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<boolean> {
  const account = loadFirebaseServiceAccount();
  if (!account) return false;

  const accessToken = await getFcmAccessToken(account);
  if (!accessToken) return false;

  const stringData = Object.fromEntries(
    Object.entries(data ?? {}).map(([key, value]) => [key, String(value)]),
  );

  try {
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${account.project_id}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            token,
            notification: { title, body },
            data: stringData,
            android: { priority: 'HIGH' },
            apns: {
              payload: {
                aps: { sound: 'default' },
              },
            },
          },
        }),
      },
    );

    if (!res.ok) {
      console.warn('[push] FCM v1 send failed:', await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.warn('[push] FCM v1 error:', error);
    return false;
  }
}
