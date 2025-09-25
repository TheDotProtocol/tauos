import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  folder: string;
  attachments?: string[];
  encryptionStatus: 'encrypted' | 'unencrypted';
}

interface EmailState {
  emails: Email[];
  currentFolder: string;
  selectedEmails: string[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: EmailState = {
  emails: [],
  currentFolder: 'inbox',
  selectedEmails: [],
  isLoading: false,
  error: null,
  searchQuery: '',
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    fetchEmailsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEmailsSuccess: (state, action: PayloadAction<Email[]>) => {
      state.isLoading = false;
      state.emails = action.payload;
    },
    fetchEmailsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentFolder: (state, action: PayloadAction<string>) => {
      state.currentFolder = action.payload;
    },
    toggleEmailSelection: (state, action: PayloadAction<string>) => {
      const emailId = action.payload;
      const index = state.selectedEmails.indexOf(emailId);
      if (index > -1) {
        state.selectedEmails.splice(index, 1);
      } else {
        state.selectedEmails.push(emailId);
      }
    },
    clearEmailSelection: (state) => {
      state.selectedEmails = [];
    },
    markEmailAsRead: (state, action: PayloadAction<string>) => {
      const email = state.emails.find(e => e.id === action.payload);
      if (email) {
        email.isRead = true;
      }
    },
    toggleEmailStar: (state, action: PayloadAction<string>) => {
      const email = state.emails.find(e => e.id === action.payload);
      if (email) {
        email.isStarred = !email.isStarred;
      }
    },
    moveEmailsToFolder: (state, action: PayloadAction<{ emailIds: string[]; folder: string }>) => {
      const { emailIds, folder } = action.payload;
      state.emails.forEach(email => {
        if (emailIds.includes(email.id)) {
          email.folder = folder;
        }
      });
    },
    deleteEmails: (state, action: PayloadAction<string[]>) => {
      state.emails = state.emails.filter(email => !action.payload.includes(email.id));
      state.selectedEmails = [];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addEmail: (state, action: PayloadAction<Email>) => {
      state.emails.unshift(action.payload);
    },
  },
});

export const {
  fetchEmailsStart,
  fetchEmailsSuccess,
  fetchEmailsFailure,
  setCurrentFolder,
  toggleEmailSelection,
  clearEmailSelection,
  markEmailAsRead,
  toggleEmailStar,
  moveEmailsToFolder,
  deleteEmails,
  setSearchQuery,
  addEmail,
} = emailSlice.actions;

export default emailSlice.reducer; 