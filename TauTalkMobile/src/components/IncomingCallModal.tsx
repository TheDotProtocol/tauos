import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import MIcon from './MIcon';
import type { IncomingCall } from '../api/client';
import { colors, radii } from '../theme';

type Props = {
  call: IncomingCall | null;
  onAccept: () => void;
  onDecline: () => void;
};

export default function IncomingCallModal({ call, onAccept, onDecline }: Props) {
  if (!call) return null;

  const callerName = call.caller?.full_name || call.caller?.username || 'Someone';
  const isVideo = call.mode === 'video';

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.kicker}>Incoming {isVideo ? 'video' : 'voice'} call</Text>
          <Avatar
            name={callerName}
            size={96}
            gold
            imageUrl={call.caller?.avatar_url ?? null}
          />
          <Text style={styles.name}>{callerName}</Text>
          <Text style={styles.sub}>TauTalk · encrypted</Text>

          <View style={styles.actions}>
            <Pressable style={styles.decline} onPress={onDecline}>
              <MIcon name="call-end" size={28} color="#fff" />
              <Text style={styles.actionLabel}>Decline</Text>
            </Pressable>
            <Pressable style={styles.accept} onPress={onAccept}>
              <MIcon name={isVideo ? 'videocam' : 'call'} size={28} color="#1a1200" />
              <Text style={[styles.actionLabel, styles.acceptLabel]}>Accept</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 28,
    alignItems: 'center',
  },
  kicker: {
    color: colors.goldLight,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
  },
  sub: { color: colors.textMuted, marginTop: 6, marginBottom: 28 },
  actions: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  decline: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accept: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  acceptLabel: { color: '#1a1200' },
});
