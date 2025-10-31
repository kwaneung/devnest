import { describe, expect, it, vi } from 'vitest';

import { getCurrentKST } from './date';

describe('getCurrentKST', () => {
  it('KST 형식의 시간 문자열을 반환해야 한다', () => {
    // 2025-10-31T00:00:00.000Z (UTC)를 고정
    const mockDate = new Date('2025-10-31T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const result = getCurrentKST();

    // UTC+9이므로 2025-10-31 09:00:00이 되어야 함
    expect(result).toBe('2025-10-31 09:00:00');

    vi.useRealTimers();
  });

  it('올바른 형식의 문자열을 반환해야 한다 (YYYY-MM-DD HH:MM:SS)', () => {
    const result = getCurrentKST();

    // 정규식으로 형식 검증
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('항상 19자 길이의 문자열을 반환해야 한다', () => {
    const result = getCurrentKST();

    expect(result).toHaveLength(19);
  });

  it('UTC 시간보다 9시간 앞서야 한다', () => {
    const utcDate = new Date('2025-10-31T15:30:00.000Z');
    vi.setSystemTime(utcDate);

    const result = getCurrentKST();

    // UTC 15:30 + 9시간 = KST 00:30 (다음 날)
    expect(result).toBe('2025-11-01 00:30:00');

    vi.useRealTimers();
  });
});
