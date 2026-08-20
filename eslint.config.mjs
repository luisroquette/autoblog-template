import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: [
      'src/app/blog/\\[slug\\]/page.tsx',
      'src/components/blog/ArticleCard.tsx',
    ],
    rules: {
      // Covers are supplied by each installation's storage host.
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    '.vercel/**',
    'next-env.d.ts',
  ]),
]);
