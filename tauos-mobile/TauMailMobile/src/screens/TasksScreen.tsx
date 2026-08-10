import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchTasks,
  toggleTask,
  tokens,
  type TauMailTask,
} from '@tau/taumail-mobile-client';
import { ScreenHeader } from '../components/ScreenHeader';
import { TauMailIcon } from '../components/TauMailIcon';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'done', label: 'Done' },
] as const;

const priorityStyle = (priority: string) => {
  if (priority === 'urgent') return styles.priorityUrgent;
  if (priority === 'high') return styles.priorityHigh;
  return styles.priorityNormal;
};

const TasksScreen = ({ navigation }: any) => {
  const [tasks, setTasks] = useState<TauMailTask[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const rows = await fetchTasks();
      setTasks(rows);
    } catch {
      setTasks([]);
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

  const handleToggle = async (task: TauMailTask) => {
    const next = !task.done;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: next } : t)));
    try {
      await toggleTask(task.id, next);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: task.done } : t)));
    }
  };

  const visible = tasks.filter((task) => {
    if (activeTab === 'pending') return !task.done;
    if (activeTab === 'done') return task.done;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Tasks"
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={tokens.colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.gold} />}
          ListEmptyComponent={<Text style={styles.empty}>No tasks yet</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={[styles.check, item.done && styles.checkDone]}
                onPress={() => handleToggle(item)}
              >
                {item.done ? (
                  <TauMailIcon name="checkSquare" size={14} color={tokens.colors.gold} />
                ) : null}
              </TouchableOpacity>
              <View style={styles.cardBody}>
                <Text style={[styles.title, item.done && styles.titleDone]}>{item.title}</Text>
                <Text style={styles.due}>Due {item.due}</Text>
              </View>
              <Text style={[styles.priority, priorityStyle(item.priority)]}>
                {item.priority.toUpperCase()}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: tokens.radius.md,
  },
  tabActive: {
    backgroundColor: tokens.colors.goldSurface,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: tokens.colors.textSecondary,
  },
  tabTextActive: {
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
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    borderColor: tokens.colors.goldBorder,
    backgroundColor: tokens.colors.goldSurface,
  },
  cardBody: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  titleDone: {
    color: tokens.colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  due: {
    fontSize: 11,
    color: tokens.colors.textTertiary,
    marginTop: 4,
  },
  priority: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  priorityUrgent: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    color: '#f87171',
  },
  priorityHigh: {
    backgroundColor: tokens.colors.goldSurface,
    color: tokens.colors.gold,
  },
  priorityNormal: {
    backgroundColor: tokens.colors.pageBase,
    color: tokens.colors.textTertiary,
  },
  empty: {
    textAlign: 'center',
    color: tokens.colors.textTertiary,
    marginTop: 32,
    fontSize: 14,
  },
});

export default TasksScreen;
