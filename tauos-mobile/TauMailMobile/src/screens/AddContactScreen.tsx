import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createContact, tokens } from '@tau/taumail-mobile-client';
import { TauMailIcon } from '../components/TauMailIcon';

const AddContactScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [tauId, setTauId] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Required fields', 'Name and email are required.');
      return;
    }
    setSaving(true);
    try {
      const result = await createContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        phoneCountryCode: phoneCountryCode.trim() || '+1',
        tauId: tauId.trim() || undefined,
        organization: organization.trim() || undefined,
        designation: designation.trim() || undefined,
      });
      if (!result.ok) {
        Alert.alert('Error', result.error);
        return;
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <TauMailIcon name="chevronLeft" size={20} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Contact</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
          {saving ? (
            <ActivityIndicator color={tokens.colors.pageBase} size="small" />
          ) : (
            <Text style={styles.saveLabel}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.section}>Personal</Text>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor={tokens.colors.textTertiary}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor={tokens.colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone</Text>
          <View style={styles.phoneRow}>
            <TextInput
              style={[styles.input, styles.codeInput]}
              value={phoneCountryCode}
              onChangeText={setPhoneCountryCode}
              placeholder="+1"
              placeholderTextColor={tokens.colors.textTertiary}
            />
            <TextInput
              style={[styles.input, styles.phoneInput]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor={tokens.colors.textTertiary}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Tau ID</Text>
          <TextInput
            style={styles.input}
            value={tauId}
            onChangeText={setTauId}
            placeholder="Optional Tau ID username"
            placeholderTextColor={tokens.colors.textTertiary}
            autoCapitalize="none"
          />

          <Text style={styles.section}>Work</Text>
          <Text style={styles.label}>Organization</Text>
          <TextInput
            style={styles.input}
            value={organization}
            onChangeText={setOrganization}
            placeholder="Company or team"
            placeholderTextColor={tokens.colors.textTertiary}
          />

          <Text style={styles.label}>Designation</Text>
          <TextInput
            style={styles.input}
            value={designation}
            onChangeText={setDesignation}
            placeholder="Job title or role"
            placeholderTextColor={tokens.colors.textTertiary}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: tokens.colors.gold,
    borderRadius: tokens.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 72,
    alignItems: 'center',
  },
  saveLabel: { color: tokens.colors.pageBase, fontWeight: '700' },
  form: { padding: 16, paddingBottom: 32 },
  section: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.colors.gold,
    marginTop: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.textTertiary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: tokens.colors.pageSecondary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: tokens.colors.textPrimary,
  },
  phoneRow: { flexDirection: 'row', gap: 10 },
  codeInput: { width: 72, textAlign: 'center' },
  phoneInput: { flex: 1 },
});

export default AddContactScreen;
