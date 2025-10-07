/**
 * API 베이스 URL을 반환합니다.
 * - 서버: Vercel이면 VERCEL_URL, 아니면 localhost
 * - 클라이언트: 빈 문자열 (상대 경로)
 */
export function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    // 서버 사이드: Vercel 환경이면 VERCEL_URL, 아니면 localhost
    return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
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
