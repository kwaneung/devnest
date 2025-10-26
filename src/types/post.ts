import { z } from 'zod';

/**
 * Post 엔티티 Zod 스키마
 * Supabase에서 가져온 데이터를 런타임에 검증합니다.
 *
 * 특징:
 * - 날짜는 ISO 8601 문자열로 유지 (z.iso.datetime({ offset: true }))
 * - Supabase timestamptz 형식: "2025-10-01T09:00:00+00:00"
 * - 불필요한 Date 변환을 제거하여 성능 최적화
 * - 비즈니스 규칙 검증 (제목 최소 길이, 내용 최소 길이 등)
 * - null/undefined 안전성 보장
 * - 기본값 설정 (tags, view_count)
 */
export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 200자를 초과할 수 없습니다'),
  excerpt: z.string().min(1, '요약은 필수입니다').max(500, '요약은 500자를 초과할 수 없습니다'),
  content: z.string().min(1, '내용은 필수입니다'),
  author: z.string().min(1, '작성자는 필수입니다'),
  published_at: z.iso.datetime({ offset: true }),
  tags: z.array(z.string()).default([]),
  view_count: z.number().int().nonnegative().default(0),
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
});

/**
 * Supabase에서 가져온 원본 Post 타입 (snake_case)
 * 날짜 필드는 ISO 8601 with timezone offset (예: "2025-10-01T09:00:00+00:00")
 */
export type PostRow = z.infer<typeof PostSchema>;

/**
 * 프론트엔드에서 사용하는 Post 타입 (camelCase)
 * snake_case를 camelCase로 변환
 * 날짜는 ISO 8601 문자열로 유지 (Server Actions JSON 직렬화 호환)
 */
export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string; // ISO 8601 with timezone offset (예: "2025-10-01T09:00:00+00:00")
  tags: string[];
  viewCount: number;
}

/**
 * getPosts 파라미터 스키마
 */
export const GetPostsParamsSchema = z
  .object({
    sort: z.enum(['latest', 'popular']).optional(),
    limit: z.number().int().positive().optional(),
  })
  .optional();

export type GetPostsParams = z.infer<typeof GetPostsParamsSchema>;

/**
 * Supabase Row를 프론트엔드 Post로 변환
 * snake_case를 camelCase로 변환하고, 필요한 필드만 선택
 * 날짜는 이미 ISO 8601 문자열이므로 변환 불필요
 */
export function mapPostRowToPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    publishedAt: row.published_at, // 이미 ISO 8601 문자열
    tags: row.tags,
    viewCount: row.view_count,
  };
}

/**
 * Post 상수
 */
export const POST_TITLE_MAX_LENGTH = 200;
export const POST_EXCERPT_MAX_LENGTH = 500;
