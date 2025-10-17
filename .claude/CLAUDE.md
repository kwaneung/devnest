# DevNest 프로젝트

## 프로젝트 개요

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + daisyUI 5 기반의 반응형 웹 애플리케이션

- **패키지 매니저**: pnpm
- **아키텍처**: FSD (Feature-Sliced Design) v2.1
- **빌드 도구**: Turbopack
- **데이터 페칭**: Server Actions + `use cache` (Next.js 15+)

## 핵심 원칙

1. **반응형 웹 디자인**: 모바일 퍼스트 접근, Tailwind 브레이크포인트 준수
2. **코드 품질**: ESLint, Prettier, TypeScript strict 모드
3. **접근성**: WCAG 가이드라인 준수
4. **성능**: Next.js 최적화 기능 활용 (Image, Font 등)
5. **데이터 페칭**: Server Actions + `use cache` (Next.js 15+)

---

## 데이터베이스 및 데이터 페칭 핸드오프 룰

### 핵심 원칙

1. **Supabase DB는 Server Actions에서만 접근** - 상세 내용은 [supabase-guide.md](.claude/guides/supabase-guide.md) 참조
2. **`use cache` 지시문 사용** (Next.js 15+) - 상세 내용은 [caching.md](.claude/guides/caching.md) 참조
3. **app/ 레이어에서 데이터 페칭** - Server Component에서 Server Action 직접 호출
4. **Zod 스키마 검증** - DB 데이터는 항상 Zod로 검증 후 변환

### 간단한 예시

```typescript
// src/entities/post/api/postsActions.ts
'use server';

import { unstable_cacheTag as cacheTag } from 'next/cache';
import { supabase } from '@/shared/lib/supabase';
import { PostSchema, mapPostRowToPost } from '../model';

export async function getPosts(): Promise<Post[]> {
  'use cache';
  cacheTag('posts');

  const { data } = await supabase.from('posts').select('*');
  const validated = PostSchema.array().parse(data);
  return validated.map(mapPostRowToPost);
}
```

```typescript
// app/posts/page.tsx
import { getPosts } from '@/entities/post';

export default async function PostsPage() {
  const posts = await getPosts(); // 직접 호출
  return <PostList posts={posts} />;
}
```

### 상세 가이드

- [supabase-guide.md](.claude/guides/supabase-guide.md) - DB 접근 규칙 및 타입 관리
- [caching.md](.claude/guides/caching.md) - use cache 사용법 및 캐시 무효화 전략
- [server-actions.md](.claude/guides/server-actions.md) - Server Actions 및 API Routes 사용법

## 작업 후 필수 검사

코드 수정 후 **반드시** 다음 검사를 실행하세요:

```bash
# 1. Prettier 포맷팅 및 자동 수정
pnpm format

# 2. FSD 아키텍처 검사
pnpm steiger

# 3. Prettier, ESLint 및 TypeScript 검사
pnpm check
```

IMPORTANT: 파일 수정(Edit, Write) 작업을 완료한 후에는 항상 `pnpm format`, `pnpm steiger`, `pnpm check`를 순서대로 실행하여 코드 포맷, 아키텍처 및 코드 품질을 검증해야 합니다.

## 상세 가이드

필요시 아래 파일들을 참조하세요:

- @.claude/guides/architecture.md - FSD 아키텍처 구조
- @.claude/guides/coding-standards.md - TypeScript/React 코딩 표준
- @.claude/guides/responsive-design.md - 반응형 웹 디자인 가이드
- @.claude/guides/nextjs-patterns.md - Next.js App Router 패턴
- @.claude/guides/daisyui-guide.md - daisyUI 컴포넌트 사용법
- @.claude/guides/development.md - 개발 워크플로우
- @.claude/guides/supabase-guide.md - Supabase DB 접근 및 타입 관리
- @.claude/guides/caching.md - Next.js 15 use cache 캐싱 전략
- @.claude/guides/server-actions.md - Server Actions 및 API Routes 사용법

## 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 린팅
pnpm lint

# FSD 아키텍처 검사
pnpm steiger
```
