/**
 * 통합 테스트 - Server Actions
 *
 * 통합 테스트는 여러 모듈이 함께 작동하는지 테스트합니다:
 * - Server Actions (src/services/posts.ts)
 * - Zod 스키마 검증 (src/types/post.ts)
 * - Supabase 클라이언트 (모킹된 DB)
 *
 * 단위 테스트와의 차이:
 * - 단위: getCurrentKST() 함수만 독립적으로 테스트
 * - 통합: getPosts() → Supabase 호출 → Zod 검증 → 타입 변환 전체 플로우
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PostRow } from '@/types/post';

// Mock 데이터
const mockPostsData: PostRow[] = [
  {
    id: 1,
    title: '첫 번째 포스트',
    excerpt: '첫 번째 요약',
    content: '첫 번째 내용',
    author: 'John Doe',
    published_at: '2025-10-31T09:00:00+00:00',
    tags: ['tech', 'javascript'],
    view_count: 100,
    created_at: '2025-10-31T09:00:00+00:00',
    updated_at: '2025-10-31T09:00:00+00:00',
  },
  {
    id: 2,
    title: '두 번째 포스트',
    excerpt: '두 번째 요약',
    content: '두 번째 내용',
    author: 'Jane Smith',
    published_at: '2025-10-30T09:00:00+00:00',
    tags: ['react'],
    view_count: 50,
    created_at: '2025-10-30T09:00:00+00:00',
    updated_at: '2025-10-30T09:00:00+00:00',
  },
];

// Supabase 모킹
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
    })),
  },
}));

// Next.js cache 모킹 (테스트에서는 캐시 비활성화)
vi.mock('next/cache', () => ({
  cacheTag: vi.fn(),
}));

describe('getPosts - 통합 테스트', () => {
  beforeEach(() => {
    // 각 테스트 전에 mock 초기화
    vi.clearAllMocks();

    // 기본 체이닝 설정
    mockSelect.mockReturnValue({
      order: mockOrder,
      limit: mockLimit,
    });
    mockOrder.mockReturnValue({
      limit: mockLimit,
    });
    mockLimit.mockResolvedValue({
      data: mockPostsData,
      error: null,
    });
  });

  it('Supabase에서 데이터를 가져와 Zod 검증 후 camelCase로 변환해야 한다', async () => {
    // 기본 설정 (limit 없음)
    mockOrder.mockResolvedValue({
      data: mockPostsData,
      error: null,
    });

    const { getPosts } = await import('./posts');
    const result = await getPosts();

    // 결과 검증
    expect(result).toHaveLength(2);
    expect(result[0].viewCount).toBe(100); // camelCase 변환 확인
    expect(result[0].publishedAt).toBe('2025-10-31T09:00:00+00:00');
    expect(result[1].viewCount).toBe(50);
  });

  it('정렬 파라미터가 올바르게 적용되어야 한다 - latest', async () => {
    mockOrder.mockResolvedValue({
      data: mockPostsData,
      error: null,
    });

    const { getPosts } = await import('./posts');
    await getPosts({ sort: 'latest' });

    // published_at 기준 내림차순 정렬 확인
    expect(mockOrder).toHaveBeenCalledWith('published_at', { ascending: false });
  });

  it('정렬 파라미터가 올바르게 적용되어야 한다 - popular', async () => {
    mockOrder.mockResolvedValue({
      data: mockPostsData,
      error: null,
    });

    const { getPosts } = await import('./posts');
    await getPosts({ sort: 'popular' });

    // view_count 기준 내림차순 정렬 확인
    expect(mockOrder).toHaveBeenCalledWith('view_count', { ascending: false });
  });

  it('limit 파라미터가 올바르게 적용되어야 한다', async () => {
    const limitedData = [mockPostsData[0]];
    mockLimit.mockResolvedValue({
      data: limitedData,
      error: null,
    });

    const { getPosts } = await import('./posts');
    const result = await getPosts({ limit: 1 });

    // limit 호출 확인
    expect(mockLimit).toHaveBeenCalledWith(1);
    expect(result).toHaveLength(1);
  });

  it('Supabase 에러 발생 시 에러를 throw 해야 한다', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });

    const { getPosts } = await import('./posts');

    await expect(getPosts()).rejects.toThrow('Failed to fetch posts: Database connection failed');
  });

  it('빈 데이터가 반환되면 빈 배열을 반환해야 한다', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: null,
    });

    const { getPosts } = await import('./posts');
    const result = await getPosts();

    expect(result).toEqual([]);
  });
});

describe('getPostById - 통합 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // getPostById용 체이닝
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      single: mockSingle,
    });
  });

  it('특정 ID의 포스트를 가져와 변환해야 한다', async () => {
    mockSingle.mockResolvedValue({
      data: mockPostsData[0],
      error: null,
    });

    const { getPostById } = await import('./posts');
    const result = await getPostById(1);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(1);
    expect(result?.viewCount).toBe(100); // camelCase 확인
    expect(mockEq).toHaveBeenCalledWith('id', 1);
  });

  it('존재하지 않는 포스트는 null을 반환해야 한다', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: null,
    });

    const { getPostById } = await import('./posts');
    const result = await getPostById(999);

    expect(result).toBeNull();
  });

  it('Supabase 에러 발생 시 에러를 throw 해야 한다', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'Post not found' },
    });

    const { getPostById } = await import('./posts');

    await expect(getPostById(1)).rejects.toThrow('Failed to fetch post: Post not found');
  });
});
