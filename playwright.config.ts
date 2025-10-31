import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  // 테스트 실행 설정
  fullyParallel: true, // 모든 테스트를 병렬로 실행
  forbidOnly: !!process.env.CI, // CI에서 .only() 금지
  retries: process.env.CI ? 2 : 0, // CI에서만 재시도
  workers: process.env.CI ? 1 : undefined, // CI에서는 순차 실행

  // 리포터 설정
  reporter: [['html', { open: 'on-failure' }]], // 실패 시 자동으로 리포트 열기

  // 모든 테스트에서 공유할 설정
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry', // 실패 시 trace 수집
    screenshot: 'only-on-failure', // 실패 시 스크린샷
  },

  // 프로젝트별 설정 (브라우저별 테스트)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // 모바일 테스트
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 테스트 실행 전 개발 서버 자동 시작
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
