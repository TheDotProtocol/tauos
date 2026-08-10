import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchNotifications,
  markNotificationsRead,
  tokens,
  type TauMailNotification,
} from '@tau/taumail-mobile-client';
import { ScreenHeader } from '../components/ScreenHeader';

const NotificationsScreen = ({ navigation }: any) => {
  const [items, setItems] = useState<TauMailNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const rows = await fetchNotifications();
      setItems(rows);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const markRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await markNotificationsRead({ id });
    } catch {
      /* revert on next refresh */
    }
  };

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markNotificationsRead({ markAllRead: true });
    } catch {
      /* ignore */
    }
  };

  const unread = items.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : undefined}
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />

      {unread > 0 ? (
        <TouchableOpacity style={styles.markAll} onPress={markAllRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      ) : null}

      {loading ? (
        <ActivityIndicator color={tokens.colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.gold} />}
          ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, !item.isRead && styles.cardUnread]}
              onPress={() => !item.isRead && markRead(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.meta}</Text>
              </View>
              {!item.isRead ? <View style={styles.unreadDot} /> : null}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  markAll: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 8,
  },
  markAllText: {
    fontSize: 13,
    color: tokens.colors.gold,
    fontWeight: '600',
  },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: 14,
    marginBottom: 10,
  },
  cardUnread: {
    borderColor: tokens.colors.goldBorder,
    backgroundColor: tokens.colors.goldSurface,
  },
  cardBody: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    color: tokens.colors.textTertiary,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.gold,
  },
  empty: {
    textAlign: 'center',
    color: tokens.colors.textTertiary,
    marginTop: 32,
    fontSize: 14,
  },
});

export default NotificationsScreen;
