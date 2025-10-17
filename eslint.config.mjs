import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
// ESLint 플러그인 가져오기
import eslintConfigPrettier from 'eslint-config-prettier';
import jsx_a11y from 'eslint-plugin-jsx-a11y';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 기본 환경 설정
  {
    ignores: ['next.config.mjs', 'postcss.config.mjs', 'eslint.config.mjs'],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // 브라우저 환경 설정
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        browser: true,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  // 호환성 설정을 통한 기존 확장
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    '@rushstack/eslint-config/profile/web-app',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
  ),

  // React 설정
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-refresh': reactRefresh,
      'jsx-a11y': jsx_a11y,
      'no-relative-import-paths': noRelativeImportPaths,
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
      // <img> 엘리먼트에 유의미한 대체 텍스트가 있는지 체크
      'jsx-a11y/alt-text': [
        'warn',
        {
          elements: ['img'],
        },
      ],
      // 유효한 aria-* 속성만 사용
      'jsx-a11y/aria-props': 'warn',
      // 유효한 aria-* 상태/값만 사용
      'jsx-a11y/aria-proptypes': 'warn',
      // DOM에서 지원되는 role, ARIA만 사용
      'jsx-a11y/aria-unsupported-elements': 'warn',
      // 필수 ARIA 속성이 빠져있는지 체크
      'jsx-a11y/role-has-required-aria-props': 'warn',
      // ARIA 속성은 지원되는 role에서만 사용
      'jsx-a11y/role-supports-aria-props': 'warn',
      // DOM에 정의되지 않은 속성을 사용했는지 체크 (emotion css 속성 등 예외 케이스가 있으므로 기본은 off)
      'react/no-unknown-property': 'off',
      // 정의한 props 중에 빠진게 있는지 체크 (NextPage 등 일부 추상화 컴포넌트에서 복잡해지므로 기본은 off)
      'react/prop-types': 'off',

      // 근거: 타입 추론으로 충분한 곳에 타이핑을 강요함
      '@rushstack/typedef-var': 'off',
      // 근거: React 컴포넌트의 경우 17 이하에서는 `undefined`가 아닌
      //      `null`을 리턴할 수 있기 때문에 사용하지 않음
      '@rushstack/no-new-null': 'off',
      // 근거: 상황에 따라 리턴 타입을 타입 추론에 맡기는 것이 나을수도 있음
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 근거: 문서에 의하면 클래스를 많이 사용하는 프로젝트에서 사용할 수 있으나,
      //       팀 내 개발 패턴은 함수형을 지향하므로 불필요함
      '@typescript-eslint/explicit-member-accessibility': 'off',
      // 근거: useEffect 안에서 await 사용 불가
      '@typescript-eslint/no-floating-promises': 'off',
      // 근거: 배열 인덱스를 key로 사용 경고
      'react/no-array-index-key': 'warn',
      // 근거: 의존성 배열 누락 경고
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // mjs 파일에 대한 특별 설정
  {
    files: ['next.config.mjs', 'postcss.config.mjs', 'eslint.config.mjs'],
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        project: false, // TypeScript 파서 비활성화
      },
    },
  },

  // import 정렬 규칙
  {
    rules: {
      'import/order': [
        'error',
        {
          // 카테고리별로 그룹화
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          // import 그룹 간에 한 줄 띄우기를 강제
          'newlines-between': 'always',
          // 알파벳 순 정렬
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // unused-imports 플러그인
  // 사용하지 않는 import 자동 제거와 변수 관리를 지원
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
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

  // prettier 통합을 위한 설정
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    ...eslintConfigPrettier,
    rules: {
      'prettier/prettier': 'error',
      // TypeScript naming convention 규칙 수정
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: [],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: [],
        },
      ],
    },
  },
];

export default eslintConfig;
