import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  fetchEmailsStart,
  fetchEmailsSuccess,
  fetchEmailsFailure,
  markEmailAsRead,
  toggleEmailStar,
  setSearchQuery,
  setCurrentFolder,
  Email,
} from '../store/slices/emailSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchEmails,
  searchEmails,
  markEmailRead,
  starEmail,
  OfflineError,
  tokens,
  type TauMailFolder,
} from '@tau/taumail-mobile-client';
import { OfflineBanner } from '../components/OfflineBanner';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { mapApiEmailToLocal } from '../utils/emailMapper';
import { TauMailIcon } from '../components/TauMailIcon';
import { ScreenHeader } from '../components/ScreenHeader';
import { TauMailMobileTabBar } from '../components/TauMailMobileTabBar';
import { folderTitles } from '../navigation/navItems';

type MailFolderScreenProps = {
  navigation: any;
  route: { params?: { folder?: TauMailFolder; title?: string } };
};

const emptyCopy: Record<TauMailFolder, string> = {
  inbox: 'No messages in inbox',
  drafts: 'No drafts saved',
  sent: 'No sent messages',
  spam: 'No spam messages',
  trash: 'Trash is empty',
};

const MailFolderScreen = ({ navigation, route }: MailFolderScreenProps) => {
  const folder: TauMailFolder = route.params?.folder ?? 'inbox';
  const folderTitle = route.params?.title ?? folderTitles[folder];

  const dispatch = useDispatch();
  const { emails, isLoading, searchQuery, error } = useSelector((state: RootState) => state.email);
  const { user } = useSelector((state: RootState) => state.auth);
  const { online } = useNetworkStatus();
  const [searchResults, setSearchResults] = useState<Email[] | null>(null);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadEmails = useCallback(async () => {
    dispatch(fetchEmailsStart());
    dispatch(setCurrentFolder(folder));
    try {
      const rows = await fetchEmails(folder);
      dispatch(fetchEmailsSuccess(rows.map(mapApiEmailToLocal)));
    } catch (err) {
      const message =
        err instanceof OfflineError
          ? 'Offline — showing last loaded mail when available'
          : `Failed to load ${folderTitle.toLowerCase()}`;
      dispatch(fetchEmailsFailure(message));
    }
  }, [dispatch, folder, folderTitle]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!q) {
      setSearchResults(null);
      setSearching(false);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const rows = await searchEmails(q, folder === 'drafts' ? 'drafts' : 'all');
        setSearchResults(rows.map(mapApiEmailToLocal));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchQuery, folder]);

  const visibleEmails = useMemo(() => {
    if (searchQuery.trim()) return searchResults ?? [];
    return emails;
  }, [emails, searchQuery, searchResults]);

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const handleEmailPress = async (email: Email) => {
    dispatch(markEmailAsRead(email.id));
    try {
      await markEmailRead(email.id);
    } catch {
      /* local mark still applies */
    }
    navigation.navigate('EmailDetail', { email });
  };

  const handleStarPress = async (email: Email) => {
    dispatch(toggleEmailStar(email.id));
    try {
      await starEmail(email.id, !email.isStarred);
    } catch {
      dispatch(toggleEmailStar(email.id));
    }
  };

  const renderEmailItem = ({ item }: { item: Email }) => (
    <TouchableOpacity
      style={[styles.emailItem, !item.isRead && styles.unreadEmail]}
      onPress={() => handleEmailPress(item)}
    >
      <View style={styles.emailHeader}>
        <View style={styles.emailInfo}>
          <Text style={[styles.sender, !item.isRead && styles.unreadText]}>
            {item.senderName || item.from}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.headerIcons}>
          {item.attachments && item.attachments.length > 0 ? (
            <TauMailIcon name="paperclip" size={16} color={tokens.colors.textTertiary} />
          ) : null}
          {folder !== 'trash' && folder !== 'drafts' ? (
            <TouchableOpacity onPress={() => handleStarPress(item)} style={styles.starButton}>
            <TauMailIcon
              name={item.isStarred ? 'star' : 'starOff'}
              size={16}
              color={item.isStarred ? tokens.colors.gold : tokens.colors.textTertiary}
            />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <Text style={[styles.subject, !item.isRead && styles.unreadText]}>{item.subject}</Text>
      <Text style={styles.preview} numberOfLines={2}>
        {item.body}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!online && <OfflineBanner />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScreenHeader title={folderTitle} subtitle={user?.email} onMenuPress={openDrawer} />

      <View style={styles.searchContainer}>
        <TauMailIcon name="search" size={20} color={tokens.colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mail on server..."
          placeholderTextColor={tokens.colors.textTertiary}
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
        {searching ? <ActivityIndicator size="small" color={tokens.colors.gold} /> : null}
      </View>

      <FlatList
        data={visibleEmails}
        renderItem={renderEmailItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading && !searching ? (
            <Text style={styles.empty}>
              {searchQuery.trim() ? 'No matches found' : emptyCopy[folder]}
            </Text>
          ) : null
        }
        refreshing={isLoading}
        onRefresh={loadEmails}
      />

      <TauMailMobileTabBar active="inbox" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.pageBase },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.pageSecondary,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  searchInput: { flex: 1, color: tokens.colors.textPrimary, fontSize: 16 },
  listContent: { paddingBottom: 8 },
  emailItem: {
    backgroundColor: tokens.colors.pageSecondary,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  unreadEmail: { backgroundColor: tokens.colors.goldSurface, borderColor: tokens.colors.goldBorder },
  emailHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  emailInfo: { flex: 1 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sender: { fontSize: 16, color: tokens.colors.textPrimary, fontWeight: '600' },
  unreadText: { fontWeight: '700' },
  timestamp: { fontSize: 12, color: tokens.colors.textTertiary },
  starButton: { padding: 4 },
  subject: { fontSize: 16, color: tokens.colors.textPrimary, marginBottom: 4 },
  preview: { fontSize: 14, color: tokens.colors.textSecondary },
  empty: { textAlign: 'center', color: tokens.colors.textSecondary, marginTop: 40 },
  errorText: { color: tokens.colors.danger, textAlign: 'center', padding: 8, fontSize: 13 },
});

export default MailFolderScreen;
