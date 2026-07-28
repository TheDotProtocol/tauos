import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { login } from '../api/client';
import GlassPanel from '../components/GlassPanel';
import PrivacyPledge from '../components/PrivacyPledge';
import { PHONE_AUTH_ENABLED } from '../config';
import { saveSession } from '../storage/session';
import { colors, radii, shadows } from '../theme';
import type { TauUser } from '../storage/session';

type Props = {
  onSuccess: (token: string, user: TauUser) => void;
  onRegister: () => void;
};

type LoginMode = 'email' | 'phone';

export default function LoginScreen({ onSuccess, onRegister }: Props) {
  const [mode, setMode] = useState<LoginMode>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await login(identifier.trim(), password);
      await saveSession(data.token, data.user);
      onSuccess(data.token, data.user);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      if (mode === 'phone' && msg.toLowerCase().includes('required')) {
        setError('Phone login is rolling out — use email for now, or try again after the next server update.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.hero}>
        <Image
          source={require('../assets/launcher-icon.png')}
          style={styles.appIcon}
          resizeMode="contain"
        />
        <Text style={styles.brand}>TauTalk</Text>
        <Text style={styles.tagline}>Encrypted messaging · Public Beta</Text>
      </View>

      <GlassPanel style={styles.card} strong>
        {PHONE_AUTH_ENABLED ? (
          <View style={styles.modeRow}>
            <Pressable
              style={[styles.modeBtn, mode === 'email' && styles.modeBtnActive]}
              onPress={() => setMode('email')}>
              <Text style={[styles.modeText, mode === 'email' && styles.modeTextActive]}>Email</Text>
            </Pressable>
            <Pressable
              style={[styles.modeBtn, mode === 'phone' && styles.modeBtnActive]}
              onPress={() => setMode('phone')}>
              <Text style={[styles.modeText, mode === 'phone' && styles.modeTextActive]}>Phone</Text>
            </Pressable>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="you@taumail.org"
          placeholderTextColor={colors.textSoft}
          autoCapitalize="none"
          keyboardType="email-address"
          value={identifier}
          onChangeText={setIdentifier}
        />
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
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </Pressable>

        <Pressable onPress={onRegister} style={styles.linkWrap}>
          <Text style={styles.link}>Create account · pick your @username</Text>
        </Pressable>
      </GlassPanel>

      <View style={{ marginTop: 14 }}>
        <PrivacyPledge compact />
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    padding: 24,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.goldGlow,
    opacity: 0.25,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -120,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.goldDim,
    opacity: 0.4,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  appIcon: {
    width: 120,
    height: 120,
    marginBottom: 16,
    ...shadows.gold,
  },
  brand: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    color: colors.goldLight,
    marginTop: 6,
    fontSize: 14,
    opacity: 0.9,
  },
  card: {
    padding: 22,
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: radii.md,
    padding: 4,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  modeText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 14,
  },
  modeTextActive: {
    color: colors.goldLight,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.goldLight,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#1a1200',
    fontWeight: '800',
    fontSize: 16,
  },
  linkWrap: {
    marginTop: 18,
    alignItems: 'center',
  },
  link: {
    color: colors.textMuted,
    fontSize: 14,
  },
  error: {
    color: colors.danger,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
});
