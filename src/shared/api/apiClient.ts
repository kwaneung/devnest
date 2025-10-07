/**
 * API 베이스 URL을 반환합니다.
 * - 서버: 절대 URL 필수 (NEXT_PUBLIC_BASE_URL 환경변수 사용)
 * - 클라이언트: 빈 문자열 (상대 경로)
 */
export function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    // 서버 사이드: 환경 변수에서 절대 URL 가져오기
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error(
        'NEXT_PUBLIC_BASE_URL environment variable is required for server-side rendering',
      );
    }
    return baseUrl;
  }
  // 클라이언트 사이드
  return '';
}

/**
 * API 엔드포인트의 전체 URL을 반환합니다.
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getBaseUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
}
