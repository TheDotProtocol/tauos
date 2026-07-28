import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'tauos_token';
const USER_KEY = 'tauos_user';

export type TauUser = {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  fullName: string;
  avatarUrl?: string | null;
};

export async function saveSession(token: string, user: TauUser) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function loadSession(): Promise<{ token: string; user: TauUser } | null> {
  const [[, token], [, userJson]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  if (!token || !userJson) return null;
  try {
    return { token, user: JSON.parse(userJson) as TauUser };
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
