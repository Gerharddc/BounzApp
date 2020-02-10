module.exports = {
  presets: ["module:metro-react-native-babel-preset", "@babel/typescript"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".js", ".ts", ".tsx", ".ios.js", ".android.js"]
      }
    ]
  ]
};
