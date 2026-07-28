import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Avatar from './Avatar';
import MIcon from './MIcon';
import { colors, radii } from '../theme';

export type CallMode = 'voice' | 'video';

type Props = {
  visible: boolean;
  mode: CallMode;
  peerName: string;
  peerAvatar?: string | null;
  onClose: () => void;
};

export default function CallPreviewScreen({
  visible,
  mode,
  peerName,
  peerAvatar,
  onClose,
}: Props) {
  const [seconds, setSeconds] = useState(0);
  const isVideo = mode === 'video';

  useEffect(() => {
    if (!visible) {
      setSeconds(0);
      return;
    }
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [visible]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.container, isVideo ? styles.videoBg : styles.voiceBg]}>
        <View style={styles.previewBadge}>
          <MIcon name="science" size={16} color={colors.goldLight} />
          <Text style={styles.previewText}>Preview · not connected yet</Text>
        </View>

        {isVideo ? (
          <View style={styles.remoteVideo}>
            <Avatar name={peerName} size={120} gold imageUrl={peerAvatar} />
            <Text style={styles.peerName}>{peerName}</Text>
            <Text style={styles.timer}>
              {mm}:{ss}
            </Text>
            <View style={styles.selfPreview}>
              <MIcon name="videocam" size={22} color={colors.goldLight} />
              <Text style={styles.selfLabel}>You</Text>
            </View>
          </View>
        ) : (
          <View style={styles.voiceCenter}>
            <Avatar name={peerName} size={140} gold imageUrl={peerAvatar} />
            <Text style={styles.peerName}>{peerName}</Text>
            <Text style={styles.status}>Encrypted voice · preview UI</Text>
            <Text style={styles.timer}>
              {mm}:{ss}
            </Text>
          </View>
        )}

        <View style={styles.controls}>
          <Control icon="mic" label="Mute" />
          <Control icon={isVideo ? 'videocam-off' : 'volume-up'} label={isVideo ? 'Cam off' : 'Speaker'} />
          <Pressable style={styles.endCall} onPress={onClose}>
            <MIcon name="call-end" size={32} color="#fff" />
          </Pressable>
          <Control icon="flip-camera-ios" label="Flip" />
          <Control icon="more-vert" label="More" />
        </View>

        <Text style={styles.footer}>
          Voice & video calls ship after public beta. This is the production UI preview.
        </Text>
      </View>
    </Modal>
  );
}

function Control({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.controlItem}>
      <View style={styles.controlCircle}>
        <MIcon name={icon} size={24} color={colors.text} />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingBottom: 32 },
  voiceBg: { backgroundColor: '#0a1014' },
  videoBg: { backgroundColor: '#050508' },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: colors.goldDim,
    borderRadius: radii.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  previewText: { color: colors.goldLight, fontSize: 12, fontWeight: '600' },
  voiceCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  remoteVideo: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  peerName: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 20 },
  status: { color: colors.textMuted, marginTop: 8 },
  timer: { color: colors.goldLight, fontSize: 18, marginTop: 12, fontWeight: '600' },
  selfPreview: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: radii.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  selfLabel: { color: colors.textMuted, fontSize: 12 },
  controls: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    marginTop: 12,
  },
  controlItem: { alignItems: 'center', width: 64 },
  controlCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlLabel: { color: colors.textSoft, fontSize: 11, marginTop: 6 },
  endCall: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  footer: {
    color: colors.textSoft,
    textAlign: 'center',
    fontSize: 11,
    paddingHorizontal: 24,
    marginTop: 20,
    lineHeight: 16,
  },
});
