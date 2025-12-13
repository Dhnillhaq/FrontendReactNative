module.exports = {
  root: true,
  extends: '@react-native',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'off',
  },
};
