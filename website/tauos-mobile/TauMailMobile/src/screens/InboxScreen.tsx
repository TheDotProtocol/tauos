import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  fetchEmailsStart,
  fetchEmailsSuccess,
  fetchEmailsFailure,
  markEmailAsRead,
  toggleEmailStar,
  setSearchQuery,
  Email,
} from '../store/slices/emailSlice';
import { logout } from '../store/slices/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const InboxScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { emails, isLoading, searchQuery } = useSelector((state: RootState) => state.email);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    dispatch(fetchEmailsStart());
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEmails: Email[] = [
        {
          id: '1',
          from: 'welcome@tauos.org',
          to: [user?.email || 'user@tauos.org'],
          subject: 'Welcome to TauMail! 🎉',
          body: 'Welcome to your new privacy-first email experience. Your data is encrypted and never shared.',
          timestamp: new Date().toISOString(),
          isRead: false,
          isStarred: true,
          folder: 'inbox',
          encryptionStatus: 'encrypted',
        },
        {
          id: '2',
          from: 'security@tauos.org',
          to: [user?.email || 'user@tauos.org'],
          subject: 'Your account is secure',
          body: 'Your TauMail account has been secured with end-to-end encryption.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
          isStarred: false,
          folder: 'inbox',
          encryptionStatus: 'encrypted',
        },
        {
          id: '3',
          from: 'support@tauos.org',
          to: [user?.email || 'user@tauos.org'],
          subject: 'Getting started with TauMail',
          body: 'Learn how to use all the privacy features in your new email client.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isRead: true,
          isStarred: false,
          folder: 'inbox',
          encryptionStatus: 'encrypted',
        },
      ];
      
      dispatch(fetchEmailsSuccess(mockEmails));
    } catch (error) {
      dispatch(fetchEmailsFailure('Failed to load emails'));
    }
  };

  const handleEmailPress = (email: Email) => {
    dispatch(markEmailAsRead(email.id));
    navigation.navigate('EmailDetail', { email });
  };

  const handleStarPress = (emailId: string) => {
    dispatch(toggleEmailStar(emailId));
  };

  const handleCompose = () => {
    navigation.navigate('Compose');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

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

  const renderEmailItem = ({ item }: { item: Email }) => (
    <TouchableOpacity
      style={[
        styles.emailItem,
        !item.isRead && styles.unreadEmail,
        selectedEmails.includes(item.id) && styles.selectedEmail,
      ]}
      onPress={() => handleEmailPress(item)}
      onLongPress={() => {
        setSelectedEmails(prev => 
          prev.includes(item.id) 
            ? prev.filter(id => id !== item.id)
            : [...prev, item.id]
        );
      }}
    >
      <View style={styles.emailHeader}>
        <View style={styles.emailInfo}>
          <Text style={[styles.sender, !item.isRead && styles.unreadText]}>
            {item.from}
          </Text>
          <Text style={[styles.timestamp, !item.isRead && styles.unreadText]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleStarPress(item.id)}
          style={styles.starButton}
        >
          <Icon
            name={item.isStarred ? 'star' : 'star-border'}
            size={20}
            color={item.isStarred ? '#667eea' : '#666'}
          />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.subject, !item.isRead && styles.unreadText]}>
        {item.subject}
      </Text>
      
      <Text style={styles.preview} numberOfLines={2}>
        {item.body}
      </Text>
      
      {item.encryptionStatus === 'encrypted' && (
        <View style={styles.encryptionBadge}>
          <Icon name="lock" size={12} color="#667eea" />
          <Text style={styles.encryptionText}>Encrypted</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Inbox</Text>
          <Text style={styles.emailCount}>{emails.length} emails</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleCompose} style={styles.composeButton}>
            <Icon name="edit" size={24} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
            <Icon name="settings" size={24} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="logout" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search emails..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
      </View>

      {/* Email List */}
      <FlatList
        data={emails}
        renderItem={renderEmailItem}
        keyExtractor={(item) => item.id}
        style={styles.emailList}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadEmails}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCompose}>
        <Icon name="edit" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emailCount: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  composeButton: {
    padding: 8,
    marginRight: 8,
  },
  settingsButton: {
    padding: 8,
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  emailList: {
    flex: 1,
  },
  emailItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  unreadEmail: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  selectedEmail: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emailInfo: {
    flex: 1,
  },
  sender: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  starButton: {
    padding: 4,
  },
  subject: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  encryptionText: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default InboxScreen; 