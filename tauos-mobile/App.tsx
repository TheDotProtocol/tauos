import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import TauNavigation from './src/navigation/TauNavigation';
import { VoiceControlProvider } from './src/accessibility/TauAccessibility';
import { TauColors } from './src/components/TauUIComponents';

const App = () => {
  return (
    <Provider store={store}>
      <VoiceControlProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={TauColors.background}
          translucent={true}
        />
        <TauNavigation />
      </VoiceControlProvider>
    </Provider>
  );
};

export default App;
