# Next.js App Router 패턴

## 파일 구조

| 파일 | 용도 |
|------|------|
| `page.tsx` | 페이지 컴포넌트 |
| `layout.tsx` | 레이아웃 (중첩 가능) |
| `loading.tsx` | 로딩 UI (Suspense) |
| `error.tsx` | 에러 UI |
| `not-found.tsx` | 404 페이지 |

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
- `useSuspenseQuery`/`useSuspenseQueries` 위주 사용
- `useQuery`/`useQueries`는 지양
- Suspense + Error Boundary로 로딩/에러 처리

**데이터 흐름:**
```
useSuspenseQuery → fetcher 함수 → Next.js API Route
```

### 1. API Route (Mock 데이터)

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server';

export interface Post {
  id: number;
  title: string;
  content: string;
}

export async function GET() {
  // DB 연결 전 Mock 데이터 사용
  const mockData: Post[] = [
    { id: 1, title: 'Post 1', content: 'Content 1' },
  ];

  return NextResponse.json({
    success: true,
    data: mockData,
  });
}
```

### 2. Fetcher 함수

```typescript
// app/posts/api/postsApi.ts
import type { Post } from '@/app/api/posts/route';

interface PostsResponse {
  success: boolean;
  data: Post[];
}

export const postsApi = {
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch('/api/posts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const result: PostsResponse = await response.json();
    return result.data;
  },
};
```

### 3. Client Component (useSuspenseQuery)

```typescript
// app/posts/ui/PostList.tsx
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { postsApi } from '../api/postsApi';

export function PostList() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getPosts,
  });

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 4. Page Component (Suspense)

```typescript
// app/posts/page.tsx
import { Suspense } from 'react';
import { PostList } from './ui/PostList';

export default function PostsPage() {
  return (
    <div>
      <h1>포스트</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PostList />
      </Suspense>
    </div>
  );
}
```

### 왜 이 구조를 사용하는가?

**장점:**
1. **Streaming SSR 지원**: `ReactQueryStreamedHydration`과 완벽한 궁합
2. **자동 로딩 처리**: `isLoading` 체크 불필요, Suspense가 자동 처리
3. **에러 처리 일관성**: Error Boundary로 통합 관리
4. **타입 안정성**: API Route → Fetcher → Component 전체 타입 체인
5. **테스트 용이성**: Mock 데이터를 API Route에서 관리

**언제 Server Component 직접 fetch를 사용하는가?**
- SEO가 매우 중요한 정적 콘텐츠
- 클라이언트 인터랙션이 전혀 없는 경우

**현재 구조가 적합한 경우:**
- 실시간 업데이트 필요
- 클라이언트 인터랙션 많음 (필터링, 검색, 무한스크롤)
- 낙관적 업데이트 필요

## 현재 프로젝트 폰트

- **Pretendard**: 한글 최적화 폰트
- CSS 변수: `--font-sans`, `--font-mono`
