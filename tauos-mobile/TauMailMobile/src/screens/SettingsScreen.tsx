import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [biometricEnabled, setBiometricEnabled] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#667eea" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-right" size={24} color="#666" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem(
              'account-circle',
              'Profile',
              user?.email,
              () => Alert.alert('Profile', 'Profile settings coming soon')
            )}
            {renderSettingItem(
              'security',
              'Security',
              'Biometric, passwords, encryption',
              () => Alert.alert('Security', 'Security settings coming soon')
            )}
            {renderSettingItem(
              'storage',
              'Storage',
              'Manage email storage and cache',
              () => Alert.alert('Storage', 'Storage settings coming soon')
            )}
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem(
              'fingerprint',
              'Biometric Authentication',
              'Use fingerprint or face ID',
              undefined,
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#333', true: '#667eea' }}
                thumbColor={biometricEnabled ? '#ffffff' : '#666'}
              />
            )}
            {renderSettingItem(
              'notifications',
              'Push Notifications',
              'Get notified of new emails',
              undefined,
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#333', true: '#667eea' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#666'}
              />
            )}
            {renderSettingItem(
              'sync',
              'Auto Sync',
              'Automatically sync emails',
              undefined,
              <Switch
                value={autoSyncEnabled}
                onValueChange={setAutoSyncEnabled}
                trackColor={{ false: '#333', true: '#667eea' }}
                thumbColor={autoSyncEnabled ? '#ffffff' : '#666'}
              />
            )}
            {renderSettingItem(
              'lock',
              'Encryption',
              'End-to-end encryption settings',
              () => Alert.alert('Encryption', 'Encryption settings coming soon')
            )}
          </View>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem(
              'palette',
              'Theme',
              'Dark mode, light mode, auto',
              () => Alert.alert('Theme', 'Theme settings coming soon')
            )}
            {renderSettingItem(
              'language',
              'Language',
              'English',
              () => Alert.alert('Language', 'Language settings coming soon')
            )}
            {renderSettingItem(
              'help',
              'Help & Support',
              'Get help and contact support',
              () => Alert.alert('Help', 'Help and support coming soon')
            )}
            {renderSettingItem(
              'info',
              'About',
              'Version 1.0.0 • TauOS',
              () => Alert.alert('About', 'TauMail v1.0.0\nPowered by TauOS\nZero Telemetry')
            )}
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#ff4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Icon name="security" size={16} color="#667eea" />
          <Text style={styles.privacyText}>
            Your data is encrypted and never shared with third parties
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  signOutText: {
    fontSize: 16,
    color: '#ff4444',
    marginLeft: 8,
    fontWeight: '600',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
  },
});

export default SettingsScreen; 