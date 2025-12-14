import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import rootConfig from '../../eslint.config.mjs';

export default defineConfig(
  ...rootConfig,
  {
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: [`**/*.{ts,tsx}`],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": `off`,
      "@typescript-eslint/explicit-module-boundary-types": `off`,
      "@typescript-eslint/no-explicit-any": `off`,
      "@typescript-eslint/naming-convention": [
        `error`,
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'import',
          leadingUnderscore: 'allow',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          modifiers: [`exported`]
        },
        {
          "selector": [
            "classProperty",
            "objectLiteralProperty",
            "typeProperty",
            "classMethod",
            "objectLiteralMethod",
            "typeMethod",
            "accessor",
            "enumMember",
          ],
          "format": null,
          "modifiers": ["requiresQuotes"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: true
          }
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ]
    },
  },
);
