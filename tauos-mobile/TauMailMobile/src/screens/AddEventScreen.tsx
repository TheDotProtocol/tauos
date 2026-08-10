import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createCalendarEvent, tokens } from '@tau/taumail-mobile-client';
import { TauMailIcon } from '../components/TauMailIcon';
import { startOfDay } from '../utils/calendar';

const COLORS = [
  { id: 'gold', label: 'Primary' },
  { id: 'blue', label: 'Work' },
  { id: 'purple', label: 'Personal' },
] as const;

const AddEventScreen = ({ navigation, route }: any) => {
  const initialDate = route.params?.date ? new Date(route.params.date) : new Date();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [dateStr, setDateStr] = useState(initialDate.toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState<(typeof COLORS)[number]['id']>('gold');
  const [saving, setSaving] = useState(false);

  const buildIso = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const d = new Date(`${dateStr}T00:00:00`);
    d.setHours(h || 0, m || 0, 0, 0);
    return d.toISOString();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter an event title.');
      return;
    }
    setSaving(true);
    try {
      const result = await createCalendarEvent({
        title: title.trim(),
        location: location.trim() || undefined,
        startsAt: buildIso(startTime),
        endsAt: buildIso(endTime),
        color,
      });
      if (!result.ok) {
        Alert.alert('Error', result.error);
        return;
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not create event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <TauMailIcon name="chevronLeft" size={20} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Event</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
          {saving ? (
            <ActivityIndicator color={tokens.colors.pageBase} size="small" />
          ) : (
            <Text style={styles.saveLabel}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Event title"
            placeholderTextColor={tokens.colors.textTertiary}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Optional location"
            placeholderTextColor={tokens.colors.textTertiary}
          />

          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={dateStr}
            onChangeText={setDateStr}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={tokens.colors.textTertiary}
            autoCapitalize="none"
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Start</Text>
              <TextInput
                style={styles.input}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="09:00"
                placeholderTextColor={tokens.colors.textTertiary}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>End</Text>
              <TextInput
                style={styles.input}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="10:00"
                placeholderTextColor={tokens.colors.textTertiary}
              />
            </View>
          </View>

          <Text style={styles.label}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.colorChip, color === c.id && styles.colorChipActive]}
                onPress={() => setColor(c.id)}
              >
                <Text style={[styles.colorChipText, color === c.id && styles.colorChipTextActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.hint}>
            Scheduled for{' '}
            {startOfDay(new Date(`${dateStr}T12:00:00`)).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: tokens.colors.gold,
    borderRadius: tokens.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 72,
    alignItems: 'center',
  },
  saveLabel: { color: tokens.colors.pageBase, fontWeight: '700' },
  form: { padding: 16, paddingBottom: 32 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.textTertiary,
    marginBottom: 6,
    marginTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: tokens.colors.pageSecondary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: tokens.colors.textPrimary,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  colorRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  colorChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageSecondary,
  },
  colorChipActive: {
    borderColor: tokens.colors.goldBorder,
    backgroundColor: tokens.colors.goldSurface,
  },
  colorChipText: { color: tokens.colors.textSecondary, fontWeight: '500', fontSize: 13 },
  colorChipTextActive: { color: tokens.colors.gold, fontWeight: '700' },
  hint: {
    marginTop: 20,
    fontSize: 13,
    color: tokens.colors.textTertiary,
    textAlign: 'center',
  },
});

export default AddEventScreen;
