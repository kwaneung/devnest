# Next.js App Router 패턴 (Next.js 16 + React 19.2)

## 파일 구조

| 파일            | 용도                 |
| --------------- | -------------------- |
| `page.tsx`      | 페이지 컴포넌트      |
| `layout.tsx`    | 레이아웃 (중첩 가능) |
| `loading.tsx`   | 로딩 UI (Suspense)   |
| `error.tsx`     | 에러 UI              |
| `not-found.tsx` | 404 페이지           |

## 페이지 컴포넌트 템플릿

```typescript
import type { Metadata } from 'next';

// 메타데이터 (정적)
export const metadata: Metadata = {
  title: '페이지 제목',
  description: '페이지 설명',
};

// 또는 동적 메타데이터
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `제목 - ${params.id}`,
  };
}

// 페이지 컴포넌트
export default function PageName() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 콘텐츠 */}
    </div>
  );
}
```

## 레이아웃 패턴

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-dvh">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## React 19.2 패턴

### useEffectEvent (새로운 안정화 API)

`useEffectEvent`는 React 19.2에서 안정화된 API로, Effect 내에서 최신 값을 읽되 의존성 배열에 포함하지 않아도 되는 함수를 만들 때 사용합니다.

```typescript
'use client';

import { useEffect, useEffectEvent, useState } from 'react';

export default function Component() {
  const [year, setYear] = useState<number | null>(null);

  // useEffectEvent로 감싸면 의존성 배열에서 제외 가능
  const updateYear = useEffectEvent(() => {
    setYear(new Date().getFullYear());
  });

  useEffect(() => {
    updateYear(); // eslint 경고 없음
  }, []); // 빈 배열 가능

  return <p>© {year ?? '2025'}</p>;
}
```

**사용 사례:**

- `new Date()` 같은 비결정적 값 처리
- Effect 내에서 setState를 호출하지만 의존성으로 넣고 싶지 않을 때
- 최신 props/state 값을 읽되 재실행을 트리거하지 않을 때

### Hydration 안전 패턴

Next.js 16에서는 Hydration 검증이 더 엄격해졌습니다. 클라이언트 전용 값(localStorage, new Date 등)은 다음 패턴을 사용하세요:

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ClientOnlyComponent() {
  // 초기값을 null로 설정 (서버와 클라이언트 동일)
  const [themeMode, setThemeMode] = useState<ThemeMode | null>(null);

  // useEffect에서 클라이언트 전용 값 읽기
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setThemeMode(saved || 'system');
  }, []);

  // null일 때 로딩 상태 렌더링
  if (!themeMode) {
    return <div>Loading...</div>;
  }

  return <div>Theme: {themeMode}</div>;
}
```

## 성능 최적화

### 이미지 최적화 (필수)

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="설명"
  width={800}
  height={600}
  priority // LCP 이미지에만 사용
/>
```

### 폰트 최적화

```typescript
import localFont from 'next/font/local';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
});

export default function RootLayout({ children }) {
  return (
    <html className={pretendard.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 동적 Import

```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // CSR만 필요한 경우
});
```

## 데이터 페칭

### 프로젝트 데이터 페칭 전략

**핵심 원칙:**

- **정적 페이지**: Server Component에서 Server Actions 직접 호출 (SSG/ISR 활용)
- **인터랙션 있는 페이지**: Client Component + Tanstack Query + Server Actions
- 상세한 내용은 `@.claude/guides/data-fetching.md` 참조

**데이터 흐름:**

```
Server Component → Server Action → Mock Data / External API
```

### 1. Server Actions (데이터 페칭 함수)

```typescript
// src/services/posts.ts
'use server';

import { cacheTag } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { PostSchema, mapPostRowToPost } from '@/types/post';
import type { Post, GetPostsParams } from '@/types/post';

export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  'use cache';
  cacheTag('posts');

  const { data } = await supabase.from('posts').select('*');
  const validated = PostSchema.array().parse(data);
  return validated.map(mapPostRowToPost);
}
```

### 2. Server Component (정적 페이지 - SSG)

```typescript
// src/app/posts/_components/PostListTable.tsx
import { getPosts } from '@/services/posts';

export async function PostListTable() {
  const posts = await getPosts({ sort: 'latest' });

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 3. Page Component (Suspense)

```typescript
// src/app/posts/page.tsx
import { Suspense } from 'react';
import { PostListTable } from './_components/PostListTable';

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">포스트</h1>
        <p className="text-base-content/70">DevNest의 모든 글을 만나보세요</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <PostListTable />
      </Suspense>
    </div>
  );
}
```

### 4. Client Component (인터랙션 필요 시만)

```typescript
// 검색/필터링 등 인터랙션이 필요한 경우만 사용
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/posts';

export function PostSearch() {
  const [search, setSearch] = useState('');

  const { data: posts } = useQuery({
    queryKey: ['posts', search],
    queryFn: () => getPosts({ search }),
    enabled: search.length > 0,
  });

  return (
    <>
      <input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색..."
      />
      {posts?.map((post) => <div key={post.id}>{post.title}</div>)}
    </>
  );
}
```

### 현재 구조의 장점

**Server Component 우선 전략:**

1. **SSG/ISR 지원**: 빌드 타임에 정적 생성, CDN 캐싱
2. **SEO 최적화**: 초기 HTML에 컨텐츠 포함
3. **성능 향상**: Zero JavaScript (인터랙션 없으면)
4. **타입 안전성**: Server Action → Component 직접 연결

**언제 Client Component + Tanstack Query 사용?**

- 실시간 검색/필터링
- 무한 스크롤
- 낙관적 업데이트 (mutation)
- 복잡한 클라이언트 상태 관리

**API Routes는 언제 사용?**

- Webhook 수신 (Stripe, GitHub 등)
- OAuth 콜백
- 외부 시스템에 API 제공

## 현재 프로젝트 폰트

- **Pretendard**: 한글 최적화 폰트
- CSS 변수: `--font-sans`, `--font-mono`
