import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import GlassPanel from './GlassPanel';
import MIcon from './MIcon';
import { colors, radii } from '../theme';

export type AttachmentAction = 'camera' | 'gallery' | 'document' | 'location' | 'voice';
export type CallPreviewAction = 'voice' | 'video';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (action: AttachmentAction) => void;
  onCallPreview: (mode: CallPreviewAction) => void;
  recording?: boolean;
  onStartVoice?: () => void;
  onStopVoice?: () => void;
};

const ATTACHMENTS: {
  id: AttachmentAction;
  icon: string;
  label: string;
  sub: string;
}[] = [
  { id: 'camera', icon: 'photo-camera', label: 'Camera', sub: 'Take a photo' },
  { id: 'gallery', icon: 'photo-library', label: 'Gallery', sub: 'Photos & images' },
  { id: 'document', icon: 'attach-file', label: 'Document', sub: 'PDF, docs, files' },
  { id: 'location', icon: 'location-on', label: 'Location', sub: 'Share where you are' },
  { id: 'voice', icon: 'mic', label: 'Voice note', sub: 'Hold to record in chat' },
];

const CALLS: { id: CallPreviewAction; icon: string; label: string }[] = [
  { id: 'voice', icon: 'call', label: 'Voice preview' },
  { id: 'video', icon: 'videocam', label: 'Video preview' },
];

export default function AttachmentSheet({
  visible,
  onClose,
  onPick,
  onCallPreview,
  recording,
  onStartVoice,
  onStopVoice,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheetWrap} onPress={(e) => e.stopPropagation()}>
          <GlassPanel style={styles.sheet} strong>
            <Text style={styles.title}>Share</Text>
            <Text style={styles.subtitle}>Tau Talk · end-to-end encrypted</Text>
            {recording ? (
              <Pressable style={styles.recordingBanner} onPress={onStopVoice}>
                <MIcon name="stop" size={22} color={colors.danger} />
                <Text style={styles.recordingText}>Recording… tap to send voice note</Text>
              </Pressable>
            ) : null}

            <View style={styles.callRow}>
              {CALLS.map((c) => (
                <Pressable
                  key={c.id}
                  style={styles.callTile}
                  onPress={() => {
                    onClose();
                    onCallPreview(c.id);
                  }}>
                  <View style={styles.iconCircle}>
                    <MIcon name={c.icon} size={26} color={colors.goldLight} />
                  </View>
                  <Text style={styles.callLabel}>{c.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.grid}>
              {ATTACHMENTS.map((a) => (
                <Pressable
                  key={a.id}
                  style={styles.tile}
                  onPress={() => {
                    if (a.id === 'voice') {
                      onStartVoice?.();
                      return;
                    }
                    onClose();
                    onPick(a.id);
                  }}>
                  <View style={styles.iconCircleSm}>
                    <MIcon name={a.icon} size={22} color={colors.goldLight} />
                  </View>
                  <Text style={styles.tileLabel}>{a.label}</Text>
                  <Text style={styles.tileSub}>{a.sub}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </GlassPanel>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheetWrap: { width: '100%' },
  sheet: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingBottom: 28,
  },
  title: { color: colors.goldLight, fontSize: 20, fontWeight: '800' },
  subtitle: { color: colors.textSoft, fontSize: 12, marginTop: 4, marginBottom: 14 },
  recordingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderRadius: radii.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.35)',
  },
  recordingText: { color: colors.danger, fontWeight: '600', flex: 1 },
  callRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  callTile: {
    flex: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderRadius: radii.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  callLabel: { color: colors.goldLight, fontWeight: '700', fontSize: 13, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    width: '47%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSm: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tileLabel: { color: colors.text, fontWeight: '700', fontSize: 15 },
  tileSub: { color: colors.textSoft, fontSize: 11, marginTop: 2 },
  cancelBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: colors.textMuted, fontWeight: '600' },
});
