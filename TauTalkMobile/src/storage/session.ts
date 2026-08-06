import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'tauos_token';
const REFRESH_KEY = 'tauos_refresh';
const USER_KEY = 'tauos_user';

export type TauUser = {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  fullName: string;
  avatarUrl?: string | null;
};

export async function saveSession(token: string, user: TauUser, refreshToken?: string) {
  const pairs: [string, string][] = [
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ];
  if (refreshToken) {
    pairs.push([REFRESH_KEY, refreshToken]);
  }
  await AsyncStorage.multiSet(pairs);
}

export async function loadSession(): Promise<{ token: string; refreshToken: string | null; user: TauUser } | null> {
  const [[, token], [, refreshToken], [, userJson]] = await AsyncStorage.multiGet([
    TOKEN_KEY,
    REFRESH_KEY,
    USER_KEY,
  ]);
  if (!token || !userJson) return null;
  try {
    return { token, refreshToken: refreshToken || null, user: JSON.parse(userJson) as TauUser };
  } catch {
    return null;
  }
}

export async function updateAccessToken(token: string, refreshToken?: string) {
  const pairs: [string, string][] = [[TOKEN_KEY, token]];
  if (refreshToken) pairs.push([REFRESH_KEY, refreshToken]);
  await AsyncStorage.multiSet(pairs);
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_KEY);
}
