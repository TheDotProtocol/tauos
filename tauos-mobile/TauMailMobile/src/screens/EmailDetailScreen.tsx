import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TauMailIcon } from '../components/TauMailIcon';
import { markEmailRead, downloadAttachment, getAttachmentDownloadUrl, tokens } from '@tau/taumail-mobile-client';

const EmailDetailScreen = ({ route, navigation }: any) => {
  const { email } = route.params;
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  useEffect(() => {
    markEmailRead(email.id).catch(() => undefined);
  }, [email.id]);

  const attachmentNames: string[] = email.attachments || [];

  const handleDownload = async (index: number, name: string) => {
    setDownloadingIndex(index);
    try {
      const result = await downloadAttachment(email.id, index);
      if (!result.ok) {
        const url = await getAttachmentDownloadUrl(email.id, index);
        await Linking.openURL(url);
        return;
      }
      Alert.alert('Downloaded', `${name || result.filename} is ready. Open from your device downloads.`);
    } catch {
      Alert.alert('Download failed', 'Could not download attachment');
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <TauMailIcon name="chevronLeft" size={24} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => navigation.navigate('Compose', { replyTo: email })}>
            <TauMailIcon name="arrowUpLeft" size={24} color={tokens.colors.gold} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionSpacer}
            onPress={() => navigation.navigate('Compose', { forward: email })}
          >
            <TauMailIcon name="arrowUpRight" size={24} color={tokens.colors.gold} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subject}>{email.subject}</Text>
        <Text style={styles.meta}>From: {email.senderName || email.from}</Text>
        <Text style={styles.meta}>To: {email.to.join(', ')}</Text>
        <Text style={styles.time}>{email.timestamp}</Text>

        {attachmentNames.length > 0 ? (
          <View style={styles.attachmentsBlock}>
            <Text style={styles.attachmentsTitle}>Attachments</Text>
            {attachmentNames.map((name: string, index: number) => (
              <TouchableOpacity
                key={`${name}-${index}`}
                style={styles.attachmentRow}
                onPress={() => handleDownload(index, name)}
              >
                <TauMailIcon name="paperclip" size={18} color={tokens.colors.gold} />
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {name}
                </Text>
                {downloadingIndex === index ? (
                  <ActivityIndicator size="small" color={tokens.colors.gold} />
                ) : (
                  <TauMailIcon name="package" size={18} color={tokens.colors.textSecondary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Text style={styles.body}>{email.body}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  actions: { flexDirection: 'row' },
  actionSpacer: { marginLeft: 16 },
  content: { padding: 16 },
  subject: { fontSize: 20, fontWeight: '700', color: tokens.colors.textPrimary, marginBottom: 12 },
  meta: { color: tokens.colors.textSecondary, marginBottom: 4 },
  time: { color: tokens.colors.textTertiary, fontSize: 12, marginBottom: 16 },
  attachmentsBlock: {
    marginBottom: 16,
    padding: 12,
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.pageSecondary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  attachmentsTitle: {
    color: tokens.colors.gold,
    fontWeight: '700',
    marginBottom: 8,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  attachmentName: { flex: 1, color: tokens.colors.textPrimary },
  body: { color: tokens.colors.textPrimary, fontSize: 16, lineHeight: 24 },
});

export default EmailDetailScreen;
