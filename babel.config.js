module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    // Note: plugins must be inside presets if using babel-preset-expo
    // Do NOT use top-level "plugins" here for NativeWind
  };
};
