/**
 * Tau Launcher — M7.0 scaffold entry
 */
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createFoundationRegistry } from '@tau/core';
import { tauTheme } from '@tau/mobile-design';
import { TauHomeScreen } from './screens/TauHomeScreen';

const registry = createFoundationRegistry();

function App(): React.JSX.Element {
  useEffect(() => {
    void registry.initializeAll({
      platform: { kind: 'aosp-beta', version: '1.0.0', channel: 'beta' },
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={tauTheme.colors.launcher.screen}
        translucent
      />
      <TauHomeScreen />
    </SafeAreaProvider>
  );
}

export default App;
