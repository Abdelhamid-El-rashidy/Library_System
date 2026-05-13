import globals from 'globals';
import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...globals.es2021
            }
        },
        rules: {
            'no-unused-vars': ['warn', { args: 'none', vars: 'local' }],
            'no-undef': 'error',
            'no-console': 'off',
            'no-empty': ['warn', { allowEmptyCatch: true }]
        }
    }
];
