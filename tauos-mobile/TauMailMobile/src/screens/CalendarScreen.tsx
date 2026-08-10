import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchCalendar,
  tokens,
  type TauMailCalendarData,
} from '@tau/taumail-mobile-client';
import { ScreenHeader } from '../components/ScreenHeader';
import { TauMailMobileTabBar } from '../components/TauMailMobileTabBar';
import { TauMailIcon } from '../components/TauMailIcon';
import {
  addDays,
  addMonths,
  CALENDAR_HOURS,
  endOfMonth,
  eventsForDay,
  formatHourLabel,
  formatMonthLabel,
  getMonthGrid,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type CalendarViewMode,
} from '../utils/calendar';

const VIEW_MODES: { id: CalendarViewMode; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

const WEEKDAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const eventColors: Record<string, { bg: string; border: string }> = {
  gold: { bg: 'rgba(212,168,67,0.12)', border: 'rgba(212,168,67,0.3)' },
  blue: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  purple: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)' },
};

type CalendarEvent = TauMailCalendarData['events'][number];

const CalendarScreen = ({ navigation }: any) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [cursorDate, setCursorDate] = useState(() => startOfDay(new Date()));
  const [data, setData] = useState<TauMailCalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const opts: Parameters<typeof fetchCalendar>[0] = {
        weekStart: startOfWeek(cursorDate).toISOString(),
        date: cursorDate.toISOString(),
      };
      if (viewMode === 'month') {
        opts.rangeStart = startOfMonth(cursorDate).toISOString();
        opts.rangeEnd = endOfMonth(cursorDate).toISOString();
      }
      const calendar = await fetchCalendar(opts);
      setData(calendar);
    } catch {
      setData(null);
    }
  }, [cursorDate, viewMode]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const monthLabel = data?.monthLabel ?? formatMonthLabel(cursorDate);

  const navigatePeriod = (direction: -1 | 1) => {
    if (viewMode === 'month') {
      setCursorDate((prev) => startOfDay(addMonths(prev, direction)));
      return;
    }
    if (viewMode === 'day') {
      setCursorDate((prev) => startOfDay(addDays(prev, direction)));
      return;
    }
    setCursorDate((prev) => startOfDay(addDays(prev, direction * 7)));
  };

  const selectDay = (day: Date) => {
    setCursorDate(startOfDay(day));
    if (viewMode !== 'day') setViewMode('day');
  };

  const monthGrid = useMemo(
    () => getMonthGrid(cursorDate.getFullYear(), cursorDate.getMonth()),
    [cursorDate],
  );

  const eventDayKeys = useMemo(() => {
    const set = new Set<string>();
    data?.events?.forEach((ev) => {
      if (ev.startsAt) set.add(new Date(ev.startsAt).toDateString());
    });
    return set;
  }, [data?.events]);

  const dayEvents = useMemo(() => {
    if (!data?.events) return [];
    return eventsForDay(data.events, cursorDate).sort(
      (a, b) => new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime(),
    );
  }, [data?.events, cursorDate]);

  const weekDaysData = useMemo(() => {
    const weekStart = startOfWeek(cursorDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      return {
        day,
        label: day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        events: eventsForDay(data?.events || [], day),
      };
    });
  }, [cursorDate, data?.events]);

  const renderDayTimeGrid = () => (
    <View style={styles.timeGrid}>
      {CALENDAR_HOURS.map((hour) => {
        const hourEvents = dayEvents.filter((ev) => {
          if (!ev.startsAt) return false;
          return new Date(ev.startsAt).getHours() === hour;
        });
        return (
          <View key={hour} style={styles.hourRow}>
            <Text style={styles.hourLabel}>{formatHourLabel(hour)}</Text>
            <View style={styles.hourSlot}>
              {hourEvents.map((ev) => {
                const colors = eventColors[ev.color] || eventColors.gold;
                return (
                  <View
                    key={ev.id}
                    style={[styles.timeEvent, { backgroundColor: colors.bg, borderColor: colors.border }]}
                  >
                    <Text style={styles.timeEventTitle}>{ev.title}</Text>
                    <Text style={styles.timeEventMeta}>
                      {ev.top}
                      {ev.end ? ` – ${ev.end}` : ''}
                      {ev.location ? ` · ${ev.location}` : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
      {dayEvents.length === 0 ? (
        <Text style={styles.empty}>No events on this day</Text>
      ) : null}
    </View>
  );

  const renderWeekView = () => (
    <View style={styles.weekContainer}>
      <View style={styles.weekRow}>
        {weekDaysData.map(({ day, label }) => {
          const selected = isSameDay(day, cursorDate);
          const today = isSameDay(day, new Date());
          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[styles.weekDayBtn, selected && styles.weekDayBtnActive]}
              onPress={() => selectDay(day)}
            >
              <Text style={[styles.weekDayLabel, selected && styles.weekDayLabelActive]}>{label.split(' ')[0]}</Text>
              <Text style={[styles.weekDayNum, selected && styles.weekDayNumActive]}>{day.getDate()}</Text>
              {today && !selected ? <View style={styles.todayDot} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {weekDaysData.map(({ day, events }) => {
        if (!events.length) return null;
        return (
          <View key={day.toISOString()} style={styles.weekDayBlock}>
            <Text style={styles.weekDayBlockTitle}>
              {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
            {events.map((ev) => (
              <TouchableOpacity
                key={ev.id}
                style={styles.weekEventRow}
                onPress={() => {
                  setCursorDate(startOfDay(day));
                  setViewMode('day');
                }}
              >
                <Text style={styles.weekEventTime}>{ev.top}</Text>
                <View style={styles.weekEventBody}>
                  <Text style={styles.weekEventTitle}>{ev.title}</Text>
                  {ev.location ? <Text style={styles.weekEventLoc}>{ev.location}</Text> : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
      {weekDaysData.every((d) => d.events.length === 0) ? (
        <Text style={styles.empty}>No events this week</Text>
      ) : null}
    </View>
  );

  const renderMonthView = () => (
    <View style={styles.monthGridWrap}>
      <View style={styles.monthGridHeader}>
        {WEEKDAY_HEADERS.map((label, i) => (
          <Text key={`${label}-${i}`} style={styles.monthGridHeaderText}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.monthGrid}>
        {monthGrid.map((day, i) => {
          if (!day) return <View key={`empty-${i}`} style={styles.monthCell} />;
          const selected = isSameDay(day, cursorDate);
          const today = isSameDay(day, new Date());
          const hasEvent = eventDayKeys.has(day.toDateString());
          return (
            <TouchableOpacity key={day.toISOString()} style={styles.monthCell} onPress={() => selectDay(day)}>
              <View style={[styles.monthDay, selected && styles.monthDaySelected, today && !selected && styles.monthDayToday]}>
                <Text style={[styles.monthDayText, selected && styles.monthDayTextSelected]}>{day.getDate()}</Text>
                {hasEvent ? <View style={styles.monthEventDot} /> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.monthHint}>Tap a day to open the day schedule</Text>
    </View>
  );

  const dayHeader = cursorDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Calendar"
        subtitle={viewMode === 'day' ? dayHeader : monthLabel}
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        rightAction={
          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={() => navigation.navigate('AddEvent', { date: cursorDate.toISOString() })}
          >
            <TauMailIcon name="plus" size={18} color={tokens.colors.gold} />
          </TouchableOpacity>
        }
      />

      <View style={styles.monthBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigatePeriod(-1)}>
          <TauMailIcon name="chevronLeft" size={18} color={tokens.colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{viewMode === 'day' ? dayHeader : monthLabel}</Text>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigatePeriod(1)}>
          <View style={styles.chevronFlip}>
            <TauMailIcon name="chevronLeft" size={18} color={tokens.colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.viewToggle}>
        {VIEW_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.viewBtn, viewMode === mode.id && styles.viewBtnActive]}
            onPress={() => setViewMode(mode.id)}
          >
            <Text style={[styles.viewBtnText, viewMode === mode.id && styles.viewBtnTextActive]}>{mode.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={tokens.colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.gold} />}
        >
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayTimeGrid()}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEvent', { date: cursorDate.toISOString() })}
      >
        <TauMailIcon name="plus" size={24} color={tokens.colors.pageBase} />
      </TouchableOpacity>

      <TauMailMobileTabBar active="calendar" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  headerAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: tokens.colors.goldBorder,
    backgroundColor: tokens.colors.goldSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronFlip: { transform: [{ scaleX: -1 }] },
  monthLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: tokens.radius.md,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  viewBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: tokens.radius.sm },
  viewBtnActive: { backgroundColor: tokens.colors.goldSurface },
  viewBtnText: { fontSize: 13, fontWeight: '500', color: tokens.colors.textSecondary },
  viewBtnTextActive: { color: tokens.colors.gold, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingBottom: 100 },
  monthGridWrap: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: 12,
  },
  monthGridHeader: { flexDirection: 'row', marginBottom: 8 },
  monthGridHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: tokens.colors.textTertiary,
  },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  monthCell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  monthDay: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  monthDaySelected: { backgroundColor: tokens.colors.gold },
  monthDayToday: { borderWidth: 1, borderColor: tokens.colors.goldBorder },
  monthDayText: { fontSize: 14, color: tokens.colors.textSecondary, fontWeight: '500' },
  monthDayTextSelected: { color: tokens.colors.pageBase, fontWeight: '700' },
  monthEventDot: {
    position: 'absolute',
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: tokens.colors.gold,
  },
  monthHint: {
    marginTop: 12,
    fontSize: 12,
    color: tokens.colors.textTertiary,
    textAlign: 'center',
  },
  weekContainer: { gap: 12 },
  weekRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  weekDayBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageSecondary,
    alignItems: 'center',
  },
  weekDayBtnActive: { borderColor: tokens.colors.goldBorder, backgroundColor: tokens.colors.goldSurface },
  weekDayLabel: { fontSize: 10, color: tokens.colors.textTertiary, fontWeight: '600' },
  weekDayLabelActive: { color: tokens.colors.gold },
  weekDayNum: { fontSize: 16, fontWeight: '700', color: tokens.colors.textPrimary, marginTop: 2 },
  weekDayNumActive: { color: tokens.colors.gold },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: tokens.colors.gold,
    marginTop: 4,
  },
  weekDayBlock: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: 12,
  },
  weekDayBlockTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.gold,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  weekEventRow: { flexDirection: 'row', gap: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: tokens.colors.border },
  weekEventTime: { fontSize: 12, fontWeight: '600', color: tokens.colors.gold, minWidth: 58 },
  weekEventBody: { flex: 1 },
  weekEventTitle: { fontSize: 14, fontWeight: '600', color: tokens.colors.textPrimary },
  weekEventLoc: { fontSize: 12, color: tokens.colors.textTertiary, marginTop: 2 },
  timeGrid: { gap: 0 },
  hourRow: {
    flexDirection: 'row',
    minHeight: 56,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  hourLabel: {
    width: 56,
    fontSize: 11,
    color: tokens.colors.textTertiary,
    paddingTop: 8,
    fontWeight: '500',
  },
  hourSlot: { flex: 1, paddingVertical: 4, gap: 4 },
  timeEvent: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  timeEventTitle: { fontSize: 14, fontWeight: '600', color: tokens.colors.textPrimary },
  timeEventMeta: { fontSize: 11, color: tokens.colors.textTertiary, marginTop: 2 },
  empty: { fontSize: 14, color: tokens.colors.textTertiary, textAlign: 'center', marginTop: 24 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 88,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default CalendarScreen;
