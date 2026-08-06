import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TAUTALK_EMOJI_CATEGORIES, TAUTALK_QUICK_EMOJIS } from '../utils/emojis';
import { colors, radii } from '../theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
};

export default function EmojiPicker({ visible, onClose, onPick }: Props) {
  const [categoryId, setCategoryId] = useState(TAUTALK_EMOJI_CATEGORIES[0].id);
  const category =
    TAUTALK_EMOJI_CATEGORIES.find((c) => c.id === categoryId) ?? TAUTALK_EMOJI_CATEGORIES[0];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Emoji</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow}>
            {TAUTALK_QUICK_EMOJIS.map((emoji) => (
              <Pressable key={emoji} style={styles.emojiBtn} onPress={() => onPick(emoji)}>
                <Text style={styles.emoji}>{emoji}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
            {TAUTALK_EMOJI_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={[styles.tab, categoryId === cat.id && styles.tabActive]}
                onPress={() => setCategoryId(cat.id)}>
                <Text style={styles.tabEmoji}>{cat.icon}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView style={styles.gridScroll} contentContainerStyle={styles.grid}>
            {category.emojis.map((emoji) => (
              <Pressable key={`${category.id}-${emoji}`} style={styles.emojiBtn} onPress={() => onPick(emoji)}>
                <Text style={styles.emoji}>{emoji}</Text>
              </Pressable>
            ))}
          </ScrollView>
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
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 16,
    paddingBottom: 28,
    maxHeight: '55%',
  },
  title: { color: colors.goldLight, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  quickRow: { marginBottom: 8, maxHeight: 44 },
  tabs: { marginBottom: 8, maxHeight: 44 },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
    marginRight: 6,
  },
  tabActive: {
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tabEmoji: { fontSize: 20 },
  gridScroll: { maxHeight: 220 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  emojiBtn: {
    width: '12.5%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
});
