import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
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
  email?: string;
  avatar?: string;
  isFavorite: boolean;
  isOnline: boolean;
  lastContact?: Date;
  notes?: string;
  groups: string[];
}

interface ContactGroup {
  id: string;
  name: string;
  color: string;
  contactCount: number;
}

const ContactsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'groups' | 'recent'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const hapticFeedback = useHapticFeedback();

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+1-555-0123',
      email: 'john.doe@example.com',
      isFavorite: true,
      isOnline: true,
      lastContact: new Date(),
      notes: 'Work colleague',
      groups: ['Work', 'Friends'],
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+1-555-0456',
      email: 'jane.smith@example.com',
      isFavorite: true,
      isOnline: false,
      lastContact: new Date(Date.now() - 86400000),
      notes: 'Best friend',
      groups: ['Friends', 'Family'],
    },
    {
      id: '3',
      name: 'Bob Johnson',
      phone: '+1-555-0789',
      email: 'bob.johnson@example.com',
      isFavorite: false,
      isOnline: true,
      lastContact: new Date(Date.now() - 3600000),
      notes: 'Neighbor',
      groups: ['Neighbors'],
    },
    {
      id: '4',
      name: 'Alice Brown',
      phone: '+1-555-0321',
      email: 'alice.brown@example.com',
      isFavorite: false,
      isOnline: false,
      lastContact: new Date(Date.now() - 172800000),
      notes: 'Gym buddy',
      groups: ['Fitness'],
    },
  ]);

  const [groups, setGroups] = useState<ContactGroup[]>([
    { id: '1', name: 'Work', color: '#667eea', contactCount: 1 },
    { id: '2', name: 'Friends', color: '#4ade80', contactCount: 2 },
    { id: '3', name: 'Family', color: '#fbbf24', contactCount: 1 },
    { id: '4', name: 'Neighbors', color: '#f87171', contactCount: 1 },
    { id: '5', name: 'Fitness', color: '#8b5cf6', contactCount: 1 },
  ]);

  const handleContactSelect = (contact: Contact) => {
    hapticFeedback.trigger('impactLight');
    setSelectedContact(contact);
  };

  const handleCall = (contact: Contact) => {
    hapticFeedback.trigger('impactMedium');
    Alert.alert('Call', `Calling ${contact.name} at ${contact.phone}`);
  };

  const handleMessage = (contact: Contact) => {
    hapticFeedback.trigger('impactLight');
    Alert.alert('Message', `Opening chat with ${contact.name}`);
  };

  const handleVideoCall = (contact: Contact) => {
    hapticFeedback.trigger('impactMedium');
    Alert.alert('Video Call', `Starting video call with ${contact.name}`);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    hapticFeedback.trigger('impactLight');
    
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      isFavorite: false,
      isOnline: false,
      lastContact: new Date(),
      notes: newContact.notes,
      groups: [],
    };

    setContacts(prev => [contact, ...prev]);
    setNewContact({ name: '', phone: '', email: '', notes: '' });
    setShowAddContact(false);
  };

  const handleToggleFavorite = (contact: Contact) => {
    hapticFeedback.trigger('impactLight');
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phone.includes(searchQuery) ||
                         contact.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'favorites') {
      return matchesSearch && contact.isFavorite;
    }
    
    return matchesSearch;
  });

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactSelect(item)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.contactInitial}>{item.name[0]}</Text>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{item.name}</Text>
          {item.isFavorite && <Text style={styles.favoriteIcon}>⭐</Text>}
        </View>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        {item.email && <Text style={styles.contactEmail}>{item.email}</Text>}
        {item.groups.length > 0 && (
          <View style={styles.contactGroups}>
            {item.groups.slice(0, 2).map(group => (
              <View key={group} style={styles.groupTag}>
                <Text style={styles.groupText}>{group}</Text>
              </View>
            ))}
            {item.groups.length > 2 && (
              <Text style={styles.moreGroups}>+{item.groups.length - 2}</Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(item)}
        >
          <Text style={styles.actionText}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleMessage(item)}
        >
          <Text style={styles.actionText}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleVideoCall(item)}
        >
          <Text style={styles.actionText}>📹</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderGroupItem = ({ item }: { item: ContactGroup }) => (
    <TouchableOpacity style={styles.groupItem}>
      <View style={[styles.groupColor, { backgroundColor: item.color }]} />
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupCount}>{item.contactCount} contacts</Text>
      </View>
      <Text style={styles.groupArrow}>→</Text>
    </TouchableOpacity>
  );

  const renderContactDetail = () => {
    if (!selectedContact) return null;

    return (
      <View style={styles.contactDetailContainer}>
        {/* Contact Header */}
        <View style={styles.contactDetailHeader}>
          <TouchableOpacity onPress={() => setSelectedContact(null)}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.contactDetailTitle}>Contact</Text>
          <TouchableOpacity onPress={() => handleToggleFavorite(selectedContact)}>
            <Text style={styles.favoriteButton}>
              {selectedContact.isFavorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <GlassCard style={styles.contactDetailCard}>
          <View style={styles.contactDetailAvatar}>
            <Text style={styles.contactDetailInitial}>
              {selectedContact.name[0]}
            </Text>
            {selectedContact.isOnline && (
              <View style={styles.contactDetailOnlineIndicator} />
            )}
          </View>
          <Text style={styles.contactDetailName}>{selectedContact.name}</Text>
          <Text style={styles.contactDetailPhone}>{selectedContact.phone}</Text>
          {selectedContact.email && (
            <Text style={styles.contactDetailEmail}>{selectedContact.email}</Text>
          )}
          {selectedContact.notes && (
            <Text style={styles.contactDetailNotes}>{selectedContact.notes}</Text>
          )}
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleCall(selectedContact)}
          >
            <LinearGradient
              colors={[TauColors.success, '#22c55e']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionText}>📞</Text>
            </LinearGradient>
            <Text style={styles.quickActionLabel}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleMessage(selectedContact)}
          >
            <LinearGradient
              colors={[TauColors.primary, '#8b5cf6']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionText}>💬</Text>
            </LinearGradient>
            <Text style={styles.quickActionLabel}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleVideoCall(selectedContact)}
          >
            <LinearGradient
              colors={[TauColors.warning, '#f59e0b']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionText}>📹</Text>
            </LinearGradient>
            <Text style={styles.quickActionLabel}>Video</Text>
          </TouchableOpacity>
        </View>

        {/* Groups */}
        {selectedContact.groups.length > 0 && (
          <View style={styles.groupsSection}>
            <Text style={styles.sectionTitle}>Groups</Text>
            <View style={styles.groupsList}>
              {selectedContact.groups.map(group => (
                <View key={group} style={styles.groupTag}>
                  <Text style={styles.groupText}>{group}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderAddContact = () => (
    <View style={styles.addContactContainer}>
      <View style={styles.addContactHeader}>
        <TouchableOpacity onPress={() => setShowAddContact(false)}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.addContactTitle}>Add Contact</Text>
        <TouchableOpacity onPress={handleAddContact}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <GlassCard style={styles.addContactForm}>
        <TauInput
          placeholder="Name"
          value={newContact.name}
          onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
          style={styles.addContactInput}
        />
        <TauInput
          placeholder="Phone"
          value={newContact.phone}
          onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
          style={styles.addContactInput}
        />
        <TauInput
          placeholder="Email (optional)"
          value={newContact.email}
          onChangeText={(text) => setNewContact(prev => ({ ...prev, email: text }))}
          style={styles.addContactInput}
        />
        <TauInput
          placeholder="Notes (optional)"
          value={newContact.notes}
          onChangeText={(text) => setNewContact(prev => ({ ...prev, notes: text }))}
          style={styles.addContactInput}
          multiline
        />
      </GlassCard>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedContact ? (
        renderContactDetail()
      ) : showAddContact ? (
        renderAddContact()
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Contacts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddContact(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <TauInput
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: 'all', label: 'All', icon: '👥' },
              { key: 'favorites', label: 'Favorites', icon: '⭐' },
              { key: 'groups', label: 'Groups', icon: '📁' },
              { key: 'recent', label: 'Recent', icon: '🕒' },
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
          <View style={styles.content}>
            {activeTab === 'all' && (
              <FlatList
                data={filteredContacts}
                renderItem={renderContactItem}
                keyExtractor={item => item.id}
                style={styles.contactsList}
              />
            )}
            {activeTab === 'favorites' && (
              <FlatList
                data={filteredContacts}
                renderItem={renderContactItem}
                keyExtractor={item => item.id}
                style={styles.contactsList}
              />
            )}
            {activeTab === 'groups' && (
              <FlatList
                data={groups}
                renderItem={renderGroupItem}
                keyExtractor={item => item.id}
                style={styles.groupsList}
              />
            )}
            {activeTab === 'recent' && (
              <View style={styles.recentContainer}>
                <Text style={styles.placeholderText}>Recent contacts will appear here</Text>
              </View>
            )}
          </View>
        </>
      )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TauColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: TauColors.text,
  },
  searchContainer: {
    padding: 20,
    paddingTop: 0,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  contactsList: {
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
    position: 'relative',
  },
  contactInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: TauColors.text,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: TauColors.success,
    borderWidth: 2,
    borderColor: TauColors.background,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 12,
  },
  contactPhone: {
    fontSize: 14,
    color: TauColors.textSecondary,
  },
  contactEmail: {
    fontSize: 12,
    color: TauColors.textSecondary,
    marginTop: 2,
  },
  contactGroups: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  groupTag: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  groupText: {
    fontSize: 10,
    color: TauColors.primary,
    fontWeight: '600',
  },
  moreGroups: {
    fontSize: 10,
    color: TauColors.textSecondary,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  actionText: {
    fontSize: 16,
  },
  groupsList: {
    flex: 1,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  groupColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
  },
  groupCount: {
    fontSize: 12,
    color: TauColors.textSecondary,
    marginTop: 2,
  },
  groupArrow: {
    fontSize: 16,
    color: TauColors.textSecondary,
  },
  recentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: TauColors.textSecondary,
    textAlign: 'center',
  },
  contactDetailContainer: {
    flex: 1,
  },
  contactDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    fontSize: 24,
    color: TauColors.text,
  },
  contactDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TauColors.text,
  },
  favoriteButton: {
    fontSize: 20,
  },
  contactDetailCard: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  contactDetailAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: TauColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  contactDetailInitial: {
    fontSize: 32,
    fontWeight: '600',
    color: TauColors.text,
  },
  contactDetailOnlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: TauColors.success,
    borderWidth: 3,
    borderColor: TauColors.background,
  },
  contactDetailName: {
    fontSize: 24,
    fontWeight: '700',
    color: TauColors.text,
    marginBottom: 8,
  },
  contactDetailPhone: {
    fontSize: 16,
    color: TauColors.textSecondary,
    marginBottom: 4,
  },
  contactDetailEmail: {
    fontSize: 14,
    color: TauColors.textSecondary,
    marginBottom: 8,
  },
  contactDetailNotes: {
    fontSize: 14,
    color: TauColors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 12,
    color: TauColors.textSecondary,
  },
  groupsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
    marginBottom: 12,
  },
  groupsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addContactContainer: {
    flex: 1,
  },
  addContactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  addContactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TauColors.text,
  },
  saveButton: {
    fontSize: 16,
    color: TauColors.primary,
    fontWeight: '600',
  },
  addContactForm: {
    margin: 20,
    padding: 20,
  },
  addContactInput: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default ContactsApp; 