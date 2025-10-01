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
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromMe: boolean;
  isRead: boolean;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  encryptionStatus: 'encrypted' | 'unencrypted';
}

interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  isEncrypted: boolean;
}

const MessagesApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conversations' | 'contacts' | 'calls' | 'settings'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const hapticFeedback = useHapticFeedback();

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      contact: {
        id: '1',
        name: 'John Doe',
        phone: '+1-555-0123',
        lastMessage: 'Hey, how are you?',
        lastMessageTime: new Date(),
        unreadCount: 2,
        isOnline: true,
      },
      messages: [
        {
          id: '1',
          text: 'Hey, how are you?',
          timestamp: new Date(),
          isFromMe: false,
          isRead: true,
          type: 'text',
          encryptionStatus: 'encrypted',
        },
        {
          id: '2',
          text: 'I\'m good, thanks! How about you?',
          timestamp: new Date(),
          isFromMe: true,
          isRead: true,
          type: 'text',
          encryptionStatus: 'encrypted',
        },
      ],
      isEncrypted: true,
    },
    {
      id: '2',
      contact: {
        id: '2',
        name: 'Jane Smith',
        phone: '+1-555-0456',
        lastMessage: 'Meeting at 3 PM',
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 0,
        isOnline: false,
      },
      messages: [
        {
          id: '3',
          text: 'Meeting at 3 PM',
          timestamp: new Date(Date.now() - 3600000),
          isFromMe: false,
          isRead: true,
          type: 'text',
          encryptionStatus: 'encrypted',
        },
      ],
      isEncrypted: true,
    },
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'John Doe', phone: '+1-555-0123', isOnline: true, unreadCount: 0 },
    { id: '2', name: 'Jane Smith', phone: '+1-555-0456', isOnline: false, unreadCount: 0 },
    { id: '3', name: 'Bob Johnson', phone: '+1-555-0789', isOnline: true, unreadCount: 0 },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    hapticFeedback.trigger('impactLight');
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date(),
      isFromMe: true,
      isRead: false,
      type: 'text',
      encryptionStatus: 'encrypted',
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));

    setMessageText('');
  };

  const handleConversationSelect = (conversation: Conversation) => {
    hapticFeedback.trigger('impactLight');
    setSelectedConversation(conversation);
  };

  const handleNewMessage = (contact: Contact) => {
    hapticFeedback.trigger('impactLight');
    const newConversation: Conversation = {
      id: Date.now().toString(),
      contact,
      messages: [],
      isEncrypted: true,
    };
    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationSelect(item)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.contactInitial}>{item.contact.name[0]}</Text>
        {item.contact.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.contactName}>{item.contact.name}</Text>
          <Text style={styles.lastMessageTime}>
            {item.contact.lastMessageTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.contact.lastMessage}
          </Text>
          {item.contact.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.contact.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
      {item.isEncrypted && (
        <View style={styles.encryptionIndicator}>
          <Text style={styles.encryptionText}>🔒</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isFromMe ? styles.myMessage : styles.theirMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isFromMe ? styles.myMessageBubble : styles.theirMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isFromMe ? styles.myMessageText : styles.theirMessageText
        ]}>
          {item.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {item.isFromMe && (
            <Text style={styles.readStatus}>
              {item.isRead ? '✓✓' : '✓'}
            </Text>
          )}
          {item.encryptionStatus === 'encrypted' && (
            <Text style={styles.encryptionIcon}>🔒</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderConversations = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TauInput
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        style={styles.conversationsList}
      />
    </View>
  );

  const renderContacts = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TauInput
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>
      <ScrollView style={styles.contactsList}>
        {contacts.map(contact => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => handleNewMessage(contact)}
          >
            <View style={styles.contactAvatar}>
              <Text style={styles.contactInitial}>{contact.name[0]}</Text>
              {contact.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
            <TouchableOpacity style={styles.newMessageButton}>
              <Text style={styles.newMessageText}>💬</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderChat = () => {
    if (!selectedConversation) return null;

    return (
      <View style={styles.chatContainer}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.chatContactInfo}>
            <View style={styles.chatContactAvatar}>
              <Text style={styles.chatContactInitial}>
                {selectedConversation.contact.name[0]}
              </Text>
              {selectedConversation.contact.isOnline && (
                <View style={styles.chatOnlineIndicator} />
              )}
            </View>
            <View>
              <Text style={styles.chatContactName}>
                {selectedConversation.contact.name}
              </Text>
              <Text style={styles.chatContactStatus}>
                {selectedConversation.contact.isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
          <View style={styles.chatActions}>
            <TouchableOpacity style={styles.chatActionButton}>
              <Text style={styles.chatActionText}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionButton}>
              <Text style={styles.chatActionText}>📹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionButton}>
              <Text style={styles.chatActionText}>ℹ️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={selectedConversation.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          inverted
        />

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Text style={styles.attachmentText}>📎</Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {selectedConversation ? (
        renderChat()
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
            <TouchableOpacity style={styles.newChatButton}>
              <Text style={styles.newChatText}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: 'conversations', label: 'Chats', icon: '💬' },
              { key: 'contacts', label: 'Contacts', icon: '👥' },
              { key: 'calls', label: 'Calls', icon: '📞' },
              { key: 'settings', label: 'Settings', icon: '⚙️' },
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
          {activeTab === 'conversations' && renderConversations()}
          {activeTab === 'contacts' && renderContacts()}
          {activeTab === 'calls' && (
            <View style={styles.tabContent}>
              <Text style={styles.placeholderText}>Call history will appear here</Text>
            </View>
          )}
          {activeTab === 'settings' && (
            <View style={styles.tabContent}>
              <Text style={styles.placeholderText}>Message settings will appear here</Text>
            </View>
          )}
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
  newChatButton: {
    padding: 8,
  },
  newChatText: {
    fontSize: 20,
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
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
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
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
  },
  lastMessageTime: {
    fontSize: 12,
    color: TauColors.textSecondary,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: TauColors.textSecondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: TauColors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: TauColors.text,
  },
  encryptionIndicator: {
    marginLeft: 8,
  },
  encryptionText: {
    fontSize: 12,
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
  contactInfo: {
    flex: 1,
  },
  contactPhone: {
    fontSize: 14,
    color: TauColors.textSecondary,
    marginTop: 2,
  },
  newMessageButton: {
    padding: 8,
  },
  newMessageText: {
    fontSize: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    fontSize: 24,
    color: TauColors.text,
    marginRight: 16,
  },
  chatContactInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatContactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TauColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  chatContactInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
  },
  chatOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: TauColors.success,
    borderWidth: 2,
    borderColor: TauColors.background,
  },
  chatContactName: {
    fontSize: 16,
    fontWeight: '600',
    color: TauColors.text,
  },
  chatContactStatus: {
    fontSize: 12,
    color: TauColors.textSecondary,
  },
  chatActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chatActionButton: {
    padding: 8,
  },
  chatActionText: {
    fontSize: 18,
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 8,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: TauColors.primary,
  },
  theirMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: TauColors.text,
  },
  theirMessageText: {
    color: TauColors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 12,
    color: TauColors.textSecondary,
  },
  readStatus: {
    fontSize: 12,
    color: TauColors.textSecondary,
  },
  encryptionIcon: {
    fontSize: 10,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  attachmentButton: {
    padding: 8,
    marginRight: 8,
  },
  attachmentText: {
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageInput: {
    color: TauColors.text,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 20,
  },
  placeholderText: {
    textAlign: 'center',
    color: TauColors.textSecondary,
    marginTop: 40,
  },
});

export default MessagesApp; 