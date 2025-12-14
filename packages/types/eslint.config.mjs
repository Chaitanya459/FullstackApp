import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import rootConfig from '../../eslint.config.mjs';

export default defineConfig(
  ...rootConfig,
  {
    files: [ `**/*.{ts,tsx}` ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      "@stylistic/type-annotation-spacing": 2,
    },
  },
);
