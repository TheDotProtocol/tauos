import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  fetchFilesStart,
  fetchFilesSuccess,
  fetchFilesFailure,
  toggleFileSelection,
  FileItem,
  Folder,
} from '../store/slices/fileSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const CloudHomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { files, folders, storageUsed, storageLimit, isLoading } = useSelector((state: RootState) => state.file);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    dispatch(fetchFilesStart());
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'Vacation Photos',
          type: 'folder',
          size: 0,
          path: '/Photos',
          lastModified: new Date().toISOString(),
          isEncrypted: true,
          isShared: false,
        },
        {
          id: '2',
          name: 'Work Documents',
          type: 'folder',
          size: 0,
          path: '/Documents',
          lastModified: new Date(Date.now() - 86400000).toISOString(),
          isEncrypted: true,
          isShared: false,
        },
        {
          id: '3',
          name: 'presentation.pdf',
          type: 'file',
          size: 2048576,
          path: '/Documents',
          lastModified: new Date(Date.now() - 3600000).toISOString(),
          isEncrypted: true,
          isShared: false,
          mimeType: 'application/pdf',
        },
        {
          id: '4',
          name: 'family-video.mp4',
          type: 'file',
          size: 52428800,
          path: '/Videos',
          lastModified: new Date(Date.now() - 7200000).toISOString(),
          isEncrypted: true,
          isShared: true,
          mimeType: 'video/mp4',
        },
      ];

      const mockFolders: Folder[] = [
        {
          id: '1',
          name: 'Photos',
          path: '/Photos',
          fileCount: 156,
          totalSize: 2147483648, // 2GB
          lastModified: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Documents',
          path: '/Documents',
          fileCount: 23,
          totalSize: 104857600, // 100MB
          lastModified: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          name: 'Videos',
          path: '/Videos',
          fileCount: 8,
          totalSize: 1073741824, // 1GB
          lastModified: new Date(Date.now() - 7200000).toISOString(),
        },
      ];
      
      dispatch(fetchFilesSuccess({ files: mockFiles, folders: mockFolders }));
    } catch (error) {
      dispatch(fetchFilesFailure('Failed to load files'));
    }
  };

  const handleFilePress = (item: FileItem | Folder) => {
    if (item.type === 'folder' || 'fileCount' in item) {
      navigation.navigate('FolderView', { folder: item });
    } else {
      navigation.navigate('FileView', { file: item });
    }
  };

  const handleFileLongPress = (item: FileItem | Folder) => {
    setSelectedFiles(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
  };

  const handleUpload = () => {
    navigation.navigate('UploadScreen');
  };

  const handleCreateFolder = () => {
    Alert.prompt(
      'Create Folder',
      'Enter folder name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (folderName) => {
          if (folderName) {
            // Create folder logic
            Alert.alert('Success', `Folder "${folderName}" created successfully!`);
          }
        }}
      ]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStoragePercentage = (): number => {
    return (storageUsed / storageLimit) * 100;
  };

  const renderFileItem = ({ item }: { item: FileItem | Folder }) => {
    const isSelected = selectedFiles.includes(item.id);
    const isFolder = item.type === 'folder' || 'fileCount' in item;
    
    return (
      <TouchableOpacity
        style={[
          styles.fileItem,
          viewMode === 'grid' ? styles.fileItemGrid : styles.fileItemList,
          isSelected && styles.selectedFile,
        ]}
        onPress={() => handleFilePress(item)}
        onLongPress={() => handleFileLongPress(item)}
      >
        <View style={styles.fileIconContainer}>
          <Icon
            name={isFolder ? 'folder' : getFileIcon(item.name)}
            size={viewMode === 'grid' ? 32 : 24}
            color={isFolder ? '#667eea' : '#999'}
          />
          {!isFolder && (item as FileItem).isEncrypted && (
            <View style={styles.encryptionBadge}>
              <Icon name="lock" size={8} color="#667eea" />
            </View>
          )}
          {!isFolder && (item as FileItem).isShared && (
            <View style={styles.shareBadge}>
              <Icon name="share" size={8} color="#ff6b6b" />
            </View>
          )}
        </View>
        
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.fileDetails}>
            {isFolder 
              ? `${(item as Folder).fileCount} items`
              : formatFileSize((item as FileItem).size)
            }
          </Text>
          <Text style={styles.fileDate}>
            {new Date(item.lastModified).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'picture-as-pdf';
      case 'doc':
      case 'docx': return 'description';
      case 'xls':
      case 'xlsx': return 'table-chart';
      case 'ppt':
      case 'pptx': return 'slideshow';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      case 'mp4':
      case 'avi':
      case 'mov': return 'video-file';
      case 'mp3':
      case 'wav':
      case 'aac': return 'audiotrack';
      default: return 'insert-drive-file';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>TauCloud</Text>
          <Text style={styles.storageInfo}>
            {formatFileSize(storageUsed)} of {formatFileSize(storageLimit)} used
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} style={styles.viewToggle}>
            <Icon name={viewMode === 'grid' ? 'view-list' : 'grid-view'} size={24} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateFolder} style={styles.createButton}>
            <Icon name="create-new-folder" size={24} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
            <Icon name="cloud-upload" size={24} color="#667eea" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Storage Progress */}
      <View style={styles.storageContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={[styles.storageBar, { width: `${getStoragePercentage()}%` }]}
        />
        <View style={styles.storageBarBackground} />
      </View>

      {/* File List */}
      <FlatList
        data={[...folders, ...files]}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id}
        style={styles.fileList}
        numColumns={viewMode === 'grid' ? 2 : 1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadFiles} />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleUpload}>
        <Icon name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  storageInfo: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewToggle: {
    padding: 8,
    marginRight: 8,
  },
  createButton: {
    padding: 8,
    marginRight: 8,
  },
  uploadButton: {
    padding: 8,
  },
  storageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  storageBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  storageBar: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: 16,
    zIndex: 1,
  },
  fileList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fileItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  fileItemGrid: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    minHeight: 120,
  },
  fileItemList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedFile: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
  },
  fileIconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  encryptionBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#667eea',
    borderRadius: 4,
    padding: 1,
  },
  shareBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff6b6b',
    borderRadius: 4,
    padding: 1,
  },
  fileInfo: {
    flex: 1,
    alignItems: viewMode === 'grid' ? 'center' : 'flex-start',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: viewMode === 'grid' ? 'center' : 'left',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: '#999',
    textAlign: viewMode === 'grid' ? 'center' : 'left',
  },
  fileDate: {
    fontSize: 10,
    color: '#666',
    textAlign: viewMode === 'grid' ? 'center' : 'left',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default CloudHomeScreen; 