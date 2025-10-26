/**
 * Function-level unstable_cache 재검증 시간 (초)
 *
 * Server Actions에서 unstable_cache의 revalidate 옵션으로 사용됩니다.
 * @see src/entities/post/api/postsActions.ts
 *
 * 환경별 자동 설정:
 * - Development: 300초 (5분) - 빠른 피드백
 * - Production: 7200초 (2시간) - 성능 최적화
 *
 * Note: Page-level revalidate는 Next.js가 정적 분석을 요구하므로
 * 각 페이지 파일에서 숫자 리터럴로 직접 정의합니다.
 * @see src/app/posts/page.tsx
 * @see src/app/posts/[id]/page.tsx
 */
export const CACHE_TIME = process.env.NODE_ENV === 'development' ? 300 : 7200;
