import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fetchAiHistory,
  sendAiMessage,
  OfflineError,
  tokens,
  type TauMailAiMessage,
} from '@tau/taumail-mobile-client';
import { OfflineBanner } from '../components/OfflineBanner';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { ScreenHeader } from '../components/ScreenHeader';

const AiAssistantScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { online } = useNetworkStatus();
  const [messages, setMessages] = useState<TauMailAiMessage[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const history = await fetchAiHistory();
        setMessages(history.messages);
        setPrompts(history.prompts);
      } catch {
        /* start fresh */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSend = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    setInput('');
    setSending(true);
    setMessages((prev) => [...prev, { role: 'user', text }]);
    try {
      const result = await sendAiMessage(text);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessages((prev) => [...prev, { role: 'assistant', text: result.text }]);
      setError(null);
    } catch (err) {
      setError(err instanceof OfflineError ? 'Offline' : 'AI request failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader
        title="AI Assistant"
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      {!online && <OfflineBanner />}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={tokens.colors.gold} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>Ask Tau AI to draft or summarize mail.</Text>
              {prompts.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptRow}>
                  {prompts.map((prompt) => (
                    <TouchableOpacity
                      key={prompt}
                      style={styles.promptChip}
                      onPress={() => handleSend(prompt)}
                    >
                      <Text style={styles.promptText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : null}
            </View>
          }
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Tau AI…"
            placeholderTextColor={tokens.colors.textTertiary}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()} disabled={sending}>
            {sending ? (
              <ActivityIndicator color={tokens.colors.pageBase} size="small" />
            ) : (
              <Text style={styles.sendLabel}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  list: { padding: 16, paddingBottom: 8, flexGrow: 1 },
  bubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: tokens.radius.lg,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: tokens.colors.goldSurface,
    borderWidth: 1,
    borderColor: tokens.colors.goldBorder,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.pageSecondary,
  },
  bubbleText: { color: tokens.colors.textPrimary, fontSize: 15, lineHeight: 22 },
  emptyWrap: { marginTop: 24, alignItems: 'center' },
  empty: { textAlign: 'center', color: tokens.colors.textSecondary, fontSize: 15 },
  promptRow: { gap: 8, paddingHorizontal: 8, marginTop: 20 },
  promptChip: {
    backgroundColor: tokens.colors.pageSecondary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  promptText: { color: tokens.colors.textSecondary, fontSize: 13 },
  error: { color: tokens.colors.danger, textAlign: 'center', fontSize: 13, padding: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.pagePrimary,
  },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: tokens.colors.textPrimary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  sendBtn: {
    minHeight: 52,
    backgroundColor: tokens.colors.gold,
    borderRadius: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendLabel: { color: tokens.colors.pageBase, fontWeight: '700', fontSize: 15 },
});

export default AiAssistantScreen;
