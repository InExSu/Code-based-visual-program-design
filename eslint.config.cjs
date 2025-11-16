module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
      },
    },
    rules: {
      // Форматирование (замена prettier)
      'semi': ['error', 'never'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'as-needed'],
      'eol-last': ['error', 'always'],
      'indent': ['error', 2],
      // Не трогать пробелы внутри строк - отключаем правила, которые могут влиять на содержимое строк
      'no-trailing-spaces': 'off',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
      
      // Кодстайл
      'linebreak-style': ['error', 'unix'],
      'no-console': ['warn', { allow: ['clear', 'log', 'info', 'warn', 'error'] }],
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used' }],
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
    },
    files: ['src/**/*.js'],
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '.nyc_output/', '*.min.js'],
  },
];