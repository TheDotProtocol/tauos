import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  fetchIdentitiesStart,
  fetchIdentitiesSuccess,
  fetchIdentitiesFailure,
  Identity,
  IdentityClaim,
  Device,
} from '../store/slices/identitySlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const IdentityHomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { currentIdentity, identities, claims, devices, isLoading } = useSelector((state: RootState) => state.identity);

  useEffect(() => {
    loadIdentities();
  }, []);

  const loadIdentities = async () => {
    dispatch(fetchIdentitiesStart());
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockIdentities: Identity[] = [
        {
          id: '1',
          did: 'did:web:tauos.org:user:123',
          name: 'John Doe',
          email: 'john@tauos.org',
          avatar: undefined,
          publicKey: '04a8b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
          verified: true,
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          lastUsed: new Date().toISOString(),
        },
      ];

      const mockClaims: IdentityClaim[] = [
        {
          id: '1',
          type: 'email',
          value: 'john@tauos.org',
          issuer: 'tauos.org',
          verified: true,
          issuedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
        {
          id: '2',
          type: 'name',
          value: 'John Doe',
          issuer: 'tauos.org',
          verified: true,
          issuedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
        {
          id: '3',
          type: 'age',
          value: '25',
          issuer: 'government.gov',
          verified: true,
          issuedAt: new Date(Date.now() - 86400000 * 365).toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 365 * 10).toISOString(),
        },
      ];

      const mockDevices: Device[] = [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          type: 'mobile',
          lastActive: new Date().toISOString(),
          isCurrent: true,
          publicKey: '04a8b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
        },
        {
          id: '2',
          name: 'MacBook Pro',
          type: 'desktop',
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          isCurrent: false,
          publicKey: '04b8c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9',
        },
      ];
      
      dispatch(fetchIdentitiesSuccess(mockIdentities));
    } catch (error) {
      dispatch(fetchIdentitiesFailure('Failed to load identities'));
    }
  };

  const handleCreateIdentity = () => {
    navigation.navigate('CreateIdentityScreen');
  };

  const handleManageClaims = () => {
    navigation.navigate('ClaimsScreen');
  };

  const handleManageDevices = () => {
    navigation.navigate('DevicesScreen');
  };

  const handleBackupIdentity = () => {
    Alert.alert(
      'Backup Identity',
      'Your identity will be encrypted and backed up securely.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Backup', onPress: () => {
          Alert.alert('Success', 'Identity backed up successfully!');
        }}
      ]
    );
  };

  const handleExportIdentity = () => {
    Alert.alert(
      'Export Identity',
      'Export your identity for use on other devices?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Success', 'Identity exported successfully!');
        }}
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getVerificationStatus = (): { color: string; text: string } => {
    if (!currentIdentity) return { color: '#666', text: 'No Identity' };
    return currentIdentity.verified 
      ? { color: '#4CAF50', text: 'Verified' }
      : { color: '#FF9800', text: 'Unverified' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TauID</Text>
          <Text style={styles.headerSubtitle}>Decentralized Identity</Text>
        </View>

        {/* Current Identity Card */}
        {currentIdentity && (
          <View style={styles.identityCard}>
            <LinearGradient
              colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
              style={styles.identityGradient}
            >
              <View style={styles.identityHeader}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {currentIdentity.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.identityInfo}>
                  <Text style={styles.identityName}>{currentIdentity.name}</Text>
                  <Text style={styles.identityEmail}>{currentIdentity.email}</Text>
                  <View style={styles.verificationStatus}>
                    <Icon name="verified" size={16} color={getVerificationStatus().color} />
                    <Text style={[styles.verificationText, { color: getVerificationStatus().color }]}>
                      {getVerificationStatus().text}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.identityDetails}>
                <Text style={styles.didText} numberOfLines={1}>
                  {currentIdentity.did}
                </Text>
                <Text style={styles.lastUsedText}>
                  Last used: {formatDate(currentIdentity.lastUsed)}
                </Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleCreateIdentity}>
              <Icon name="person-add" size={24} color="#667eea" />
              <Text style={styles.actionText}>Create Identity</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleManageClaims}>
              <Icon name="verified-user" size={24} color="#667eea" />
              <Text style={styles.actionText}>Manage Claims</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleManageDevices}>
              <Icon name="devices" size={24} color="#667eea" />
              <Text style={styles.actionText}>Manage Devices</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleBackupIdentity}>
              <Icon name="backup" size={24} color="#667eea" />
              <Text style={styles.actionText}>Backup Identity</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Claims Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity Claims</Text>
          <View style={styles.claimsContainer}>
            {claims.slice(0, 3).map((claim) => (
              <View key={claim.id} style={styles.claimItem}>
                <View style={styles.claimHeader}>
                  <Text style={styles.claimType}>{claim.type}</Text>
                  {claim.verified && (
                    <Icon name="verified" size={16} color="#4CAF50" />
                  )}
                </View>
                <Text style={styles.claimValue}>{claim.value}</Text>
                <Text style={styles.claimIssuer}>Issued by: {claim.issuer}</Text>
              </View>
            ))}
            {claims.length > 3 && (
              <TouchableOpacity style={styles.viewMoreButton} onPress={handleManageClaims}>
                <Text style={styles.viewMoreText}>View all {claims.length} claims</Text>
                <Icon name="chevron-right" size={16} color="#667eea" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Devices Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Devices</Text>
          <View style={styles.devicesContainer}>
            {devices.slice(0, 2).map((device) => (
              <View key={device.id} style={styles.deviceItem}>
                <Icon 
                  name={device.type === 'mobile' ? 'smartphone' : 'computer'} 
                  size={20} 
                  color="#999" 
                />
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceLastActive}>
                    Last active: {formatDate(device.lastActive)}
                  </Text>
                </View>
                {device.isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentText}>Current</Text>
                  </View>
                )}
              </View>
            ))}
            {devices.length > 2 && (
              <TouchableOpacity style={styles.viewMoreButton} onPress={handleManageDevices}>
                <Text style={styles.viewMoreText}>View all {devices.length} devices</Text>
                <Icon name="chevron-right" size={16} color="#667eea" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.securityContainer}>
            <TouchableOpacity style={styles.securityItem}>
              <Icon name="fingerprint" size={20} color="#667eea" />
              <Text style={styles.securityText}>Biometric Authentication</Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.securityItem}>
              <Icon name="lock" size={20} color="#667eea" />
              <Text style={styles.securityText}>Auto Lock Settings</Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.securityItem} onPress={handleExportIdentity}>
              <Icon name="file-download" size={20} color="#667eea" />
              <Text style={styles.securityText}>Export Identity</Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          </View>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 4,
  },
  identityCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  identityGradient: {
    padding: 20,
  },
  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  identityInfo: {
    flex: 1,
  },
  identityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  identityEmail: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  identityDetails: {
    marginTop: 12,
  },
  didText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  lastUsedText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  actionCard: {
    width: (width - 64) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
  claimsContainer: {
    paddingHorizontal: 16,
  },
  claimItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  claimType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'uppercase',
  },
  claimValue: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  claimIssuer: {
    fontSize: 12,
    color: '#999',
  },
  devicesContainer: {
    paddingHorizontal: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  deviceLastActive: {
    fontSize: 12,
    color: '#999',
  },
  currentBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currentText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#667eea',
    marginRight: 4,
  },
  securityContainer: {
    paddingHorizontal: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  securityText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
});

export default IdentityHomeScreen; 