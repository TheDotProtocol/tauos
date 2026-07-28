import { PermissionsAndroid, Platform } from 'react-native';

export async function ensureCallPermissions(video: boolean): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const perms = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
  if (video) {
    perms.push(PermissionsAndroid.PERMISSIONS.CAMERA);
  }

  const results = await PermissionsAndroid.requestMultiple(perms);
  return Object.values(results).every((r) => r === PermissionsAndroid.RESULTS.GRANTED);
}
