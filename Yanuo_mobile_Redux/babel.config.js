module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Các plugin khác
      'react-native-reanimated/plugin', // Phải là plugin cuối cùng
    ],
  };
};

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     // Các plugin khác
//     'react-native-reanimated/plugin', // Phải là plugin cuối cùng
//   ],
// };
