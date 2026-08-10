const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const mobileClientRoot = path.resolve(workspaceRoot, 'packages/taumail-mobile-client');

// Only watch the shared mobile client package — not the whole monorepo (avoids
// duplicate package name collisions such as tauai-core).
const config = {
  watchFolders: [mobileClientRoot],
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    extraNodeModules: {
      '@tau/taumail-mobile-client': path.resolve(mobileClientRoot, 'src'),
    },
    blockList: exclusionList([
      /\/android\/app\/build\/.*/,
      /\/android\/\.gradle\/.*/,
      /\/ios\/build\/.*/,
      /\/ios\/Pods\/.*\/build\/.*/,
    ]),
  },
  watcher: {
    // Avoid Metro crashing with "Got unexpected null" when build artifacts change.
    healthCheck: {
      enabled: true,
      interval: 30000,
      timeout: 10000,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
