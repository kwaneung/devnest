# Next.js App Router 패턴

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
// src/entities/post/api/postsActions.ts
'use server';

import type { Post, GetPostsParams } from '../model';

export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  // 실제로는 DB나 외부 API 호출
  // 현재는 Mock 데이터 사용
  const mockData: Post[] = [{ id: 1, title: 'Post 1', content: 'Content 1' }];

  const sort = params?.sort || 'latest';
  // 정렬 로직...

  return mockData;
}
```

### 2. Server Component (정적 페이지 - SSG)

```typescript
// src/widgets/post-list/ui/PostListTable.tsx
import { getPosts } from '@/entities/post';

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
import { PostsPage } from '@/pages/posts';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsPage />
    </Suspense>
  );
}
```

### 4. Client Component (인터랙션 필요 시만)

```typescript
// 검색/필터링 등 인터랙션이 필요한 경우만 사용
'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/entities/post';

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
