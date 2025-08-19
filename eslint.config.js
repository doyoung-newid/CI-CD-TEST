import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-refresh': reactRefreshPlugin,
            prettier: prettierPlugin,
            import: importPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            // import plugin rules
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    pathGroups: [
                        { pattern: 'react**', group: 'external', position: 'before' },
                        { pattern: '@plitvice/**', group: 'external', position: 'after' },
                        { pattern: '@/api/**', group: 'internal', position: 'after' },
                        { pattern: '@/components/**', group: 'internal', position: 'after' },
                        { pattern: '@/pages/**', group: 'internal', position: 'after' },
                        { pattern: '@/hooks/**', group: 'internal', position: 'after' },
                        { pattern: '@/routes/**', group: 'internal', position: 'after' },
                        { pattern: '@/types/**', group: 'internal', position: 'after' },
                        { pattern: '@/utils/**', group: 'internal', position: 'after' },
                        { pattern: '@/**', group: 'internal', position: 'after' },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always-and-inside-groups',
                    warnOnUnassignedImports: true,
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    prettierConfig,
    {
        ignores: ['node_modules', 'dist', 'build', 'public', '**/.react-router'],
    },
    {
        // remix 로드함수 에러 방지
        files: ['web/ness/app/**/*.{ts,tsx}', 'web/ness/app/pages/**/*.{ts,tsx}', 'web/ness/app/routes/**/*.{ts,tsx}'],
        rules: {
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true,
                    allowExportNames: ['loader', 'action'],
                },
            ],
        },
    },
];
