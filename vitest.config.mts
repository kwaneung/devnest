import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(), // tsconfig.json의 path alias 지원 (@/* -> src/*)
    react(), // React 컴포넌트 테스트 지원
  ],
  test: {
    environment: 'jsdom', // 브라우저 환경 시뮬레이션
    globals: true, // describe, it, expect 등 전역으로 사용
    setupFiles: './vitest.setup.ts', // 테스트 전 실행할 설정
    css: true, // CSS 임포트 허용
    include: ['**/*.test.{js,ts,tsx}', '**/*.integration.test.{js,ts,tsx}'], // 단위 + 통합 테스트
    exclude: ['node_modules', 'e2e', '.next', 'out'], // E2E 테스트 제외
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'e2e/',
        '.next/',
        'out/',
        'coverage/',
        '**/*.config.*',
        '**/types.ts',
        '**/*.d.ts',
      ],
    },
  },
});
