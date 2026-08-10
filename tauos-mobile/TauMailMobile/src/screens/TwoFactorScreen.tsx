import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { verifyTauId2fa, OfflineError, tokens } from '@tau/taumail-mobile-client';
import TauMailCodeInput from '../components/TauMailCodeInput';
import { TauMailLogo } from '../components/TauMailLogo';
import { TauMailIcon } from '../components/TauMailIcon';

type TwoFactorScreenProps = {
  navigation: any;
  route: { params: { mfaToken: string; email?: string } };
};

const TwoFactorScreen = ({ navigation, route }: TwoFactorScreenProps) => {
  const { mfaToken, email } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleVerify = async () => {
    if (code.length < 6) {
      setError('Enter the 6-digit code from your authenticator app');
      return;
    }

    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      const result = await verifyTauId2fa(mfaToken, code);
      if (!result.ok) {
        dispatch(loginFailure(result.error));
        setError(result.error);
        return;
      }

      dispatch(
        loginSuccess({
          user: {
            id: String(result.user.id),
            email: result.user.email,
            name: result.user.fullName || result.user.username,
            avatarUrl: result.user.avatarUrl ?? null,
          },
          token: 'session',
        }),
      );
      const { startPushNotifications } = await import('../services/pushNotifications');
      startPushNotifications().catch(() => undefined);
      navigation.replace('Main', { screen: 'Dashboard' });
    } catch (err) {
      const message =
        err instanceof OfflineError ? 'No network connection. Try again when online.' : 'Verification failed';
      dispatch(loginFailure(message));
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <TauMailLogo size={72} showWordmark={false} style={styles.logoWrap} />
        <Text style={styles.title}>Two-Factor Authentication</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code from your authenticator app
          {email ? `\nfor ${email}` : ''}.
        </Text>

        <View style={styles.codeWrap}>
          <TauMailCodeInput value={code} onChange={setCode} error={error} />
        </View>

        <TouchableOpacity
          style={[styles.button, (loading || code.length < 6) && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading || code.length < 6}
        >
          {loading ? (
            <ActivityIndicator color={tokens.colors.pageBase} />
          ) : (
            <Text style={styles.buttonText}>Verify Code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backRow} onPress={() => navigation.replace('Login')}>
          <TauMailIcon name="chevronLeft" size={18} color={tokens.colors.gold} />
          <Text style={styles.backText}>Back to sign in</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TauMailIcon name="lock" size={16} color={tokens.colors.gold} />
          <Text style={styles.footerText}>Protected by Tau Security Protocol</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  logoWrap: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  codeWrap: { marginTop: 32, marginBottom: 24 },
  button: {
    backgroundColor: tokens.colors.gold,
    borderRadius: tokens.radius.md,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: tokens.colors.pageBase,
    fontSize: 16,
    fontWeight: '700',
  },
  backRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  backText: { color: tokens.colors.gold, fontSize: 14, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: tokens.colors.textTertiary,
    fontSize: 12,
    marginLeft: 6,
  },
});

export default TwoFactorScreen;
