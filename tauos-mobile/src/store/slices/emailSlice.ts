import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Email {
  id: string;
  subject: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isEncrypted: boolean;
}

interface EmailState {
  emails: Email[];
  selectedEmail: Email | null;
  loading: boolean;
}

const initialState: EmailState = {
  emails: [],
  selectedEmail: null,
  loading: false,
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmails: (state, action: PayloadAction<Email[]>) => {
      state.emails = action.payload;
    },
    setSelectedEmail: (state, action: PayloadAction<Email | null>) => {
      state.selectedEmail = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const email = state.emails.find(e => e.id === action.payload);
      if (email) {
        email.isRead = true;
      }
    },
  },
});

export const { setEmails, setSelectedEmail, setLoading, markAsRead } = emailSlice.actions;
export default emailSlice.reducer; 