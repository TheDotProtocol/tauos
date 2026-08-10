import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  fetchEmails,
  fetchStorage,
  fetchCalendar,
  tokens,
  type TauMailEmail,
  type TauMailCalendarAgendaItem,
} from '@tau/taumail-mobile-client';
import { RootState } from '../store';
import { TauMailTopBar } from '../components/TauMailTopBar';
import { TauMailIcon } from '../components/TauMailIcon';
import { TauMailMobileTabBar } from '../components/TauMailMobileTabBar';
import { formatEventWhen } from '../utils/calendar';

const quickActions = [
  { label: 'Compose', sub: 'New draft', icon: 'edit' as const, screen: 'Compose' },
  { label: 'Schedule', sub: 'Calendar', icon: 'calendarPlus' as const, screen: 'Calendar' },
  { label: 'Tasks', sub: 'To-do list', icon: 'checkSquare' as const, screen: 'Tasks' },
  { label: 'AI Assist', sub: 'Summarize', icon: 'wandSparkles' as const, screen: 'AiAssistant' },
];

const goInbox = (navigation: any) =>
  navigation.navigate('MailFolder', { folder: 'inbox', title: 'Inbox' });

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inboxTotal, setInboxTotal] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [latestDraft, setLatestDraft] = useState<TauMailEmail | null>(null);
  const [nextEvent, setNextEvent] = useState<TauMailCalendarAgendaItem | null>(null);
  const [todayEventCount, setTodayEventCount] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageTotal, setStorageTotal] = useState(250);

  useEffect(() => {
    (async () => {
      try {
        const [inbox, drafts, storage, calendar] = await Promise.all([
          fetchEmails('inbox'),
          fetchEmails('drafts'),
          fetchStorage().catch(() => null),
          fetchCalendar().catch(() => null),
        ]);
        setInboxTotal(inbox.length);
        setUnreadCount(inbox.filter((e) => e.unread).length);
        setDraftCount(drafts.length);
        setLatestDraft(drafts[0] ?? null);
        if (storage) {
          setStorageUsed(storage.usedGb);
          setStorageTotal(storage.totalGb);
        }
        if (calendar) {
          setTodayEventCount(calendar.agenda.length);
          setNextEvent(calendar.agenda[0] ?? null);
        }
      } catch {
        /* defaults */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const displayName = user?.name?.split(' ')[0] || 'there';
  const storagePct = Math.min(100, storageTotal > 0 ? (storageUsed / storageTotal) * 100 : 0);

  return (
    <SafeAreaView style={styles.container}>
      <TauMailTopBar
        userName={user?.name}
        userEmail={user?.email}
        avatarUrl={user?.avatarUrl}
        onNotificationsPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Welcome back, {displayName}</Text>
        <TouchableOpacity activeOpacity={0.85} onPress={() => goInbox(navigation)}>
          <Text style={styles.subtitle}>
            {unreadCount > 0 ? (
              <>
                You have{' '}
                <Text style={styles.gold}>
                  {unreadCount} unread{unreadCount === 1 ? '' : 's'}
                </Text>{' '}
                in your inbox.
              </>
            ) : (
              'Your inbox is clear. Compose a new message anytime.'
            )}
          </Text>
        </TouchableOpacity>

        <View style={styles.quickRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickItem}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={styles.quickCircle}>
                <TauMailIcon name={action.icon} size={18} color={tokens.colors.gold} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
              <Text style={styles.quickSub}>{action.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={tokens.colors.gold} style={{ marginTop: 24 }} />
        ) : (
          <>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => goInbox(navigation)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardEyebrowGold}>INBOX OVERVIEW</Text>
                <TauMailIcon name="mail" size={16} color={tokens.colors.gold} />
              </View>
              <Text style={styles.cardBig}>
                {unreadCount} <Text style={styles.cardBigMuted}>unreads</Text>
              </Text>
              <Text style={styles.cardFoot}>
                {inboxTotal.toLocaleString()} message{inboxTotal === 1 ? '' : 's'} loaded
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Calendar')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardEyebrow}>UPCOMING ALIGNMENT</Text>
                <TauMailIcon name="clock" size={16} color={tokens.colors.textTertiary} />
              </View>
              {nextEvent ? (
                <>
                  <Text style={styles.cardTitle}>{nextEvent.title}</Text>
                  <Text style={styles.cardGoldFoot}>{formatEventWhen(nextEvent)}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle}>
                    {todayEventCount > 0 ? `${todayEventCount} event${todayEventCount === 1 ? '' : 's'} today` : 'No events today'}
                  </Text>
                  <Text style={styles.cardFoot}>Open calendar to view your schedule</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('MailFolder', { folder: 'drafts', title: 'Drafts' })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <TauMailIcon name="sparkles" size={16} color={tokens.colors.gold} />
                  <Text style={styles.cardTitle}>Saved Drafts</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {draftCount} DRAFT{draftCount === 1 ? '' : 'S'}
                  </Text>
                </View>
              </View>
              {latestDraft ? (
                <View style={styles.draftBox}>
                  <Text style={styles.draftTitle} numberOfLines={1}>
                    {latestDraft.subject || 'Untitled draft'}
                  </Text>
                  <Text style={styles.draftPreview} numberOfLines={2}>
                    {latestDraft.preview}
                  </Text>
                </View>
              ) : (
                <Text style={styles.cardFoot}>No drafts yet. Start composing to save one.</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Storage')}
            >
              <View style={styles.storageRow}>
                <Text style={styles.cardTitle}>Cloud Storage</Text>
                <Text style={styles.storageValue}>
                  {storageUsed.toFixed(1)} / {storageTotal} GB
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${storagePct}%` }]} />
              </View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <TauMailMobileTabBar active="home" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  scroll: { paddingHorizontal: 16, paddingBottom: 16 },
  welcome: {
    fontSize: 26,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  gold: { color: tokens.colors.gold, fontWeight: '600' },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  quickItem: { alignItems: 'center', width: '23%' },
  quickCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: tokens.colors.goldBorder,
    backgroundColor: tokens.colors.goldSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    textAlign: 'center',
  },
  quickSub: {
    fontSize: 10,
    color: tokens.colors.textTertiary,
    textAlign: 'center',
    marginTop: 2,
  },
  card: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: 16,
    marginTop: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardEyebrowGold: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: tokens.colors.gold,
  },
  cardEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: tokens.colors.textTertiary,
  },
  cardBig: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  cardBigMuted: {
    fontSize: 18,
    fontWeight: '500',
    color: tokens.colors.textSecondary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  cardFoot: {
    marginTop: 8,
    fontSize: 12,
    color: tokens.colors.textTertiary,
  },
  cardGoldFoot: {
    marginTop: 6,
    fontSize: 13,
    color: tokens.colors.gold,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: tokens.colors.goldSurface,
    borderWidth: 1,
    borderColor: tokens.colors.goldBorder,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.gold,
  },
  draftBox: {
    marginTop: 4,
    backgroundColor: tokens.colors.pageBase,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: 12,
  },
  draftTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  draftPreview: {
    marginTop: 4,
    fontSize: 12,
    color: tokens.colors.textTertiary,
    lineHeight: 18,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storageValue: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.pageBase,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.gold,
    borderRadius: 4,
  },
});

export default DashboardScreen;
