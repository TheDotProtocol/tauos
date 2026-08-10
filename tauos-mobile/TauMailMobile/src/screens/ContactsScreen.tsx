import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchContacts,
  tokens,
  type TauMailContact,
} from '@tau/taumail-mobile-client';
import { ScreenHeader } from '../components/ScreenHeader';
import { TauMailIcon } from '../components/TauMailIcon';
import { TauMailUserAvatar } from '../components/TauMailUserAvatar';

const ContactsScreen = ({ navigation }: any) => {
  const [contacts, setContacts] = useState<TauMailContact[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const rows = await fetchContacts();
      setContacts(rows);
    } catch {
      setContacts([]);
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.organization || '').toLowerCase().includes(q) ||
        (c.tauId || '').toLowerCase().includes(q),
    );
  }, [contacts, query]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const openCompose = (email: string) => {
    if (email) navigation.navigate('Compose', { to: email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Contacts"
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        rightAction={
          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={() => navigation.navigate('AddContact')}
          >
            <TauMailIcon name="plus" size={18} color={tokens.colors.gold} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchRow}>
        <TauMailIcon name="search" size={16} color={tokens.colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search contacts…"
          placeholderTextColor={tokens.colors.textTertiary}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={tokens.colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.colors.gold} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>No contacts yet</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('AddContact')}>
                <TauMailIcon name="plus" size={16} color={tokens.colors.pageBase} />
                <Text style={styles.emptyBtnText}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TauMailUserAvatar name={item.name} avatarUrl={item.avatar} size={48} />
              <View style={styles.cardBody}>
                <Text style={styles.name}>{item.name}</Text>
                {item.designation || item.role ? (
                  <Text style={styles.role}>{item.designation || item.role}</Text>
                ) : null}
                {item.organization ? <Text style={styles.org}>{item.organization}</Text> : null}
                <Text style={styles.email}>{item.email}</Text>
                {item.phone ? (
                  <Text style={styles.phone}>
                    {item.phoneCountryCode || '+1'} {item.phone}
                  </Text>
                ) : null}
                {item.tauId ? <Text style={styles.tauId}>Tau ID: {item.tauId}</Text> : null}
              </View>
              {item.email ? (
                <TouchableOpacity style={styles.msgBtn} onPress={() => openCompose(item.email)}>
                  <Text style={styles.msgBtnText}>Message</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddContact')}>
        <TauMailIcon name="plus" size={24} color={tokens.colors.pageBase} />
      </TouchableOpacity>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: tokens.colors.textPrimary, padding: 0 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: tokens.colors.pageSecondary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  cardBody: { minWidth: 0 },
  name: { fontSize: 16, fontWeight: '700', color: tokens.colors.textPrimary },
  role: { fontSize: 13, color: tokens.colors.textSecondary, marginTop: 2 },
  org: { fontSize: 12, color: tokens.colors.textTertiary, marginTop: 2 },
  email: { fontSize: 12, color: tokens.colors.gold, marginTop: 6 },
  phone: { fontSize: 12, color: tokens.colors.textSecondary, marginTop: 2 },
  tauId: { fontSize: 11, color: tokens.colors.textTertiary, marginTop: 2 },
  msgBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  msgBtnText: { fontSize: 12, color: tokens.colors.textSecondary, fontWeight: '600' },
  emptyWrap: { alignItems: 'center', marginTop: 48, gap: 16 },
  empty: { textAlign: 'center', color: tokens.colors.textTertiary, fontSize: 14 },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: tokens.colors.gold,
    borderRadius: tokens.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyBtnText: { color: tokens.colors.pageBase, fontWeight: '700' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
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

export default ContactsScreen;
