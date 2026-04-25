import js from '@eslint/js';
import tsEslint from 'typescript-eslint';
import globals from 'globals';

export default tsEslint.config(
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.next/**',
            '**/.turbo/**',
            '**/coverage/**',
            '**/src/generated/**',
            'apps/web/**', // web has its own Next.js eslint config
        ],
    },
    js.configs.recommended,
    ...tsEslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2022,
            },
            parserOptions: {
                project: [
                    './apps/api/tsconfig.json',
                    './packages/db/tsconfig.json',
                    './packages/shared/tsconfig.json',
                ],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
            'no-console': 'warn',
        },
    }
);
