import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { TauColors, PrimaryButton, GlassCard, TauInput } from '../components/TauUIComponents';
import { useHapticFeedback } from '../hooks/useTauAnimations';

const { width, height } = Dimensions.get('window');

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'select' | 'input' | 'button' | 'info';
  value?: boolean | string;
  icon: string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

const SettingsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'privacy' | 'network' | 'apps' | 'about'>('general');
  const [settings, setSettings] = useState({
    // General
    darkMode: true,
    autoBrightness: false,
    hapticFeedback: true,
    soundEffects: true,
    language: 'English',
    
    // Privacy
    locationServices: false,
    analytics: false,
    telemetry: false,
    encryption: true,
    biometricAuth: true,
    
    // Network
    wifi: true,
    mobileData: true,
    bluetooth: false,
    airplaneMode: false,
    
    // Apps
    notifications: true,
    autoUpdate: true,
    backgroundRefresh: false,
  });

  const hapticFeedback = useHapticFeedback();

  const handleSettingToggle = (key: string, value: boolean) => {
    hapticFeedback.trigger('impactLight');
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSettingSelect = (key: string, value: string) => {
    hapticFeedback.trigger('impactLight');
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const generalSettings: SettingSection = {
    id: 'general',
    title: 'General',
    items: [
      {
        id: 'darkMode',
        title: 'Dark Mode',
        subtitle: 'Use dark theme',
        type: 'toggle',
        value: settings.darkMode,
        icon: '🌙',
        onToggle: (value) => handleSettingToggle('darkMode', value),
      },
      {
        id: 'autoBrightness',
        title: 'Auto Brightness',
        subtitle: 'Adjust brightness automatically',
        type: 'toggle',
        value: settings.autoBrightness,
        icon: '☀️',
        onToggle: (value) => handleSettingToggle('autoBrightness', value),
      },
      {
        id: 'hapticFeedback',
        title: 'Haptic Feedback',
        subtitle: 'Vibrate on interactions',
        type: 'toggle',
        value: settings.hapticFeedback,
        icon: '📳',
        onToggle: (value) => handleSettingToggle('hapticFeedback', value),
      },
      {
        id: 'soundEffects',
        title: 'Sound Effects',
        subtitle: 'Play system sounds',
        type: 'toggle',
        value: settings.soundEffects,
        icon: '🔊',
        onToggle: (value) => handleSettingToggle('soundEffects', value),
      },
      {
        id: 'language',
        title: 'Language',
        subtitle: settings.language,
        type: 'select',
        value: settings.language,
        icon: '🌐',
        onPress: () => Alert.alert('Language', 'Language selection will appear here'),
      },
    ],
  };

  const privacySettings: SettingSection = {
    id: 'privacy',
    title: 'Privacy & Security',
    items: [
      {
        id: 'locationServices',
        title: 'Location Services',
        subtitle: 'Allow apps to access location',
        type: 'toggle',
        value: settings.locationServices,
        icon: '📍',
        onToggle: (value) => handleSettingToggle('locationServices', value),
      },
      {
        id: 'analytics',
        title: 'Analytics',
        subtitle: 'Share usage data',
        type: 'toggle',
        value: settings.analytics,
        icon: '📊',
        onToggle: (value) => handleSettingToggle('analytics', value),
      },
      {
        id: 'telemetry',
        title: 'Telemetry',
        subtitle: 'Send diagnostic data',
        type: 'toggle',
        value: settings.telemetry,
        icon: '📡',
        onToggle: (value) => handleSettingToggle('telemetry', value),
      },
      {
        id: 'encryption',
        title: 'End-to-End Encryption',
        subtitle: 'Encrypt all communications',
        type: 'toggle',
        value: settings.encryption,
        icon: '🔒',
        onToggle: (value) => handleSettingToggle('encryption', value),
      },
      {
        id: 'biometricAuth',
        title: 'Biometric Authentication',
        subtitle: 'Use fingerprint or face ID',
        type: 'toggle',
        value: settings.biometricAuth,
        icon: '👆',
        onToggle: (value) => handleSettingToggle('biometricAuth', value),
      },
      {
        id: 'privacyReport',
        title: 'Privacy Report',
        subtitle: 'View your privacy status',
        type: 'button',
        icon: '📋',
        onPress: () => Alert.alert('Privacy Report', 'Your privacy report will appear here'),
      },
    ],
  };

  const networkSettings: SettingSection = {
    id: 'network',
    title: 'Network & Connectivity',
    items: [
      {
        id: 'wifi',
        title: 'Wi-Fi',
        subtitle: settings.wifi ? 'Connected' : 'Disconnected',
        type: 'toggle',
        value: settings.wifi,
        icon: '📶',
        onToggle: (value) => handleSettingToggle('wifi', value),
      },
      {
        id: 'mobileData',
        title: 'Mobile Data',
        subtitle: settings.mobileData ? 'Enabled' : 'Disabled',
        type: 'toggle',
        value: settings.mobileData,
        icon: '📱',
        onToggle: (value) => handleSettingToggle('mobileData', value),
      },
      {
        id: 'bluetooth',
        title: 'Bluetooth',
        subtitle: settings.bluetooth ? 'On' : 'Off',
        type: 'toggle',
        value: settings.bluetooth,
        icon: '🔵',
        onToggle: (value) => handleSettingToggle('bluetooth', value),
      },
      {
        id: 'airplaneMode',
        title: 'Airplane Mode',
        subtitle: settings.airplaneMode ? 'On' : 'Off',
        type: 'toggle',
        value: settings.airplaneMode,
        icon: '✈️',
        onToggle: (value) => handleSettingToggle('airplaneMode', value),
      },
      {
        id: 'networkSettings',
        title: 'Network Settings',
        subtitle: 'Configure network preferences',
        type: 'button',
        icon: '⚙️',
        onPress: () => Alert.alert('Network Settings', 'Network configuration will appear here'),
      },
    ],
  };

  const appSettings: SettingSection = {
    id: 'apps',
    title: 'Apps & Notifications',
    items: [
      {
        id: 'notifications',
        title: 'Notifications',
        subtitle: 'Manage app notifications',
        type: 'toggle',
        value: settings.notifications,
        icon: '🔔',
        onToggle: (value) => handleSettingToggle('notifications', value),
      },
      {
        id: 'autoUpdate',
        title: 'Auto Update',
        subtitle: 'Automatically update apps',
        type: 'toggle',
        value: settings.autoUpdate,
        icon: '🔄',
        onToggle: (value) => handleSettingToggle('autoUpdate', value),
      },
      {
        id: 'backgroundRefresh',
        title: 'Background Refresh',
        subtitle: 'Allow apps to refresh in background',
        type: 'toggle',
        value: settings.backgroundRefresh,
        icon: '🔄',
        onToggle: (value) => handleSettingToggle('backgroundRefresh', value),
      },
      {
        id: 'appPermissions',
        title: 'App Permissions',
        subtitle: 'Manage app access',
        type: 'button',
        icon: '🔐',
        onPress: () => Alert.alert('App Permissions', 'Permission management will appear here'),
      },
      {
        id: 'storage',
        title: 'Storage',
        subtitle: 'Manage device storage',
        type: 'button',
        icon: '💾',
        onPress: () => Alert.alert('Storage', 'Storage management will appear here'),
      },
    ],
  };

  const aboutSettings: SettingSection = {
    id: 'about',
    title: 'About',
    items: [
      {
        id: 'version',
        title: 'TauOS Version',
        subtitle: '1.0.0 (Build 100)',
        type: 'info',
        icon: 'ℹ️',
      },
      {
        id: 'device',
        title: 'Device Info',
        subtitle: 'TauOS Mobile Device',
        type: 'info',
        icon: '📱',
      },
      {
        id: 'storage',
        title: 'Storage',
        subtitle: '64GB used of 128GB',
        type: 'info',
        icon: '💾',
      },
      {
        id: 'legal',
        title: 'Legal & Privacy',
        subtitle: 'View legal information',
        type: 'button',
        icon: '📄',
        onPress: () => Alert.alert('Legal', 'Legal information will appear here'),
      },
      {
        id: 'support',
        title: 'Support',
        subtitle: 'Get help and support',
        type: 'button',
        icon: '🆘',
        onPress: () => Alert.alert('Support', 'Support options will appear here'),
      },
    ],
  };

  const sections = {
    general: generalSettings,
    privacy: privacySettings,
    network: networkSettings,
    apps: appSettings,
    about: aboutSettings,
  };

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'info'}
    >
      <View style={styles.settingIcon}>
        <Text style={styles.settingIconText}>{item.icon}</Text>
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      <View style={styles.settingAction}>
        {item.type === 'toggle' && (
          <Switch
            value={item.value as boolean}
            onValueChange={item.onToggle}
            trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: TauColors.primary }}
            thumbColor={item.value ? TauColors.text : 'rgba(255, 255, 255, 0.5)'}
          />
        )}
        {item.type === 'select' && (
          <Text style={styles.settingValue}>{item.value}</Text>
        )}
        {item.type === 'button' && (
          <Text style={styles.settingArrow}>→</Text>
        )}
        {item.type === 'info' && (
          <Text style={styles.settingValue}>{item.value}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: SettingSection) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <GlassCard style={styles.sectionCard}>
        {section.items.map(renderSettingItem)}
      </GlassCard>
    </View>
  );

  const renderPrivacyStatus = () => (
    <View style={styles.privacyStatus}>
      <GlassCard style={styles.privacyCard}>
        <View style={styles.privacyHeader}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyTitle}>Privacy Status</Text>
        </View>
        <View style={styles.privacyMetrics}>
          <View style={styles.privacyMetric}>
            <Text style={styles.privacyMetricValue}>100%</Text>
            <Text style={styles.privacyMetricLabel}>Encrypted</Text>
          </View>
          <View style={styles.privacyMetric}>
            <Text style={styles.privacyMetricValue}>0</Text>
            <Text style={styles.privacyMetricLabel}>Trackers</Text>
          </View>
          <View style={styles.privacyMetric}>
            <Text style={styles.privacyMetricValue}>∞</Text>
            <Text style={styles.privacyMetricLabel}>Privacy</Text>
          </View>
        </View>
        <Text style={styles.privacyDescription}>
          Your data is fully encrypted and no telemetry is collected.
        </Text>
      </GlassCard>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'general', label: 'General', icon: '⚙️' },
          { key: 'privacy', label: 'Privacy', icon: '🔒' },
          { key: 'network', label: 'Network', icon: '📶' },
          { key: 'apps', label: 'Apps', icon: '📱' },
          { key: 'about', label: 'About', icon: 'ℹ️' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'privacy' && renderPrivacyStatus()}
        {renderSection(sections[activeTab])}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TauColors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: TauColors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: TauColors.textSecondary,
  },
  activeTabLabel: {
    color: TauColors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    margin: 20,
    marginTop: 0,
  },
  privacyStatus: {
    marginBottom: 20,
  },
  privacyCard: {
    padding: 20,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TauColors.text,
  },
  privacyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  privacyMetric: {
    alignItems: 'center',
  },
  privacyMetricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: TauColors.primary,
  },
  privacyMetricLabel: {
    fontSize: 12,
    color: TauColors.textSecondary,
    marginTop: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: TauColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
    marginBottom: 12,
  },
  sectionCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingIconText: {
    fontSize: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
  },
  settingSubtitle: {
    fontSize: 14,
    color: TauColors.textSecondary,
    marginTop: 2,
  },
  settingAction: {
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: TauColors.textSecondary,
  },
  settingArrow: {
    fontSize: 16,
    color: TauColors.textSecondary,
  },
});

export default SettingsApp; 