import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { signedAttachmentUrl } from '../api/client';
import MIcon from './MIcon';
import type { ReplyQuote } from './ContactLabelModal';
import { colors } from '../theme';
import type { MessagePayload } from '../types/message-payload';
import { openStreetMapUrl } from '../utils/maps';

type Props = {
  payload: MessagePayload;
  isMe: boolean;
  token: string;
  time: string;
  replyQuote?: ReplyQuote | null;
  senderName?: string;
  onImagePress?: (uri: string) => void;
  onLongPress?: () => void;
};

function ReplySnippet({ quote }: { quote: ReplyQuote }) {
  return (
    <View style={replyStyles.wrap}>
      <View style={replyStyles.accent} />
      <View style={replyStyles.body}>
        <Text style={replyStyles.name} numberOfLines={1}>
          {quote.senderUsername}
        </Text>
        <Text style={replyStyles.preview} numberOfLines={2}>
          {quote.preview}
        </Text>
      </View>
    </View>
  );
}

export default function MessageBubble({
  payload,
  isMe,
  token,
  time,
  replyQuote,
  senderName,
  onImagePress,
  onLongPress,
}: Props) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(
    payload.kind === 'image' || payload.kind === 'file' ? payload.url ?? null : null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (payload.kind !== 'image' && payload.kind !== 'file') return;
      if (payload.url) {
        setMediaUrl(payload.url);
        return;
      }
      if (!payload.path) return;
      try {
        const url = await signedAttachmentUrl(token, payload.path);
        if (!cancelled) setMediaUrl(url);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [payload, token]);

  const bubbleStyle = [styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther];

  const playAudio = () => {
    if (!mediaUrl) return;
    try {
      SoundPlayer.playUrl(mediaUrl);
    } catch {
      Linking.openURL(mediaUrl).catch(() => {});
    }
  };

  if (payload.kind === 'text') {
    return (
      <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
        {!isMe && senderName ? <Text style={styles.senderName}>{senderName}</Text> : null}
        <Pressable style={bubbleStyle} onLongPress={onLongPress} delayLongPress={400}>
          {replyQuote ? <ReplySnippet quote={replyQuote} /> : null}
          <Text style={[styles.text, isMe && styles.textMe]}>{payload.text}</Text>
          <Text style={[styles.time, isMe && styles.timeMe]}>{time}</Text>
        </Pressable>
      </View>
    );
  }

  if (payload.kind === 'image') {
    return (
      <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
        {!isMe && senderName ? <Text style={styles.senderName}>{senderName}</Text> : null}
        <Pressable style={[bubbleStyle, styles.mediaBubble]} onLongPress={onLongPress} delayLongPress={400}>
          {replyQuote ? <ReplySnippet quote={replyQuote} /> : null}
          {mediaUrl ? (
            <Pressable onPress={() => onImagePress?.(mediaUrl)}>
              <Image source={{ uri: mediaUrl }} style={styles.image} resizeMode="cover" />
            </Pressable>
          ) : (
            <Text style={styles.placeholder}>Loading photo…</Text>
          )}
          {payload.caption ? (
            <Text style={[styles.text, isMe && styles.textMe, styles.caption]}>{payload.caption}</Text>
          ) : null}
          <Text style={[styles.time, isMe && styles.timeMe]}>{time}</Text>
        </Pressable>
      </View>
    );
  }

  if (payload.kind === 'file') {
    const isAudio = payload.mime.startsWith('audio/');
    return (
      <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
        {!isMe && senderName ? <Text style={styles.senderName}>{senderName}</Text> : null}
        <Pressable
          style={bubbleStyle}
          onPress={() => (isAudio ? playAudio() : mediaUrl && Linking.openURL(mediaUrl))}
          onLongPress={onLongPress}
          delayLongPress={400}
          disabled={!isAudio && !mediaUrl}>
          {replyQuote ? <ReplySnippet quote={replyQuote} /> : null}
          {isAudio ? (
            <>
              <MIcon name="mic" size={22} color={colors.goldLight} style={styles.fileIcon} />
              <Text style={[styles.text, isMe && styles.textMe]}>
                {mediaUrl ? 'Tap to play voice message' : 'Loading voice…'}
              </Text>
            </>
          ) : (
            <>
              <MIcon name="attach-file" size={22} color={colors.goldLight} style={styles.fileIcon} />
              <Text style={[styles.text, isMe && styles.textMe]} numberOfLines={2}>
                {payload.name}
              </Text>
              <Text style={styles.fileMeta}>{payload.mime}</Text>
            </>
          )}
          <Text style={[styles.time, isMe && styles.timeMe]}>{time}</Text>
        </Pressable>
      </View>
    );
  }

  if (payload.kind === 'location') {
    const mapsUrl = openStreetMapUrl(payload.lat, payload.lng);
    return (
      <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
        {!isMe && senderName ? <Text style={styles.senderName}>{senderName}</Text> : null}
        <Pressable
          style={bubbleStyle}
          onPress={() => Linking.openURL(mapsUrl)}
          onLongPress={onLongPress}
          delayLongPress={400}>
          {replyQuote ? <ReplySnippet quote={replyQuote} /> : null}
          <MIcon name="location-on" size={22} color={colors.goldLight} style={styles.fileIcon} />
          <Text style={[styles.text, isMe && styles.textMe]}>
            {payload.label || 'Shared location'}
          </Text>
          <Text style={styles.fileMeta}>
            {payload.lat.toFixed(5)}, {payload.lng.toFixed(5)}
          </Text>
          <Text style={styles.osmHint}>Open in OpenStreetMap</Text>
          <Text style={[styles.time, isMe && styles.timeMe]}>{time}</Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const replyStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  accent: { width: 3, backgroundColor: colors.gold },
  body: { flex: 1, paddingHorizontal: 8, paddingVertical: 6 },
  name: { color: colors.gold, fontSize: 11, fontWeight: '700' },
  preview: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});

const styles = StyleSheet.create({
  row: { marginBottom: 8 },
  rowMe: { alignItems: 'flex-end' },
  rowOther: { alignItems: 'flex-start' },
  senderName: { color: colors.gold, fontSize: 11, marginBottom: 4, marginLeft: 4 },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    borderWidth: 1,
  },
  bubbleMe: {
    backgroundColor: colors.bubbleMe,
    borderColor: colors.bubbleMeBorder,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.bubbleOther,
    borderColor: colors.bubbleOtherBorder,
    borderBottomLeftRadius: 4,
  },
  mediaBubble: { paddingHorizontal: 6, paddingTop: 6 },
  text: { color: colors.text, fontSize: 16, lineHeight: 22 },
  textMe: { color: '#ecfdf5' },
  caption: { marginTop: 6, paddingHorizontal: 6 },
  time: { color: colors.textSoft, fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },
  timeMe: { color: 'rgba(212, 175, 55, 0.75)' },
  image: { width: 220, height: 220, borderRadius: 14 },
  placeholder: { color: colors.textMuted, padding: 24, textAlign: 'center' },
  fileIcon: { marginBottom: 4 },
  fileMeta: { color: colors.textSoft, fontSize: 11, marginTop: 2 },
  osmHint: { color: colors.gold, fontSize: 10, marginTop: 4, fontWeight: '600' },
});
