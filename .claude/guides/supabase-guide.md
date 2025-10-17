# Supabase 데이터베이스 가이드

## 개요

DevNest 프로젝트에서 Supabase PostgreSQL 데이터베이스를 사용하여 데이터를 관리하는 방법에 대한 가이드입니다.

---

## 핵심 원칙

### 1. Server Actions에서만 DB 접근

```typescript
// ✅ 올바른 방법: Server Actions
'use server';

import { supabase } from '@/shared/lib/supabase';

export async function getPosts() {
  const { data } = await supabase.from('posts').select('*');
  return data;
}
```

```typescript
// ❌ 잘못된 방법: Client Component에서 직접 접근
'use client';

import { supabase } from '@/shared/lib/supabase';

function PostList() {
  // 보안 위험! 클라이언트에서 직접 DB 접근
  const { data } = await supabase.from('posts').select('*');
}
```

**이유:**

- **보안**: 클라이언트에서 직접 DB 접근 시 API 키 노출 위험
- **CORS**: Server Actions는 자동으로 CORS 이슈 해결
- **타입 안전성**: Server Actions는 TypeScript 타입 추론 완벽 지원

---

## 데이터 흐름: DB → Server → Client

### 전체 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    1. DATABASE LAYER                         │
│                    (Supabase PostgreSQL)                     │
└─────────────────────────────────────────────────────────────┘
  Table: posts
  published_at: timestamp
  view_count: integer
  tags: text[]
                        ↓

┌─────────────────────────────────────────────────────────────┐
│                    2. SUPABASE CLIENT                        │
│                 (JavaScript SDK Response)                    │
└─────────────────────────────────────────────────────────────┘
  {
    published_at: "2025-01-15T12:34:56.789Z", // ISO 8601 string
    view_count: 123,
    tags: ["react", "nextjs"]
  }
                        ↓

┌─────────────────────────────────────────────────────────────┐
│                    3. SERVER LAYER                           │
│              (Server Actions - 'use server')                 │
└─────────────────────────────────────────────────────────────┘

  ┌─ Step 3-1: Zod 스키마 검증 ─────────────────────┐
  │ PostSchema.parse(data)                          │
  │ - ISO 8601 형식 검증 (z.iso.datetime({ offset: true })) │
  │ - 타입 안전성 보장                              │
  │ - 비즈니스 규칙 검증                            │
  └─────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 3-2: PostRow 타입 ────────────────────────┐
  │ {                                                │
  │   published_at: string  (snake_case)            │
  │   view_count: number                             │
  │   tags: string[]                                 │
  │ }                                                │
  └─────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 3-3: mapPostRowToPost() 변환 ─────────────┐
  │ - snake_case → camelCase                        │
  │ - 필요한 필드만 선택                            │
  └─────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 3-4: Post 타입 ────────────────────────────┐
  │ {                                                │
  │   publishedAt: string  (camelCase)              │
  │   viewCount: number                              │
  │   tags: string[]                                 │
  │ }                                                │
  └─────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 3-5: 삼중 캐싱 전략 ───────────────────────┐
  │ 1. Page-level ISR (revalidate: 60)             │
  │ 2. Request-level cache() (React)                │
  │ 3. Function-level unstable_cache() (Next.js)    │
  └─────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 3-6: JSON 직렬화 ──────────────────────────┐
  │ Server Actions 반환값 자동 직렬화               │
  │ (Date 객체는 string으로 변환됨)                 │
  └─────────────────────────────────────────────────┘
                        ↓

┌─────────────────────────────────────────────────────────────┐
│                    4. APP LAYER                              │
│                 (app/posts/[id]/page.tsx)                    │
└─────────────────────────────────────────────────────────────┘
  const post = await getPostById(id); // Server Action 호출
  return <PostDetailPage post={post} />; // props로 전달
                        ↓

┌─────────────────────────────────────────────────────────────┐
│                    5. PAGES LAYER                            │
│            (pages/post-detail/ui/PostDetailPage.tsx)         │
└─────────────────────────────────────────────────────────────┘
  function PostDetailPage({ post }: { post: Post }) {
    // props로 데이터 수신
    return <div>...</div>;
  }
                        ↓

┌─────────────────────────────────────────────────────────────┐
│                    6. CLIENT (BROWSER)                       │
│                      (렌더링 및 표시)                        │
└─────────────────────────────────────────────────────────────┘
  new Date(post.publishedAt).toLocaleDateString('ko-KR')
  // "2025. 1. 15."
```

---

## Supabase 타입 자동 생성

### CLI를 통한 타입 자동화

프로젝트에서는 Supabase CLI를 사용하여 데이터베이스 스키마로부터 TypeScript 타입을 자동으로 생성합니다.

#### 1. 환경 변수 설정 (`.env.local`)

```bash
# Supabase 프로젝트 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 타입 생성용
SUPABASE_PROJECT_ID=your-project-id
```

**중요**: `.env.local` 파일은 `.gitignore`에 포함되어 있으므로 Git에 커밋되지 않습니다.

#### 2. 타입 생성 명령어

```bash
# 한 번에 타입 생성
pnpm supabase:gen-types

# 내부적으로 실행되는 명령어:
# npx supabase gen types typescript \
#   --project-id $SUPABASE_PROJECT_ID \
#   --schema public > src/shared/lib/supabase/types.ts
```

**특징:**

- `.env.local`에서 `SUPABASE_PROJECT_ID` 자동 참조
- `src/shared/lib/supabase/types.ts` 파일 자동 생성
- TypeScript 타입 안전성 보장

#### 3. 생성된 타입 사용

```typescript
// src/shared/lib/supabase/types.ts (자동 생성)
export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number;
          title: string;
          published_at: string; // ISO 8601
          tags: string[];
          // ...
        };
        Insert: {
          // 삽입 시 타입
        };
        Update: {
          // 업데이트 시 타입
        };
      };
    };
  };
};

// src/shared/lib/supabase/client.ts
import type { Database } from './types';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

#### 4. DB 스키마 변경 시 워크플로우

```bash
# 1. Supabase Dashboard에서 스키마 변경
# 2. 타입 재생성
pnpm supabase:gen-types

# 3. Zod 스키마 업데이트 (필요시)
# src/entities/post/model/schema.ts 수정

# 4. 타입 체크
pnpm type-check
```

---

## Zod 스키마 검증

### 왜 Zod를 사용하는가?

Supabase에서 반환된 데이터는 **런타임에 검증이 필요**합니다:

1. **타입 안전성**: TypeScript 타입은 컴파일 타임에만 존재
2. **데이터 무결성**: DB에서 예상치 못한 데이터가 올 수 있음
3. **변환**: snake_case → camelCase 등

### Zod 스키마 작성 가이드

```typescript
// src/entities/post/model/schema.ts
import { z } from 'zod';

/**
 * Post 엔티티 Zod 스키마
 *
 * 원칙:
 * 1. 날짜는 z.iso.datetime({ offset: true }) 사용 (ISO 8601 + timezone offset)
 * 2. 배열은 .default([]) 설정 (null 방지)
 * 3. 숫자는 .int().nonnegative() 등으로 범위 검증
 */
export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  author: z.string().min(1),
  published_at: z.iso.datetime({ offset: true }), // ✅ ISO 8601 + timezone offset
  tags: z.array(z.string()).default([]), // ✅ 기본값 설정
  view_count: z.number().int().nonnegative().default(0),
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
});

// Supabase Row 타입 (snake_case)
export type PostRow = z.infer<typeof PostSchema>;

// 프론트엔드 Post 타입 (camelCase)
export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string; // ISO 8601 문자열
  tags: string[];
  viewCount: number;
}
```

### 날짜 타입 처리 원칙

**❌ 잘못된 방법: Date 객체로 변환**

```typescript
// 비효율적: string → Date → string 변환
published_at: z.coerce.date(),

// mapPostRowToPost
publishedAt: row.published_at.toISOString(),
```

**✅ 올바른 방법: 문자열 유지**

```typescript
// 효율적: 문자열 검증만
published_at: z.iso.datetime({ offset: true }),

// mapPostRowToPost
publishedAt: row.published_at, // 그대로 전달
```

**이유:**

- Supabase는 이미 ISO 8601 문자열로 반환
- Server Actions는 JSON 직렬화 시 어차피 문자열이 됨
- 불필요한 Date 객체 생성/소멸 제거 → 성능 향상

---

## 데이터 변환 패턴

### snake_case → camelCase 변환

```typescript
// src/entities/post/model/schema.ts

/**
 * Supabase Row를 프론트엔드 Post로 변환
 */
export function mapPostRowToPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    publishedAt: row.published_at, // snake_case → camelCase
    tags: row.tags,
    viewCount: row.view_count, // snake_case → camelCase
  };
}
```

### Server Actions에서 사용

```typescript
// src/entities/post/api/postsActions.ts
'use server';

import { z } from 'zod';
import { supabase } from '@/shared/lib/supabase';
import { PostSchema, mapPostRowToPost } from '../model';

export async function getPosts() {
  // 1. Supabase에서 데이터 가져오기
  const { data, error } = await supabase.from('posts').select('*');

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // 2. Zod로 런타임 검증
  const validatedData = z.array(PostSchema).parse(data);

  // 3. snake_case → camelCase 변환
  return validatedData.map(mapPostRowToPost);
}
```

---

## 에러 처리

### 기본 에러 처리 패턴

```typescript
const { data, error } = await supabase.from('posts').select('*');

if (error) {
  throw new Error(`Failed to fetch posts: ${error.message}`);
}

if (!data) {
  return []; // 또는 null
}
```

### Zod 검증 에러

```typescript
try {
  const validatedData = PostSchema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation error:', error.errors);
    // 개발 환경에서만 상세 에러 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('Invalid data:', data);
    }
  }
  throw new Error('Data validation failed');
}
```

---

## 베스트 프랙티스

### 1. 타입 자동 생성 활용

```bash
# DB 스키마 변경 후 항상 실행
pnpm supabase:gen-types
```

### 2. 날짜는 항상 ISO 8601 문자열 (timezone offset 포함)

```typescript
// ✅ 올바른 방법
published_at: z.iso.datetime({ offset: true }),

// ❌ 잘못된 방법
published_at: z.coerce.date(),
```

### 3. 배열 필드에 기본값 설정

```typescript
// ✅ null 방지
tags: z.array(z.string()).default([]),

// ❌ null일 수 있음
tags: z.array(z.string()),
```

### 4. snake_case → camelCase 변환 함수 작성

```typescript
// ✅ 명시적 변환 함수
export function mapPostRowToPost(row: PostRow): Post {
  return {
    publishedAt: row.published_at,
    viewCount: row.view_count,
  };
}
```

---

## 참고 자료

- [Supabase TypeScript 지원](https://supabase.com/docs/guides/api/generating-types)
- [Zod 공식 문서](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
