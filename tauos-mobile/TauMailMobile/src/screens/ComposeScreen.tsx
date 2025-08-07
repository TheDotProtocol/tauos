import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addEmail } from '../store/slices/emailSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ComposeScreen = ({ navigation }: any) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const dispatch = useDispatch();

  const handleSend = () => {
    if (!to || !subject || !body) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newEmail = {
      id: Date.now().toString(),
      from: 'user@tauos.org',
      to: to.split(',').map(email => email.trim()),
      subject,
      body,
      timestamp: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      folder: 'sent',
      encryptionStatus: isEncrypted ? 'encrypted' : 'unencrypted',
    };

    dispatch(addEmail(newEmail));
    Alert.alert('Success', 'Email sent successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleCancel = () => {
    if (to || subject || body) {
      Alert.alert(
        'Discard Draft',
        'Are you sure you want to discard this email?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Email</Text>
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={24} color="#667eea" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* To Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>To:</Text>
            <TextInput
              style={styles.input}
              value={to}
              onChangeText={setTo}
              placeholder="Recipient email"
              placeholderTextColor="#666"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Subject Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Subject:</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Email subject"
              placeholderTextColor="#666"
            />
          </View>

          {/* Encryption Toggle */}
          <View style={styles.encryptionContainer}>
            <TouchableOpacity
              style={styles.encryptionToggle}
              onPress={() => setIsEncrypted(!isEncrypted)}
            >
              <Icon
                name={isEncrypted ? 'lock' : 'lock-open'}
                size={20}
                color={isEncrypted ? '#667eea' : '#666'}
              />
              <Text style={[styles.encryptionText, isEncrypted && styles.encryptionActive]}>
                {isEncrypted ? 'Encrypted' : 'Unencrypted'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body Field */}
          <View style={styles.bodyContainer}>
            <TextInput
              style={styles.bodyInput}
              value={body}
              onChangeText={setBody}
              placeholder="Write your email here..."
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  keyboardView: {
    flex: 1,
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
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: '#667eea',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sendButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  encryptionContainer: {
    marginBottom: 16,
  },
  encryptionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  encryptionText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 8,
  },
  encryptionActive: {
    color: '#667eea',
  },
  bodyContainer: {
    flex: 1,
  },
  bodyInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 200,
  },
});

export default ComposeScreen; 