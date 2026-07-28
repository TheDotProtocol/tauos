import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'react-native';
import MIcon from './MIcon';
import { colors } from '../theme';

type Props = {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
};

export default function ImageViewerModal({ visible, uri, onClose }: Props) {
  const { width, height } = useWindowDimensions();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
          <MIcon name="close" size={28} color={colors.text} />
        </Pressable>
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: width - 24, height: height * 0.72 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.loading}>Loading…</Text>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 2,
    padding: 8,
  },
  loading: { color: colors.textMuted },
});
