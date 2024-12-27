module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'react-native-reanimated/plugin', // Eğer react-native-reanimated kullanıyorsanız, bu eklentiyi ekleyin
      ],
    };
  };
  
