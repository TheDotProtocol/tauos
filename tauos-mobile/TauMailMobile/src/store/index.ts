import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './slices/emailSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    email: emailReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 