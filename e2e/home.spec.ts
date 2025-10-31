import { expect, test } from '@playwright/test';

test.describe('홈페이지', () => {
  test('페이지가 로드되고 기본 요소가 표시되어야 한다', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/DevNest/);

    // 네비게이션 바가 표시되는지 확인 (header 대신 nav 또는 navbar 클래스)
    const navbar = page.locator('.navbar, nav, [role="navigation"]').first();
    await expect(navbar).toBeVisible();

    // 사이트 로고/제목 확인
    await expect(page.getByRole('link', { name: /DevNest/i })).toBeVisible();
  });

  test('테마 전환 버튼이 동작해야 한다', async ({ page }) => {
    await page.goto('/');

    // 테마 버튼 찾기 (aria-label 또는 role 기반)
    const themeButton = page
      .locator('button')
      .filter({ hasText: /☀️|🌙|💻/ })
      .first();

    if ((await themeButton.count()) > 0) {
      // 초기 테마 확인
      const htmlElement = page.locator('html');
      const initialTheme = await htmlElement.getAttribute('data-theme');

      // 테마 버튼 클릭
      await themeButton.click();

      // 테마가 변경되었는지 확인
      const newTheme = await htmlElement.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('포스트 링크 클릭 시 포스트 페이지로 이동해야 한다', async ({ page }) => {
    await page.goto('/');

    // 모바일인 경우 drawer 열기
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 1024 : false;

    if (isMobile) {
      // 햄버거 메뉴 클릭하여 drawer 열기 (aria-label로 정확히 지정)
      await page.getByLabel('Open sidebar').click();
      await page.waitForTimeout(300); // drawer 애니메이션 대기
    }

    // "포스트" 링크 클릭
    await page
      .getByRole('link', { name: /포스트|블로그/i })
      .first()
      .click();

    // URL이 /posts로 변경되었는지 확인
    await expect(page).toHaveURL(/\/posts/);
  });
});
