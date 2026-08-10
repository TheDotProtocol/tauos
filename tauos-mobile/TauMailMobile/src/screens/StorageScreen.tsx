import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchStorage,
  tokens,
  type TauMailStorageData,
} from '@tau/taumail-mobile-client';
import { ScreenHeader } from '../components/ScreenHeader';
import { TauMailIcon } from '../components/TauMailIcon';

const StorageScreen = ({ navigation }: any) => {
  const [data, setData] = useState<TauMailStorageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const storage = await fetchStorage();
      setData(storage);
    } catch {
      setData(null);
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

  const usedGb = data?.usedGb ?? 0;
  const totalGb = data?.totalGb ?? 250;
  const pct = totalGb > 0 ? Math.min(100, (usedGb / totalGb) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Storage"
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />

      {loading ? (
        <ActivityIndicator color={tokens.colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.gold} />}
        >
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <TauMailIcon name="database" size={18} color={tokens.colors.gold} />
              <Text style={styles.summaryTitle}>Cloud Storage</Text>
            </View>
            <Text style={styles.summaryValue}>
              {usedGb.toFixed(1)} / {totalGb} GB
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.summaryFoot}>{(100 - pct).toFixed(0)}% available</Text>
          </View>

          <Text style={styles.sectionTitle}>Breakdown</Text>
          {data?.breakdown?.length ? (
            data.breakdown.map((row) => {
              const rowPct = row.total > 0 ? Math.min(100, (row.used / row.total) * 100) : 0;
              return (
                <View key={row.label} style={styles.breakdownCard}>
                  <View style={styles.breakdownHeader}>
                    <View style={styles.breakdownLabelRow}>
                      <View style={[styles.colorDot, { backgroundColor: row.color }]} />
                      <Text style={styles.breakdownLabel}>{row.label}</Text>
                    </View>
                    <Text style={styles.breakdownValue}>
                      {row.used} / {row.total} GB
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${rowPct}%`, backgroundColor: row.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.empty}>Storage details unavailable</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  summaryCard: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: 16,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.pageBase,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.gold,
    borderRadius: 4,
  },
  summaryFoot: {
    marginTop: 8,
    fontSize: 12,
    color: tokens.colors.textTertiary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: tokens.colors.textTertiary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  breakdownCard: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: 14,
    marginBottom: 10,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  breakdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  breakdownValue: {
    fontSize: 12,
    color: tokens.colors.textSecondary,
    fontWeight: '600',
  },
  empty: {
    fontSize: 14,
    color: tokens.colors.textTertiary,
  },
});

export default StorageScreen;
