const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add custom asset types
config.resolver.assetExts.push("bin", "txt");

module.exports = withNativeWind(config, { input: "./app/global.css" });
