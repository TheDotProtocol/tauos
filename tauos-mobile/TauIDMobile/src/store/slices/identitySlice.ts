import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Identity {
  id: string;
  did: string;
  name: string;
  email: string;
  avatar?: string;
  publicKey: string;
  privateKey?: string;
  verified: boolean;
  createdAt: string;
  lastUsed: string;
}

export interface IdentityClaim {
  id: string;
  type: string;
  value: string;
  issuer: string;
  verified: boolean;
  issuedAt: string;
  expiresAt?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastActive: string;
  isCurrent: boolean;
  publicKey: string;
}

interface IdentityState {
  currentIdentity: Identity | null;
  identities: Identity[];
  claims: IdentityClaim[];
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  biometricEnabled: boolean;
  autoLockEnabled: boolean;
  autoLockTimeout: number;
}

const initialState: IdentityState = {
  currentIdentity: null,
  identities: [],
  claims: [],
  devices: [],
  isLoading: false,
  error: null,
  biometricEnabled: true,
  autoLockEnabled: true,
  autoLockTimeout: 300, // 5 minutes
};

const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    fetchIdentitiesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchIdentitiesSuccess: (state, action: PayloadAction<Identity[]>) => {
      state.isLoading = false;
      state.identities = action.payload;
      if (action.payload.length > 0 && !state.currentIdentity) {
        state.currentIdentity = action.payload[0];
      }
    },
    fetchIdentitiesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentIdentity: (state, action: PayloadAction<Identity>) => {
      state.currentIdentity = action.payload;
    },
    createIdentity: (state, action: PayloadAction<Identity>) => {
      state.identities.push(action.payload);
      if (!state.currentIdentity) {
        state.currentIdentity = action.payload;
      }
    },
    updateIdentity: (state, action: PayloadAction<Partial<Identity> & { id: string }>) => {
      const index = state.identities.findIndex(id => id.id === action.payload.id);
      if (index !== -1) {
        state.identities[index] = { ...state.identities[index], ...action.payload };
      }
      if (state.currentIdentity?.id === action.payload.id) {
        state.currentIdentity = { ...state.currentIdentity, ...action.payload };
      }
    },
    deleteIdentity: (state, action: PayloadAction<string>) => {
      state.identities = state.identities.filter(id => id.id !== action.payload);
      if (state.currentIdentity?.id === action.payload) {
        state.currentIdentity = state.identities[0] || null;
      }
    },
    addClaim: (state, action: PayloadAction<IdentityClaim>) => {
      state.claims.push(action.payload);
    },
    verifyClaim: (state, action: PayloadAction<string>) => {
      const claim = state.claims.find(c => c.id === action.payload);
      if (claim) {
        claim.verified = true;
      }
    },
    removeClaim: (state, action: PayloadAction<string>) => {
      state.claims = state.claims.filter(c => c.id !== action.payload);
    },
    addDevice: (state, action: PayloadAction<Device>) => {
      state.devices.push(action.payload);
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter(d => d.id !== action.payload);
    },
    updateDeviceActivity: (state, action: PayloadAction<{ deviceId: string; lastActive: string }>) => {
      const device = state.devices.find(d => d.id === action.payload.deviceId);
      if (device) {
        device.lastActive = action.payload.lastActive;
      }
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
    setAutoLockEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoLockEnabled = action.payload;
    },
    setAutoLockTimeout: (state, action: PayloadAction<number>) => {
      state.autoLockTimeout = action.payload;
    },
    generateNewKeyPair: (state, action: PayloadAction<{ identityId: string; publicKey: string; privateKey: string }>) => {
      const identity = state.identities.find(id => id.id === action.payload.identityId);
      if (identity) {
        identity.publicKey = action.payload.publicKey;
        identity.privateKey = action.payload.privateKey;
      }
      if (state.currentIdentity?.id === action.payload.identityId) {
        state.currentIdentity.publicKey = action.payload.publicKey;
        state.currentIdentity.privateKey = action.payload.privateKey;
      }
    },
    exportIdentity: (state, action: PayloadAction<string>) => {
      // Export logic would be handled by middleware
    },
    importIdentity: (state, action: PayloadAction<Identity>) => {
      state.identities.push(action.payload);
    },
    backupIdentity: (state, action: PayloadAction<string>) => {
      // Backup logic would be handled by middleware
    },
    restoreIdentity: (state, action: PayloadAction<Identity>) => {
      const existingIndex = state.identities.findIndex(id => id.id === action.payload.id);
      if (existingIndex !== -1) {
        state.identities[existingIndex] = action.payload;
      } else {
        state.identities.push(action.payload);
      }
    },
  },
});

export const {
  fetchIdentitiesStart,
  fetchIdentitiesSuccess,
  fetchIdentitiesFailure,
  setCurrentIdentity,
  createIdentity,
  updateIdentity,
  deleteIdentity,
  addClaim,
  verifyClaim,
  removeClaim,
  addDevice,
  removeDevice,
  updateDeviceActivity,
  setBiometricEnabled,
  setAutoLockEnabled,
  setAutoLockTimeout,
  generateNewKeyPair,
  exportIdentity,
  importIdentity,
  backupIdentity,
  restoreIdentity,
} = identitySlice.actions;

export default identitySlice.reducer; 