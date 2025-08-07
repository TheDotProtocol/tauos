import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { TauColors, PrimaryButton, GlassCard, TauInput } from '../components/TauUIComponents';
import { useHapticFeedback } from '../hooks/useTauAnimations';

const { width, height } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isFavorite: boolean;
}

interface Call {
  id: string;
  number: string;
  name?: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: number;
  timestamp: Date;
}

const PhoneApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dialer' | 'contacts' | 'recents' | 'favorites'>('dialer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'John Doe', phone: '+1-555-0123', isFavorite: true },
    { id: '2', name: 'Jane Smith', phone: '+1-555-0456', isFavorite: true },
    { id: '3', name: 'Bob Johnson', phone: '+1-555-0789', isFavorite: false },
  ]);
  const [callHistory, setCallHistory] = useState<Call[]>([
    { id: '1', number: '+1-555-0123', name: 'John Doe', type: 'outgoing', duration: 120, timestamp: new Date() },
    { id: '2', number: '+1-555-0456', name: 'Jane Smith', type: 'incoming', duration: 45, timestamp: new Date() },
  ]);

  const hapticFeedback = useHapticFeedback();

  const dialPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const handleNumberPress = (num: string) => {
    hapticFeedback.trigger('impactLight');
    setPhoneNumber(prev => prev + num);
  };

  const handleDelete = () => {
    hapticFeedback.trigger('impactLight');
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (!phoneNumber) return;
    
    hapticFeedback.trigger('impactMedium');
    setIsCallActive(true);
    setCurrentCall({
      id: Date.now().toString(),
      number: phoneNumber,
      type: 'outgoing',
      duration: 0,
      timestamp: new Date()
    });
    
    Alert.alert('Calling...', `Initiating call to ${phoneNumber}`);
  };

  const handleEndCall = () => {
    hapticFeedback.trigger('impactHeavy');
    setIsCallActive(false);
    setCurrentCall(null);
    setPhoneNumber('');
    
    if (currentCall) {
      setCallHistory(prev => [currentCall, ...prev]);
    }
  };

  const handleVideoCall = () => {
    if (!phoneNumber) return;
    
    hapticFeedback.trigger('impactMedium');
    Alert.alert('Video Call', `Starting video call to ${phoneNumber}`);
  };

  const renderDialer = () => (
    <View style={styles.dialerContainer}>
      <View style={styles.phoneNumberDisplay}>
        <Text style={styles.phoneNumber}>{phoneNumber || 'Enter number'}</Text>
        {phoneNumber.length > 0 && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>⌫</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.dialPad}>
        {dialPad.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.dialRow}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.dialButton}
                onPress={() => handleNumberPress(num)}
              >
                <Text style={styles.dialButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.callButtons}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <LinearGradient
            colors={[TauColors.success, '#22c55e']}
            style={styles.callButtonGradient}
          >
            <Text style={styles.callButtonText}>📞</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.videoCallButton} onPress={handleVideoCall}>
          <LinearGradient
            colors={[TauColors.primary, '#8b5cf6']}
            style={styles.callButtonGradient}
          >
            <Text style={styles.callButtonText}>📹</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContacts = () => (
    <ScrollView style={styles.contactsContainer}>
      {contacts.map(contact => (
        <TouchableOpacity
          key={contact.id}
          style={styles.contactItem}
          onPress={() => setPhoneNumber(contact.phone)}
        >
          <View style={styles.contactAvatar}>
            <Text style={styles.contactInitial}>{contact.name[0]}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactPhone}>{contact.phone}</Text>
          </View>
          <TouchableOpacity style={styles.callContactButton}>
            <Text style={styles.callContactText}>📞</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderRecents = () => (
    <ScrollView style={styles.recentsContainer}>
      {callHistory.map(call => (
        <TouchableOpacity
          key={call.id}
          style={styles.recentItem}
          onPress={() => setPhoneNumber(call.number)}
        >
          <View style={styles.recentIcon}>
            <Text style={[
              styles.recentIconText,
              call.type === 'incoming' ? styles.incomingCall : 
              call.type === 'outgoing' ? styles.outgoingCall : styles.missedCall
            ]}>
              {call.type === 'incoming' ? '↓' : call.type === 'outgoing' ? '↑' : '✕'}
            </Text>
          </View>
          <View style={styles.recentInfo}>
            <Text style={styles.recentName}>{call.name || call.number}</Text>
            <Text style={styles.recentTime}>{call.timestamp.toLocaleDateString()}</Text>
          </View>
          <Text style={styles.recentDuration}>{Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFavorites = () => (
    <ScrollView style={styles.favoritesContainer}>
      {contacts.filter(c => c.isFavorite).map(contact => (
        <TouchableOpacity
          key={contact.id}
          style={styles.favoriteItem}
          onPress={() => setPhoneNumber(contact.phone)}
        >
          <View style={styles.favoriteAvatar}>
            <Text style={styles.favoriteInitial}>{contact.name[0]}</Text>
          </View>
          <View style={styles.favoriteInfo}>
            <Text style={styles.favoriteName}>{contact.name}</Text>
            <Text style={styles.favoritePhone}>{contact.phone}</Text>
          </View>
          <View style={styles.favoriteActions}>
            <TouchableOpacity style={styles.favoriteCallButton}>
              <Text style={styles.favoriteCallText}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteVideoButton}>
              <Text style={styles.favoriteCallText}>📹</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phone</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Active Call Display */}
      {isCallActive && currentCall && (
        <GlassCard style={styles.activeCallCard}>
          <Text style={styles.activeCallTitle}>Active Call</Text>
          <Text style={styles.activeCallNumber}>{currentCall.number}</Text>
          <Text style={styles.activeCallDuration}>00:00</Text>
          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <Text style={styles.endCallText}>End Call</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'dialer', label: 'Dialer', icon: '⌨️' },
          { key: 'contacts', label: 'Contacts', icon: '👥' },
          { key: 'recents', label: 'Recents', icon: '📞' },
          { key: 'favorites', label: 'Favorites', icon: '⭐' },
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

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'dialer' && renderDialer()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'recents' && renderRecents()}
        {activeTab === 'favorites' && renderFavorites()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TauColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: TauColors.text,
  },
  settingsButton: {
    padding: 8,
  },
  settingsText: {
    fontSize: 20,
  },
  activeCallCard: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  activeCallTitle: {
    fontSize: 16,
    color: TauColors.textSecondary,
    marginBottom: 8,
  },
  activeCallNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: TauColors.text,
    marginBottom: 4,
  },
  activeCallDuration: {
    fontSize: 18,
    color: TauColors.textSecondary,
    marginBottom: 16,
  },
  endCallButton: {
    backgroundColor: TauColors.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  endCallText: {
    color: TauColors.text,
    fontWeight: '600',
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
  tabContent: {
    flex: 1,
    margin: 20,
  },
  dialerContainer: {
    flex: 1,
  },
  phoneNumberDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  phoneNumber: {
    fontSize: 32,
    fontWeight: '600',
    color: TauColors.text,
    marginRight: 12,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
    color: TauColors.textSecondary,
  },
  dialPad: {
    flex: 1,
    justifyContent: 'center',
  },
  dialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dialButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dialButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: TauColors.text,
  },
  callButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  callButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  videoCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  callButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    fontSize: 32,
  },
  contactsContainer: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: TauColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: TauColors.text,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
  },
  contactPhone: {
    fontSize: 14,
    color: TauColors.textSecondary,
    marginTop: 2,
  },
  callContactButton: {
    padding: 8,
  },
  callContactText: {
    fontSize: 20,
  },
  recentsContainer: {
    flex: 1,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recentIconText: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomingCall: {
    color: TauColors.success,
  },
  outgoingCall: {
    color: TauColors.primary,
  },
  missedCall: {
    color: TauColors.error,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
  },
  recentTime: {
    fontSize: 14,
    color: TauColors.textSecondary,
    marginTop: 2,
  },
  recentDuration: {
    fontSize: 14,
    color: TauColors.textSecondary,
  },
  favoritesContainer: {
    flex: 1,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  favoriteAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TauColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  favoriteInitial: {
    fontSize: 24,
    fontWeight: '600',
    color: TauColors.text,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: '600',
    color: TauColors.text,
  },
  favoritePhone: {
    fontSize: 14,
    color: TauColors.textSecondary,
    marginTop: 2,
  },
  favoriteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  favoriteCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteVideoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteCallText: {
    fontSize: 16,
  },
});

export default PhoneApp; 