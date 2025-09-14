import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AccessibilityInfo,
  Platform,
  TextInput,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { TauColors } from '../components/TauUIComponents';

// Haptic feedback hook
const useHapticFeedback = () => {
  const trigger = (type: 'impactLight' | 'impactMedium' | 'impactHeavy') => {
    ReactNativeHapticFeedback.trigger(type);
  };
  return { trigger };
};

// Accessibility Manager
export class TauAccessibilityManager {
  private static instance: TauAccessibilityManager;
  private isScreenReaderEnabled: boolean = false;
  private isHighContrastEnabled: boolean = false;
  private isVoiceControlEnabled: boolean = false;

  static getInstance(): TauAccessibilityManager {
    if (!TauAccessibilityManager.instance) {
      TauAccessibilityManager.instance = new TauAccessibilityManager();
    }
    return TauAccessibilityManager.instance;
  }

  async initialize() {
    // Check screen reader status
    this.isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    
    // Listen for screen reader changes
    AccessibilityInfo.addEventListener('screenReaderChanged', (isEnabled) => {
      this.isScreenReaderEnabled = isEnabled;
    });

    // Check for high contrast mode (iOS)
    if (Platform.OS === 'ios') {
      // Note: highContrastChanged is not available in React Native
      // This would need to be implemented differently
    }
  }

  isScreenReaderActive(): boolean {
    return this.isScreenReaderEnabled;
  }

  isHighContrastActive(): boolean {
    return this.isHighContrastEnabled;
  }

  announceForAccessibility(announcement: string) {
    if (this.isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(announcement);
    }
  }

  setAccessibilityFocus(ref: any) {
    if (this.isScreenReaderEnabled && ref) {
      AccessibilityInfo.setAccessibilityFocus(ref);
    }
  }
}

// Enhanced Touchable Component with Accessibility
export const AccessibleTouchable: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'image' | 'keyboardkey' | 'text' | 'adjustable' | 'imagebutton' | 'header' | 'summary' | 'alert' | 'checkbox' | 'combobox' | 'menu' | 'menubar' | 'menuitem' | 'progressbar' | 'radio' | 'radiogroup' | 'scrollbar' | 'searchbox' | 'spinbutton' | 'switch' | 'tab' | 'tablist' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treeitem' | 'grid' | 'columnheader' | 'rowheader' | 'cell' | 'definition' | 'term' | 'banner' | 'complementary' | 'contentinfo' | 'form' | 'main' | 'navigation' | 'region' | 'search' | 'section' | 'sectionhead' | 'article' | 'aside' | 'blockquote' | 'caption' | 'code' | 'definition' | 'deletion' | 'emphasis' | 'figure' | 'generic' | 'insertion' | 'landmark' | 'log' | 'marquee' | 'math' | 'meter' | 'note' | 'presentation' | 'separator' | 'strong' | 'subscript' | 'superscript' | 'time' | 'tooltip';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
  style?: any;
}> = ({ 
  children, 
  onPress, 
  accessibilityLabel, 
  accessibilityHint, 
  accessibilityRole = 'button',
  accessibilityState,
  style 
}) => {
  const hapticFeedback = useHapticFeedback();
  const accessibilityManager = TauAccessibilityManager.getInstance();

  const handlePress = () => {
    hapticFeedback.trigger('impactLight');
    accessibilityManager.announceForAccessibility(accessibilityLabel);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole as any}
      accessibilityState={accessibilityState}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

// Enhanced Text Component with Accessibility
export const AccessibleText: React.FC<{
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: 'text' | 'header' | 'link' | 'adjustable' | 'image' | 'keyboardkey' | 'button' | 'imagebutton' | 'summary' | 'alert' | 'checkbox' | 'combobox' | 'menu' | 'menubar' | 'menuitem' | 'progressbar' | 'radio' | 'radiogroup' | 'scrollbar' | 'searchbox' | 'spinbutton' | 'switch' | 'tab' | 'tablist' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treeitem' | 'grid' | 'columnheader' | 'rowheader' | 'cell' | 'definition' | 'term' | 'banner' | 'complementary' | 'contentinfo' | 'form' | 'main' | 'navigation' | 'region' | 'search' | 'section' | 'sectionhead' | 'article' | 'aside' | 'blockquote' | 'caption' | 'code' | 'definition' | 'deletion' | 'emphasis' | 'figure' | 'generic' | 'insertion' | 'landmark' | 'log' | 'marquee' | 'math' | 'meter' | 'note' | 'presentation' | 'separator' | 'strong' | 'subscript' | 'superscript' | 'time' | 'tooltip';
  style?: any;
}> = ({ children, accessibilityLabel, accessibilityRole = 'text', style }) => {
  return (
    <Text
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole as any}
      style={style}
    >
      {children}
    </Text>
  );
};

// High Contrast Theme
export const getHighContrastColors = () => {
  const accessibilityManager = TauAccessibilityManager.getInstance();
  
  if (accessibilityManager.isHighContrastActive()) {
    return {
      primary: '#ffffff',
      secondary: '#000000',
      accent: '#ffff00',
      background: '#000000',
      surface: '#ffffff',
      text: '#ffffff',
      textSecondary: '#ffff00',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
    };
  }
  
  return TauColors;
};

// Voice Control Support
export const VoiceControlProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const accessibilityManager = TauAccessibilityManager.getInstance();

  React.useEffect(() => {
    accessibilityManager.initialize();
  }, []);

  return <>{children}</>;
};

// Accessibility Announcement Hook
export const useAccessibilityAnnouncement = () => {
  const accessibilityManager = TauAccessibilityManager.getInstance();

  const announce = (message: string) => {
    accessibilityManager.announceForAccessibility(message);
  };

  const announceSuccess = (action: string) => {
    announce(`${action} completed successfully`);
  };

  const announceError = (action: string) => {
    announce(`Error: ${action} failed`);
  };

  const announceLoading = (action: string) => {
    announce(`Loading ${action}...`);
  };

  return {
    announce,
    announceSuccess,
    announceError,
    announceLoading,
  };
};

// Accessibility Focus Management Hook
export const useAccessibilityFocus = () => {
  const accessibilityManager = TauAccessibilityManager.getInstance();
  const focusRef = React.useRef<any>(null);

  const focus = () => {
    accessibilityManager.setAccessibilityFocus(focusRef.current);
  };

  const announceAndFocus = (announcement: string) => {
    accessibilityManager.announceForAccessibility(announcement);
    setTimeout(focus, 100);
  };

  return {
    focusRef,
    focus,
    announceAndFocus,
  };
};

// Enhanced Form Field with Accessibility
export const AccessibleFormField: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  style?: any;
}> = ({ label, value, onChangeText, placeholder, secureTextEntry = false, error, style }) => {
  const { announce } = useAccessibilityAnnouncement();
  const { focusRef } = useAccessibilityFocus();

  const handleChangeText = (text: string) => {
    onChangeText(text);
    announce(`Typing ${label}: ${text}`);
  };

  const handleFocus = () => {
    announce(`Focused on ${label} field`);
  };

  const handleBlur = () => {
    if (error) {
      announce(`Error in ${label}: ${error}`);
    }
  };

  return (
    <View style={[styles.formField, style]}>
      <AccessibleText
        accessibilityLabel={`${label} field`}
        style={styles.label}
      >
        {label}
      </AccessibleText>
      <TouchableOpacity
        ref={focusRef}
        accessible={true}
        accessibilityLabel={`${label} input field`}
        accessibilityHint={`Enter your ${label.toLowerCase()}`}
        accessibilityRole="text"
        onPress={() => focusRef.current?.focus()}
        style={styles.inputContainer}
      >
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          placeholderTextColor={TauColors.textSecondary}
        />
      </TouchableOpacity>
      {error && (
        <AccessibleText
          accessibilityLabel={`Error: ${error}`}
          style={styles.errorText}
        >
          {error}
        </AccessibleText>
      )}
    </View>
  );
};

// Accessibility Status Bar
export const AccessibilityStatusBar: React.FC = () => {
  const accessibilityManager = TauAccessibilityManager.getInstance();
  const [isScreenReaderActive, setIsScreenReaderActive] = React.useState(false);
  const [isHighContrastActive, setIsHighContrastActive] = React.useState(false);

  React.useEffect(() => {
    const checkAccessibilityStatus = async () => {
      const screenReader = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderActive(screenReader);
      setIsHighContrastActive(accessibilityManager.isHighContrastActive());
    };

    checkAccessibilityStatus();
  }, []);

  if (!isScreenReaderActive && !isHighContrastActive) {
    return null;
  }

  return (
    <View style={styles.statusBar}>
      {isScreenReaderActive && (
        <View style={styles.statusItem}>
          <Text style={styles.statusIcon}>🔊</Text>
          <Text style={styles.statusText}>Screen Reader Active</Text>
        </View>
      )}
      {isHighContrastActive && (
        <View style={styles.statusItem}>
          <Text style={styles.statusIcon}>🎨</Text>
          <Text style={styles.statusText}>High Contrast Mode</Text>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  formField: {
    marginVertical: 8,
  },
  label: {
    color: TauColors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  input: {
    padding: 16,
    color: TauColors.text,
    fontSize: 16,
  },
  errorText: {
    color: TauColors.error,
    fontSize: 14,
    marginTop: 4,
  },
  statusBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    color: TauColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default {
  TauAccessibilityManager,
  AccessibleTouchable,
  AccessibleText,
  getHighContrastColors,
  VoiceControlProvider,
  useAccessibilityAnnouncement,
  useAccessibilityFocus,
  AccessibleFormField,
  AccessibilityStatusBar,
}; 