import nextConfig from 'eslint-config-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = [
  // Next.js 기본 설정
  ...nextConfig,

  // 무시할 파일
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**'],
  },

  // React 및 추가 플러그인 설정
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },

    // 규칙 설정
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'metadata',
            'generateMetadata',
            'generateStaticParams',
            'generateViewport',
          ],
        },
      ],
      // 접근성 규칙 (jsx-a11y는 Next.js에 이미 포함됨)
      'jsx-a11y/alt-text': [
        'warn',
        {
          elements: ['img'],
        },
      ],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      // React 규칙
      'react/no-unknown-property': 'off',
      'react/prop-types': 'off',
      'react/no-array-index-key': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      // unused-imports 플러그인 규칙
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Prettier 통합
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    ...eslintConfigPrettier,
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;
