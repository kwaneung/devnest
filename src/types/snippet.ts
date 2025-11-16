import { z } from 'zod';

/**
 * Snippet 엔티티 Zod 스키마
 * Supabase에서 가져온 데이터를 런타임에 검증합니다.
 *
 * 특징:
 * - 날짜는 ISO 8601 문자열로 유지 (z.iso.datetime({ offset: true }))
 * - Supabase timestamptz 형식: "2025-10-01T09:00:00+00:00"
 * - 불필요한 Date 변환을 제거하여 성능 최적화
 * - 비즈니스 규칙 검증 (제목 최소 길이, 코드 최소 길이 등)
 * - null/undefined 안전성 보장
 * - 기본값 설정 (tags, status)
 */
export const SnippetSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 200자를 초과할 수 없습니다'),
  description: z.string().max(500, '설명은 500자를 초과할 수 없습니다').optional(),
  code: z.string().min(1, '코드는 필수입니다'),
  language: z.string().min(1, '언어는 필수입니다'),
  author: z.string().min(1, '작성자는 필수입니다'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['Published', 'Draft', 'Archived']).default('Published'),
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
});

/**
 * Supabase에서 가져온 원본 Snippet 타입 (snake_case)
 * 날짜 필드는 ISO 8601 with timezone offset (예: "2025-10-01T09:00:00+00:00")
 */
export type SnippetRow = z.infer<typeof SnippetSchema>;

/**
 * 프론트엔드에서 사용하는 Snippet 타입 (camelCase)
 * snake_case를 camelCase로 변환
 * 날짜는 ISO 8601 문자열로 유지 (Server Actions JSON 직렬화 호환)
 */
export interface Snippet {
  id: number;
  title: string;
  description?: string;
  code: string;
  language: string;
  author: string;
  tags: string[];
  status: 'Published' | 'Draft' | 'Archived';
  createdAt: string; // ISO 8601 with timezone offset (예: "2025-10-01T09:00:00+00:00")
  updatedAt: string; // ISO 8601 with timezone offset
}

/**
 * getSnippets 파라미터 스키마
 */
export const GetSnippetsParamsSchema = z
  .object({
    language: z.string().optional(), // 'typescript', 'python', 'javascript' 등
    tag: z.string().optional(), // 'react', 'hooks' 등
    limit: z.number().int().positive().optional(),
  })
  .optional();

export type GetSnippetsParams = z.infer<typeof GetSnippetsParamsSchema>;

/**
 * Supabase Row를 프론트엔드 Snippet으로 변환
 * snake_case를 camelCase로 변환하고, 필요한 필드만 선택
 * 날짜는 이미 ISO 8601 문자열이므로 변환 불필요
 */
export function mapSnippetRowToSnippet(row: SnippetRow): Snippet {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    code: row.code,
    language: row.language,
    author: row.author,
    tags: row.tags,
    status: row.status,
    createdAt: row.created_at, // 이미 ISO 8601 문자열
    updatedAt: row.updated_at, // 이미 ISO 8601 문자열
  };
}

/**
 * 스니펫 통계 타입
 */
export interface SnippetsStats {
  count: number;
  languageDistribution: Record<string, number>; // { typescript: 10, python: 5, ... }
}

/**
 * Snippet 상수
 */
export const SNIPPET_TITLE_MAX_LENGTH = 200;
export const SNIPPET_DESCRIPTION_MAX_LENGTH = 500;

/**
 * 지원 언어 목록
 */
export const SUPPORTED_LANGUAGES = [
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'sql', label: 'SQL', icon: '🗄️' },
  { value: 'bash', label: 'Bash', icon: '💻' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'html', label: 'HTML', icon: '📄' },
  { value: 'json', label: 'JSON', icon: '📋' },
  { value: 'yaml', label: 'YAML', icon: '📝' },
  { value: 'markdown', label: 'Markdown', icon: '📖' },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]['value'];
