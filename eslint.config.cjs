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
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      'indent': ['error', 2],
      'key-spacing': ['never'],
      'linebreak-style': ['error', 'unix'],
      'no-console': ['warn', { allow: ['clear', 'log', 'info', 'warn', 'error'] }],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used' }],
      'no-var': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'quotes': ['error', 'single'],
      'semi': 'off',
      'space-before-function-paren': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
    },
    files: ['src/**/*.js'],
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '.nyc_output/', '*.min.js'],
  },
];