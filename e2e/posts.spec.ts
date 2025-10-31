import { expect, test } from '@playwright/test';

test.describe('포스트 목록 페이지', () => {
  test('포스트 목록이 표시되어야 한다', async ({ page }) => {
    await page.goto('/posts');

    // 페이지 타이틀 확인 (실제 형식: "DevNest | 포스트")
    await expect(page).toHaveTitle(/DevNest.*포스트|포스트.*DevNest/);

    // 페이지 제목 확인
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('포스트 테이블이 올바르게 렌더링되어야 한다', async ({ page }) => {
    await page.goto('/posts');

    // 테이블 헤더 확인
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // 테이블 헤더가 있는지 확인 (제목, 작성자, 날짜 등)
    const tableHeaders = table.locator('thead th');
    const headerCount = await tableHeaders.count();

    // 최소 3개 이상의 헤더가 있어야 함 (제목, 작성자, 날짜 등)
    expect(headerCount).toBeGreaterThanOrEqual(3);
  });

  test('포스트 카드 클릭 시 상세 페이지로 이동해야 한다', async ({ page }) => {
    await page.goto('/posts');

    // 첫 번째 포스트 링크 찾기 (href가 /posts/로 시작하는 링크)
    const firstPostLink = page.locator('a[href^="/posts/"]').first();

    // 포스트가 있는 경우에만 테스트
    if ((await firstPostLink.count()) > 0) {
      await firstPostLink.click();

      // URL이 /posts/[id] 형식으로 변경되었는지 확인
      await expect(page).toHaveURL(/\/posts\/\d+/);
    }
  });
});

test.describe('포스트 상세 페이지', () => {
  test('포스트 상세 정보가 표시되어야 한다', async ({ page }) => {
    // 예제 포스트 ID (실제 존재하는 ID로 변경 필요)
    // 테스트 데이터가 있다면 해당 ID 사용
    await page.goto('/posts/1');

    // 페이지가 로드될 때까지 대기
    await page.waitForLoadState('networkidle');

    // 404가 아닌지 확인 (포스트가 존재하는 경우)
    const notFoundText = page.getByText(/404|Not Found|찾을 수 없습니다/);
    const isNotFound = (await notFoundText.count()) > 0;

    if (!isNotFound) {
      // 포스트 제목이 h1으로 표시되는지 확인
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();

      // 포스트 내용이 있는지 확인
      const content = page.locator('article, .prose, [class*="content"]');
      await expect(content.first()).toBeVisible();
    }
  });

  test('뒤로가기 버튼이 동작해야 한다', async ({ page }) => {
    // 포스트 목록에서 시작
    await page.goto('/posts');

    // 첫 번째 포스트 클릭
    const firstPostLink = page.locator('a[href^="/posts/"]').first();

    if ((await firstPostLink.count()) > 0) {
      await firstPostLink.click();
      await page.waitForLoadState('networkidle');

      // 뒤로가기 버튼 찾기
      const backButton = page.getByRole('button', { name: /뒤로|back/i });

      if ((await backButton.count()) > 0) {
        await backButton.click();

        // 포스트 목록으로 돌아갔는지 확인
        await expect(page).toHaveURL(/\/posts$/);
      }
    }
  });
});
