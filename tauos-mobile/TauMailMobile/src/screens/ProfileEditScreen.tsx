import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import {
  fetchProfile,
  updateProfile,
  uploadProfileAvatar,
  removeProfileAvatar,
  tokens,
} from '@tau/taumail-mobile-client';
import { RootState } from '../store';
import { updateUser } from '../store/slices/authSlice';
import { TauMailIcon } from '../components/TauMailIcon';
import { TauMailUserAvatar } from '../components/TauMailUserAvatar';

const ProfileEditScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');
  const [timezone, setTimezone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(user?.avatarUrl);

  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        setFullName(profile.fullName || '');
        setDisplayName(profile.displayName || '');
        setEmail(profile.email || '');
        setOrganization(profile.organization || '');
        setTitle(profile.title || '');
        setTimezone(profile.timezone || '');
        setAvatarUrl(profile.avatarUrl);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const profile = await updateProfile({
        fullName: fullName.trim() || undefined,
        displayName: displayName.trim() || undefined,
        organization: organization.trim() || undefined,
        title: title.trim() || undefined,
        timezone: timezone.trim() || undefined,
      });
      dispatch(
        updateUser({
          name: profile.displayName || profile.fullName || user?.name,
          avatarUrl: profile.avatarUrl,
        }),
      );
      Alert.alert('Saved', 'Your profile has been updated.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePickAvatar = async () => {
    try {
      const picked = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setUploading(true);
      const profile = await uploadProfileAvatar({
        uri: picked.uri,
        name: picked.name || 'avatar.jpg',
        type: picked.type || 'image/jpeg',
      });
      setAvatarUrl(profile.avatarUrl);
      dispatch(
        updateUser({
          name: profile.displayName || profile.fullName || user?.name,
          avatarUrl: profile.avatarUrl,
        }),
      );
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Could not upload photo');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    Alert.alert('Remove photo', 'Remove your profile picture?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeProfileAvatar();
            setAvatarUrl(null);
            dispatch(updateUser({ avatarUrl: null }));
          } catch {
            Alert.alert('Error', 'Could not remove photo');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={tokens.colors.gold} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <TauMailIcon name="chevronLeft" size={20} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
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
          <View style={styles.avatarSection}>
            <TauMailUserAvatar name={fullName || displayName} avatarUrl={avatarUrl} size={88} />
            <View style={styles.avatarActions}>
              <TouchableOpacity style={styles.avatarBtn} onPress={handlePickAvatar} disabled={uploading}>
                {uploading ? (
                  <ActivityIndicator color={tokens.colors.gold} size="small" />
                ) : (
                  <Text style={styles.avatarBtnText}>Change Photo</Text>
                )}
              </TouchableOpacity>
              {avatarUrl ? (
                <TouchableOpacity onPress={handleRemoveAvatar}>
                  <Text style={styles.removePhoto}>Remove Photo</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <Text style={styles.label}>Full name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholderTextColor={tokens.colors.textTertiary} />

          <Text style={styles.label}>Display name</Text>
          <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholderTextColor={tokens.colors.textTertiary} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={email}
            editable={false}
            placeholderTextColor={tokens.colors.textTertiary}
          />

          <Text style={styles.label}>Organization</Text>
          <TextInput style={styles.input} value={organization} onChangeText={setOrganization} placeholderTextColor={tokens.colors.textTertiary} />

          <Text style={styles.label}>Job title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={tokens.colors.textTertiary} />

          <Text style={styles.label}>Timezone</Text>
          <TextInput
            style={styles.input}
            value={timezone}
            onChangeText={setTimezone}
            placeholder="e.g. America/New_York"
            placeholderTextColor={tokens.colors.textTertiary}
            autoCapitalize="none"
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
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: tokens.colors.textPrimary },
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
  avatarSection: { alignItems: 'center', marginBottom: 24, gap: 14 },
  avatarActions: { alignItems: 'center', gap: 8 },
  avatarBtn: {
    borderWidth: 1,
    borderColor: tokens.colors.goldBorder,
    backgroundColor: tokens.colors.goldSurface,
    borderRadius: tokens.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  avatarBtnText: { color: tokens.colors.gold, fontWeight: '600' },
  removePhoto: { color: tokens.colors.danger, fontSize: 13 },
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
  inputDisabled: { opacity: 0.6 },
});

export default ProfileEditScreen;
