import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { fetchProfile, updateProfile, uploadAvatar } from '../api/client';
import Avatar from '../components/Avatar';
import GlassPanel from '../components/GlassPanel';
import PrivacyPledge from '../components/PrivacyPledge';
import { saveSession } from '../storage/session';
import { colors, radii } from '../theme';
import type { TauUser } from '../storage/session';

type Props = {
  token: string;
  user: TauUser;
  onBack: () => void;
  onUpdated: (user: TauUser) => void;
};

export default function ProfileScreen({ token, user, onBack, onUpdated }: Props) {
  const [username, setUsername] = useState(user.username);
  const [fullName, setFullName] = useState(user.fullName);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile(token)
      .then((p) => {
        setUsername(p.username);
        setFullName(p.fullName);
        setAvatarUrl(p.avatarUrl ?? null);
      })
      .catch(() => {
        /* use session defaults */
      })
      .finally(() => setLoading(false));
  }, [token]);

  const pickAvatar = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.85, maxWidth: 1024, maxHeight: 1024 }, async (res) => {
      const asset = res.assets?.[0];
      if (!asset?.uri) return;
      setSaving(true);
      setError('');
      try {
        const uploaded = await uploadAvatar(
          token,
          asset.uri,
          asset.fileName || 'avatar.jpg',
          asset.type || 'image/jpeg'
        );
        setAvatarUrl(uploaded.avatarUrl);
        const next = {
          ...user,
          username: uploaded.profile.username,
          fullName: uploaded.profile.fullName,
          avatarUrl: uploaded.avatarUrl,
        };
        await saveSession(token, next);
        onUpdated(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Avatar upload failed');
      } finally {
        setSaving(false);
      }
    });
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const profile = await updateProfile(token, {
        username: username.replace(/^@/, '').trim(),
        fullName: fullName.trim(),
      });
      const next: TauUser = {
        ...user,
        username: profile.username,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl ?? avatarUrl,
      };
      await saveSession(token, next);
      onUpdated(next);
      Alert.alert('Saved', 'Your profile was updated.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.goldLight} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.screenTitle}>Profile</Text>
        <View style={{ width: 56 }} />
      </View>

      <Pressable style={styles.avatarBlock} onPress={pickAvatar}>
        <Avatar name={fullName} size={96} gold imageUrl={avatarUrl} />
        <Text style={styles.changePhoto}>Change photo</Text>
      </Pressable>

      <GlassPanel style={styles.card} strong>
        <Text style={styles.label}>@ Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="yourname"
          placeholderTextColor={colors.textSoft}
        />
        <Text style={styles.label}>Display name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your name"
          placeholderTextColor={colors.textSoft}
        />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.readonly}>{user.email}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.saveBtn} onPress={save} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#1a1200" />
          ) : (
            <Text style={styles.saveText}>Save changes</Text>
          )}
        </Pressable>
      </GlassPanel>

      <View style={{ marginHorizontal: 16, marginTop: 16 }}>
        <PrivacyPledge />
      </View>

      <Text style={styles.footerNote}>
        Voice & video calls are on the next sprint. Attachments & location work today when server
        storage is configured.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 40 },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  back: { color: colors.goldLight, fontWeight: '600', width: 56 },
  screenTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  avatarBlock: { alignItems: 'center', marginVertical: 20 },
  changePhoto: { color: colors.gold, marginTop: 10, fontWeight: '600' },
  card: { marginHorizontal: 16, padding: 20 },
  label: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    marginBottom: 4,
  },
  readonly: { color: colors.textMuted, fontSize: 16, marginBottom: 8 },
  saveBtn: {
    backgroundColor: colors.goldLight,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveText: { color: '#1a1200', fontWeight: '800', fontSize: 16 },
  error: { color: colors.danger, marginTop: 10, textAlign: 'center' },
  footerNote: {
    color: colors.textSoft,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
    lineHeight: 18,
  },
});
