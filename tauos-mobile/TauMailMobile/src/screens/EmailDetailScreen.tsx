import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EmailDetailScreen = ({ route, navigation }: any) => {
  const { email } = route.params;

  const handleReply = () => {
    navigation.navigate('Compose', { replyTo: email });
  };

  const handleForward = () => {
    navigation.navigate('Compose', { forward: email });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Email',
      'Are you sure you want to delete this email?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleReply} style={styles.actionButton}>
            <Icon name="reply" size={24} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForward} style={styles.actionButton}>
            <Icon name="forward" size={24} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Icon name="delete" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Subject */}
        <Text style={styles.subject}>{email.subject}</Text>

        {/* Email Info */}
        <View style={styles.emailInfo}>
          <View style={styles.fromContainer}>
            <Text style={styles.fromLabel}>From:</Text>
            <Text style={styles.fromText}>{email.from}</Text>
          </View>
          <View style={styles.toContainer}>
            <Text style={styles.toLabel}>To:</Text>
            <Text style={styles.toText}>{email.to.join(', ')}</Text>
          </View>
          <Text style={styles.timestamp}>
            {new Date(email.timestamp).toLocaleString()}
          </Text>
        </View>

        {/* Encryption Badge */}
        {email.encryptionStatus === 'encrypted' && (
          <View style={styles.encryptionBadge}>
            <Icon name="lock" size={16} color="#667eea" />
            <Text style={styles.encryptionText}>End-to-end encrypted</Text>
          </View>
        )}

        {/* Body */}
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>{email.body}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subject: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  emailInfo: {
    marginBottom: 16,
  },
  fromContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fromLabel: {
    fontSize: 14,
    color: '#999',
    width: 40,
  },
  fromText: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  toContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  toLabel: {
    fontSize: 14,
    color: '#999',
    width: 40,
  },
  toText: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  encryptionText: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 4,
  },
  bodyContainer: {
    marginTop: 16,
  },
  bodyText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
});

export default EmailDetailScreen; 