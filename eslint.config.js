// ESLint flat config for the Family Hub card.
//
// src/ is a browser ES module bundle (Lit imported from npm, bundled by
// rollup). test/ runs in Node under vitest. dist/ is generated and minified —
// linting it is meaningless, so it is ignored.
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Lovelace / HA frontend globals the card relies on.
        customElements: 'readonly',
        loadCardHelpers: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // Swallowing a failed fetch/service call is deliberate here — the data
      // layer records the failure in `model.failures` instead of throwing.
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
      }],
    },
  },
  {
    files: ['test/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
