import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus(): { online: boolean } {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected));
    });
    NetInfo.fetch().then((state) => setOnline(Boolean(state.isConnected)));
    return () => unsub();
  }, []);

  return { online };
}
