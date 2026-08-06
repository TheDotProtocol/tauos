import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { register, sendRegistrationOtp } from '../api/client';
import GlassPanel from '../components/GlassPanel';
import PrivacyPledge from '../components/PrivacyPledge';
import { PHONE_AUTH_ENABLED } from '../config';
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
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingPhone, setSendingPhone] = useState(false);
  const [error, setError] = useState('');

  const resolvedEmail = () => {
    const trimmed = email.trim();
    if (trimmed.includes('@')) return trimmed.toLowerCase();
    const clean = username.trim().replace(/^@/, '');
    return clean ? `${clean}@tauos.org` : '';
  };

  const sendEmailCode = async () => {
    const target = resolvedEmail();
    if (!target.includes('@')) {
      setError('Enter a valid email (Gmail, Outlook, or @taumail.org)');
      return;
    }
    setError('');
    setSendingEmail(true);
    try {
      const res = await sendRegistrationOtp('email', target);
      if (res.devCode) {
        Alert.alert('Dev code', `Email OTP: ${res.devCode}`);
      } else {
        Alert.alert('Code sent', `Check ${target} for your 6-digit code`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send email code');
    } finally {
      setSendingEmail(false);
    }
  };

  const sendPhoneCode = async () => {
    if (!phone.trim()) {
      setError('Enter phone with country code first');
      return;
    }
    setError('');
    setSendingPhone(true);
    try {
      const res = await sendRegistrationOtp('phone', phone.trim());
      if (res.devCode) {
        Alert.alert('Dev code', `SMS OTP: ${res.devCode}`);
      } else {
        Alert.alert('Code sent', 'Check your SMS for the 6-digit code');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send SMS code');
    } finally {
      setSendingPhone(false);
    }
  };

  const submit = async () => {
    setError('');
    if (!emailOtp.trim()) {
      setError('Verify your email with the 6-digit code');
      return;
    }
    if (PHONE_AUTH_ENABLED && phone.trim() && !phoneOtp.trim()) {
      setError('Verify your phone with the SMS code');
      return;
    }
    setLoading(true);
    try {
      const cleanUsername = username.trim().replace(/^@/, '');
      const data = await register({
        username: cleanUsername,
        fullName: fullName.trim(),
        email: resolvedEmail(),
        phone: PHONE_AUTH_ENABLED && phone.trim() ? phone.trim() : undefined,
        password,
        emailOtp: emailOtp.trim(),
        phoneOtp: PHONE_AUTH_ENABLED && phone.trim() ? phoneOtp.trim() : undefined,
      });
      await saveSession(data.token, data.user, data.refreshToken);
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
        <Text style={styles.subtitle}>
          Verify your email — Gmail and external addresses welcome
        </Text>

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
            placeholder="you@gmail.com or you@taumail.org"
            placeholderTextColor={colors.textSoft}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Pressable style={styles.codeBtn} onPress={sendEmailCode} disabled={sendingEmail}>
            {sendingEmail ? (
              <ActivityIndicator color={colors.goldLight} size="small" />
            ) : (
              <Text style={styles.codeBtnText}>Send email verification code</Text>
            )}
          </Pressable>
          <Text style={styles.label}>Email code</Text>
          <TextInput
            style={styles.input}
            placeholder="6-digit code"
            placeholderTextColor={colors.textSoft}
            keyboardType="number-pad"
            maxLength={6}
            value={emailOtp}
            onChangeText={setEmailOtp}
          />

          {PHONE_AUTH_ENABLED ? (
            <>
              <Text style={styles.label}>Phone (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 555 123 4567"
                placeholderTextColor={colors.textSoft}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              {phone.trim() ? (
                <>
                  <Pressable style={styles.codeBtn} onPress={sendPhoneCode} disabled={sendingPhone}>
                    {sendingPhone ? (
                      <ActivityIndicator color={colors.goldLight} size="small" />
                    ) : (
                      <Text style={styles.codeBtnText}>Send SMS verification code</Text>
                    )}
                  </Pressable>
                  <Text style={styles.label}>SMS code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="6-digit SMS code"
                    placeholderTextColor={colors.textSoft}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={phoneOtp}
                    onChangeText={setPhoneOtp}
                  />
                </>
              ) : null}
            </>
          ) : null}

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
  codeBtn: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.goldDim,
    paddingVertical: 11,
    alignItems: 'center',
    marginBottom: 8,
  },
  codeBtnText: { color: colors.goldLight, fontWeight: '700', fontSize: 14 },
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
