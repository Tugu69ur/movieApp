const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add custom asset types
config.resolver.assetExts.push("bin", "txt");

module.exports = config;
