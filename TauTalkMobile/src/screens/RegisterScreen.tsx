import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { register } from '../api/client';
import GlassPanel from '../components/GlassPanel';
import PrivacyPledge from '../components/PrivacyPledge';
import { saveSession } from '../storage/session';
import { colors, radii } from '../theme';
import type { TauUser } from '../storage/session';

type Props = {
  onSuccess: (token: string, user: TauUser) => void;
  onBack: () => void;
};

export default function RegisterScreen({ onSuccess, onBack }: Props) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const cleanUsername = username.trim().replace(/^@/, '');
      const resolvedEmail = email.includes('@') ? email : `${cleanUsername}@tauos.org`;
      const data = await register({
        username: cleanUsername,
        fullName: fullName.trim(),
        email: resolvedEmail.toLowerCase(),
        phone: phone.trim() || undefined,
        password,
      });
      await saveSession(data.token, data.user);
      onSuccess(data.token, data.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Join TauTalk</Text>
        <Text style={styles.subtitle}>Pick a @username · encrypted by default</Text>

        <GlassPanel style={styles.card} strong>
          <Text style={styles.label}>@ Username</Text>
          <TextInput
            style={styles.input}
            placeholder="saleena"
            placeholderTextColor={colors.textSoft}
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Saleena Thamani"
            placeholderTextColor={colors.textSoft}
            value={fullName}
            onChangeText={setFullName}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@taumail.org (optional @tauos.org default)"
            placeholderTextColor={colors.textSoft}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Phone (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 555 123 4567"
            placeholderTextColor={colors.textSoft}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textSoft}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.button} onPress={submit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#1a1200" />
            ) : (
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </Pressable>
        </GlassPanel>

        <PrivacyPledge />

        <Pressable onPress={onBack} style={styles.linkWrap}>
          <Text style={styles.link}>Back to sign in</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingTop: 48, paddingBottom: 40 },
  title: { color: colors.goldLight, fontSize: 30, fontWeight: '800' },
  subtitle: { color: colors.textMuted, marginBottom: 20, marginTop: 6 },
  card: { padding: 20 },
  label: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: colors.text,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.goldLight,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#1a1200', fontWeight: '800', fontSize: 16 },
  linkWrap: { marginTop: 22, alignItems: 'center' },
  link: { color: colors.gold, fontSize: 15, fontWeight: '600' },
  error: { color: colors.danger, marginBottom: 8, textAlign: 'center', fontSize: 13 },
});
