const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../../..');

const tauMobileDesign = path.resolve(monorepoRoot, 'packages/tau-mobile-design');
const tauCore = path.resolve(monorepoRoot, 'packages/tau-core');

/**
 * Metro configuration — resolves @tau/* workspace packages
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [monorepoRoot, tauMobileDesign, tauCore],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    extraNodeModules: {
      '@tau/mobile-design': tauMobileDesign,
      '@tau/core': tauCore,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
