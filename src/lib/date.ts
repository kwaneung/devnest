/**
 * 현재 시간을 한국 시간대(KST, UTC+9)로 포맷하여 반환
 *
 * @returns KST 형식의 현재 시간 문자열 (예: "2025-10-18 21:34:56")
 */
export function getCurrentKST(): string {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, -5);
}
