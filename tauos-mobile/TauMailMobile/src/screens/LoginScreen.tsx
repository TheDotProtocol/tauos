import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  loginWithTauId,
  OfflineError,
  tokens,
} from '@tau/taumail-mobile-client';
import { TauMailLogo } from '../components/TauMailLogo';
import { TauMailIcon } from '../components/TauMailIcon';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const result = await loginWithTauId(email.trim(), password);

      if (!result.ok) {
        dispatch(loginFailure(result.error));
        Alert.alert('Sign in failed', result.error);
        return;
      }

      if ('requires2fa' in result && result.requires2fa) {
        navigation.navigate('TwoFactor', {
          mfaToken: result.mfaToken,
          email: email.trim(),
        });
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
        err instanceof OfflineError ? 'No network connection. Try again when online.' : 'Login failed';
      dispatch(loginFailure(message));
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.logoContainer}>
          <TauMailLogo size={80} />
          <Text style={styles.tagline}>Sign in with Tau ID</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={tokens.colors.textTertiary}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={tokens.colors.textTertiary}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={tokens.colors.pageBase} />
            ) : (
              <Text style={styles.loginButtonText}>Sign in with Tau ID</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TauMailIcon name="lock" size={16} color={tokens.colors.gold} />
          <Text style={styles.footerText}>Secured by Tau ID · Zero telemetry</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.pageBase,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 16,
  },
  tagline: {
    fontSize: 16,
    color: tokens.colors.textSecondary,
    marginTop: 8,
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: tokens.radius.md,
    padding: 16,
    color: tokens.colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  loginButton: {
    backgroundColor: tokens.colors.gold,
    borderRadius: tokens.radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: tokens.colors.pageBase,
    fontSize: 16,
    fontWeight: '700',
  },
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

export default LoginScreen;
