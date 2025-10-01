import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  path: string;
  lastModified: string;
  isEncrypted: boolean;
  isShared: boolean;
  thumbnail?: string;
  mimeType?: string;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  fileCount: number;
  totalSize: number;
  lastModified: string;
}

interface FileState {
  files: FileItem[];
  folders: Folder[];
  currentPath: string;
  selectedFiles: string[];
  isLoading: boolean;
  error: string | null;
  storageUsed: number;
  storageLimit: number;
  uploadProgress: { [key: string]: number };
}

const initialState: FileState = {
  files: [],
  folders: [],
  currentPath: '/',
  selectedFiles: [],
  isLoading: false,
  error: null,
  storageUsed: 0,
  storageLimit: 5 * 1024 * 1024 * 1024, // 5GB default
  uploadProgress: {},
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    fetchFilesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchFilesSuccess: (state, action: PayloadAction<{ files: FileItem[]; folders: Folder[] }>) => {
      state.isLoading = false;
      state.files = action.payload.files;
      state.folders = action.payload.folders;
    },
    fetchFilesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    toggleFileSelection: (state, action: PayloadAction<string>) => {
      const fileId = action.payload;
      const index = state.selectedFiles.indexOf(fileId);
      if (index > -1) {
        state.selectedFiles.splice(index, 1);
      } else {
        state.selectedFiles.push(fileId);
      }
    },
    clearFileSelection: (state) => {
      state.selectedFiles = [];
    },
    addFile: (state, action: PayloadAction<FileItem>) => {
      state.files.unshift(action.payload);
      state.storageUsed += action.payload.size;
    },
    deleteFiles: (state, action: PayloadAction<string[]>) => {
      const filesToDelete = state.files.filter(file => action.payload.includes(file.id));
      const totalSize = filesToDelete.reduce((sum, file) => sum + file.size, 0);
      state.files = state.files.filter(file => !action.payload.includes(file.id));
      state.storageUsed -= totalSize;
      state.selectedFiles = [];
    },
    createFolder: (state, action: PayloadAction<Folder>) => {
      state.folders.push(action.payload);
    },
    updateUploadProgress: (state, action: PayloadAction<{ fileId: string; progress: number }>) => {
      state.uploadProgress[action.payload.fileId] = action.payload.progress;
    },
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload];
    },
    updateStorageUsage: (state, action: PayloadAction<{ used: number; limit: number }>) => {
      state.storageUsed = action.payload.used;
      state.storageLimit = action.payload.limit;
    },
    moveFiles: (state, action: PayloadAction<{ fileIds: string[]; destinationPath: string }>) => {
      const { fileIds, destinationPath } = action.payload;
      state.files.forEach(file => {
        if (fileIds.includes(file.id)) {
          file.path = destinationPath;
        }
      });
    },
    shareFiles: (state, action: PayloadAction<string[]>) => {
      state.files.forEach(file => {
        if (action.payload.includes(file.id)) {
          file.isShared = true;
        }
      });
    },
    encryptFiles: (state, action: PayloadAction<string[]>) => {
      state.files.forEach(file => {
        if (action.payload.includes(file.id)) {
          file.isEncrypted = true;
        }
      });
    },
  },
});

export const {
  fetchFilesStart,
  fetchFilesSuccess,
  fetchFilesFailure,
  setCurrentPath,
  toggleFileSelection,
  clearFileSelection,
  addFile,
  deleteFiles,
  createFolder,
  updateUploadProgress,
  clearUploadProgress,
  updateStorageUsage,
  moveFiles,
  shareFiles,
  encryptFiles,
} = fileSlice.actions;

export default fileSlice.reducer; 