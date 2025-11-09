import { describe, expect, it } from 'vitest';

import {
  type GetPostsParams,
  GetPostsParamsSchema,
  POST_EXCERPT_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
  type Post,
  type PostRow,
  PostSchema,
  mapPostRowToPost,
} from './post';

describe('PostSchema', () => {
  const validPost: PostRow = {
    id: 1,
    title: '테스트 제목',
    excerpt: '테스트 요약',
    content: '테스트 내용',
    author: 'John Doe',
    published_at: '2025-10-31T09:00:00+00:00',
    tags: ['tech', 'javascript'],
    view_count: 100,
    created_at: '2025-10-31T09:00:00+00:00',
    updated_at: '2025-10-31T09:00:00+00:00',
    status: 'Published',
  };

  describe('유효한 데이터 검증', () => {
    it('유효한 Post 데이터를 통과시켜야 한다', () => {
      const result = PostSchema.safeParse(validPost);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPost);
      }
    });

    it('tags가 없으면 빈 배열을 기본값으로 설정해야 한다', () => {
      const postWithoutTags = { ...validPost, tags: undefined };
      const result = PostSchema.parse(postWithoutTags);

      expect(result.tags).toEqual([]);
    });

    it('view_count가 없으면 0을 기본값으로 설정해야 한다', () => {
      const postWithoutViewCount = { ...validPost, view_count: undefined };
      const result = PostSchema.parse(postWithoutViewCount);

      expect(result.view_count).toBe(0);
    });
  });

  describe('제목 검증', () => {
    it('빈 제목을 거부해야 한다', () => {
      const invalidPost = { ...validPost, title: '' };
      const result = PostSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('제목은 필수입니다');
      }
    });

    it('200자를 초과하는 제목을 거부해야 한다', () => {
      const longTitle = 'a'.repeat(201);
      const invalidPost = { ...validPost, title: longTitle };
      const result = PostSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('200자를 초과할 수 없습니다');
      }
    });

    it('정확히 200자인 제목을 허용해야 한다', () => {
      const maxTitle = 'a'.repeat(200);
      const postWithMaxTitle = { ...validPost, title: maxTitle };
      const result = PostSchema.safeParse(postWithMaxTitle);

      expect(result.success).toBe(true);
    });
  });

  describe('요약 검증', () => {
    it('빈 요약을 거부해야 한다', () => {
      const invalidPost = { ...validPost, excerpt: '' };
      const result = PostSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('요약은 필수입니다');
      }
    });

    it('500자를 초과하는 요약을 거부해야 한다', () => {
      const longExcerpt = 'a'.repeat(501);
      const invalidPost = { ...validPost, excerpt: longExcerpt };
      const result = PostSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500자를 초과할 수 없습니다');
      }
    });
  });

  describe('날짜 검증', () => {
    it('유효한 ISO 8601 날짜를 허용해야 한다', () => {
      const validDates = [
        '2025-10-31T09:00:00+00:00',
        '2025-10-31T09:00:00+09:00',
        '2025-10-31T09:00:00.000Z',
      ];

      validDates.forEach((date) => {
        const post = { ...validPost, published_at: date };
        const result = PostSchema.safeParse(post);

        expect(result.success).toBe(true);
      });
    });

    it('잘못된 날짜 형식을 거부해야 한다', () => {
      const invalidDates = ['2025-10-31', '2025/10/31', 'invalid-date'];

      invalidDates.forEach((date) => {
        const post = { ...validPost, published_at: date };
        const result = PostSchema.safeParse(post);

        expect(result.success).toBe(false);
      });
    });
  });

  describe('view_count 검증', () => {
    it('음수 조회수를 거부해야 한다', () => {
      const invalidPost = { ...validPost, view_count: -1 };
      const result = PostSchema.safeParse(invalidPost);

      expect(result.success).toBe(false);
    });

    it('0 조회수를 허용해야 한다', () => {
      const postWithZeroViews = { ...validPost, view_count: 0 };
      const result = PostSchema.safeParse(postWithZeroViews);

      expect(result.success).toBe(true);
    });
  });

  describe('status 검증', () => {
    it('Published 상태를 허용해야 한다', () => {
      const publishedPost = { ...validPost, status: 'Published' as const };
      const result = PostSchema.safeParse(publishedPost);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('Published');
      }
    });

    it('Draft 상태를 허용해야 한다', () => {
      const draftPost = { ...validPost, status: 'Draft' as const };
      const result = PostSchema.safeParse(draftPost);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('Draft');
      }
    });

    it('Archived 상태를 허용해야 한다', () => {
      const archivedPost = { ...validPost, status: 'Archived' as const };
      const result = PostSchema.safeParse(archivedPost);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('Archived');
      }
    });

    it('잘못된 status 값을 거부해야 한다', () => {
      const invalidStatuses = ['published', 'draft', 'archived', 'Pending', 'Active', ''];

      invalidStatuses.forEach((status) => {
        const invalidPost = { ...validPost, status };
        const result = PostSchema.safeParse(invalidPost);

        expect(result.success).toBe(false);
      });
    });

    it('status가 없으면 기본값 Published를 설정해야 한다', () => {
      const postWithoutStatus = { ...validPost, status: undefined };
      const result = PostSchema.parse(postWithoutStatus);

      expect(result.status).toBe('Published');
    });
  });
});

describe('mapPostRowToPost', () => {
  it('snake_case를 camelCase로 변환해야 한다', () => {
    const row: PostRow = {
      id: 1,
      title: '테스트',
      excerpt: '요약',
      content: '내용',
      author: 'John',
      published_at: '2025-10-31T09:00:00+00:00',
      tags: ['tag1'],
      view_count: 42,
      created_at: '2025-10-31T09:00:00+00:00',
      updated_at: '2025-10-31T09:00:00+00:00',
      status: 'Published',
    };

    const expected: Post = {
      id: 1,
      title: '테스트',
      excerpt: '요약',
      content: '내용',
      author: 'John',
      publishedAt: '2025-10-31T09:00:00+00:00',
      tags: ['tag1'],
      viewCount: 42,
      status: 'Published',
    };

    const result = mapPostRowToPost(row);

    expect(result).toEqual(expected);
  });

  it('날짜를 ISO 8601 문자열로 유지해야 한다', () => {
    const row: PostRow = {
      id: 1,
      title: 'Test',
      excerpt: 'Summary',
      content: 'Content',
      author: 'John',
      published_at: '2025-10-31T09:00:00+09:00',
      tags: [],
      view_count: 0,
      created_at: '2025-10-31T09:00:00+09:00',
      updated_at: '2025-10-31T09:00:00+09:00',
      status: 'Published',
    };

    const result = mapPostRowToPost(row);

    expect(result.publishedAt).toBe('2025-10-31T09:00:00+09:00');
    expect(typeof result.publishedAt).toBe('string');
  });

  it('필요한 필드만 포함해야 한다 (created_at, updated_at 제외)', () => {
    const row: PostRow = {
      id: 1,
      title: 'Test',
      excerpt: 'Summary',
      content: 'Content',
      author: 'John',
      published_at: '2025-10-31T09:00:00+00:00',
      tags: [],
      view_count: 0,
      created_at: '2025-10-31T09:00:00+00:00',
      updated_at: '2025-10-31T09:00:00+00:00',
      status: 'Published',
    };

    const result = mapPostRowToPost(row);

    expect('created_at' in result).toBe(false);
    expect('updated_at' in result).toBe(false);
    expect(Object.keys(result)).toEqual([
      'id',
      'title',
      'excerpt',
      'content',
      'author',
      'publishedAt',
      'tags',
      'viewCount',
      'status',
    ]);
  });
});

describe('GetPostsParamsSchema', () => {
  it('유효한 파라미터를 통과시켜야 한다', () => {
    const validParams: GetPostsParams = {
      sort: 'latest',
      limit: 10,
    };

    const result = GetPostsParamsSchema.safeParse(validParams);

    expect(result.success).toBe(true);
  });

  it('sort가 없어도 허용해야 한다', () => {
    const params = { limit: 10 };
    const result = GetPostsParamsSchema.safeParse(params);

    expect(result.success).toBe(true);
  });

  it('limit이 없어도 허용해야 한다', () => {
    const params = { sort: 'popular' };
    const result = GetPostsParamsSchema.safeParse(params);

    expect(result.success).toBe(true);
  });

  it('파라미터가 undefined여도 허용해야 한다', () => {
    const result = GetPostsParamsSchema.safeParse(undefined);

    expect(result.success).toBe(true);
  });

  it('잘못된 sort 값을 거부해야 한다', () => {
    const params = { sort: 'invalid' };
    const result = GetPostsParamsSchema.safeParse(params);

    expect(result.success).toBe(false);
  });

  it('음수 limit을 거부해야 한다', () => {
    const params = { limit: -1 };
    const result = GetPostsParamsSchema.safeParse(params);

    expect(result.success).toBe(false);
  });
});

describe('POST 상수', () => {
  it('POST_TITLE_MAX_LENGTH는 200이어야 한다', () => {
    expect(POST_TITLE_MAX_LENGTH).toBe(200);
  });

  it('POST_EXCERPT_MAX_LENGTH는 500이어야 한다', () => {
    expect(POST_EXCERPT_MAX_LENGTH).toBe(500);
  });
});
