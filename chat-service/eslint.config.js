module.exports = [{
  ignores: ['node_modules/**', 'coverage/**'],
  languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
  rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], 'no-console': 'off' }
}];
