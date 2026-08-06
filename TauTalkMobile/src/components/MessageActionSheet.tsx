import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import MIcon from './MIcon';
import { colors, radii } from '../theme';

type Props = {
  visible: boolean;
  onReply: () => void;
  onClose: () => void;
};

/** Long-press message action sheet (mobile equivalent of web right-click). */
export default function MessageActionSheet({ visible, onReply, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <Pressable
            style={styles.row}
            onPress={() => {
              onReply();
              onClose();
            }}>
            <MIcon name="reply" size={20} color={colors.goldLight} />
            <Text style={styles.label}>Reply</Text>
          </Pressable>
          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 16,
    paddingBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: radii.md,
  },
  label: { color: colors.text, fontSize: 16, fontWeight: '600' },
  cancel: { marginTop: 8, alignItems: 'center', paddingVertical: 12 },
  cancelText: { color: colors.textMuted, fontWeight: '600' },
});
