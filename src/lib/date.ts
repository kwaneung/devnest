/**
 * 현재 시간을 한국 시간대(KST, UTC+9)로 포맷하여 반환
 *
 * @returns KST 형식의 현재 시간 문자열 (예: "2025-10-18 21:34:56")
 */
export function getCurrentKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, -5);
}

/**
 * ISO 8601 날짜 문자열을 한국어 형식으로 포맷
 *
 * @param dateString - ISO 8601 날짜 문자열 (예: "2025-01-15T10:30:00Z")
 * @returns 한국어 형식의 날짜 문자열 (예: "2025년 1월 15일")
 */
export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
