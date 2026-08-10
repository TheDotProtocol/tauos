export {
  TAU_TOKEN_KEY,
  TAU_USER_KEY,
  TAU_REFRESH_KEY,
  TAUMAIL_MOBILE_USER_AGENT,
  TAUMAIL_INLINE_ATTACHMENT_BYTES,
} from './constants';

export { tauMailMobileTokens, tauMailMobileTokens as tokens } from './tokens';
export type { TauMailMobileTokens } from './tokens';

export type {
  TauMailEmail,
  TauMailFolder,
  TauSessionUser,
  TauMailProfile,
  TauMailAiMessage,
  TauMailAttachmentRef,
  TauMailContact,
  TauMailTask,
  TauMailCalendarData,
  TauMailCalendarAgendaItem,
  TauMailStorageData,
} from './types';

export {
  mapApiInboxEmail,
  mapApiSentEmail,
  mapApiDraftEmail,
  mapApiTrashEmail,
} from './types';

export type {
  TauMailMobileClientConfig,
  SessionStorageAdapter,
  NetworkAdapter,
} from './config';

export {
  initTauMailMobileClient,
  getTauMailMobileConfig,
  resolveApiUrl,
} from './config';

export {
  getStoredToken,
  getStoredUser,
  persistSession,
  clearSession,
  authHeaders,
  jsonAuthHeaders,
  refreshSession,
  hydrateSession,
} from './session';

export { OfflineError, tauMobileFetch, tauMobileJson } from './network';

export {
  loginWithTauId,
  loginWithTauMail,
  logout,
  verifyTauId2fa,
  type LoginResult,
} from './api/auth';

export {
  fetchEmails,
  sendEmail,
  markEmailRead,
  starEmail,
  searchEmails,
} from './api/mail';

export {
  uploadAttachment,
  getAttachmentDownloadUrl,
  downloadAttachment,
  fetchNotifications,
  markNotificationsRead,
  registerPushDevice,
  unregisterPushDevice,
  fetchPushPreference,
  setPushPreference,
  type TauMailNotification,
} from './api/push';

export { fetchProfile, updateProfile, uploadProfileAvatar, removeProfileAvatar } from './api/profile';

export { fetchAiHistory, sendAiMessage } from './api/ai';

export { fetchCalendar, createCalendarEvent, type FetchCalendarOptions } from './api/calendar';

export { fetchContacts, createContact } from './api/contacts';

export { fetchTasks, toggleTask } from './api/tasks';

export { fetchStorage } from './api/storage';

export { saveLocalDraft, loadLocalDraft, clearLocalDraft } from './drafts';

export {
  createMemorySessionStorage,
  createReactNativeSessionStorage,
  createNetInfoAdapter,
} from './adapters/react-native';
