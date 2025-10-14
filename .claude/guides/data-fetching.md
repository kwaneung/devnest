# 데이터 페칭 및 핸들링 가이드

## 개요

Next.js App Router에서 데이터를 페칭하고 핸들링하는 방법에 대한 종합 가이드입니다. **Server Actions**, **API Routes**, **Tanstack Query**를 언제 어떻게 사용할지 명확히 설명합니다.

---

## Server Actions

### 정의

서버에서 실행되는 비동기 함수로, `'use server'` 지시문으로 선언합니다.

### 주요 용도

1. **내부 데이터 페칭** (읽기)
2. **Form 제출 및 Mutation** (쓰기)
3. **클라이언트 컴포넌트에서 서버 로직 호출**

### 특징

- ✅ **타입 안전성**: TypeScript로 완벽한 타입 추론
- ✅ **직접 호출**: 함수처럼 직접 호출 가능
- ✅ **Next.js 통합**: `revalidatePath`, `revalidateTag` 사용 가능
- ❌ **URL 없음**: 외부에서 호출 불가능
- ❌ **POST만 가능**: 내부적으로 POST 요청으로 변환됨

### 예시 코드

```typescript
// src/entities/post/api/postsActions.ts
'use server';

import type { Post, GetPostsParams } from '../model';

/**
 * 포스트 목록을 가져오는 Server Action
 */
export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  // 외부 API 호출 (GET, POST, PUT, DELETE 모두 가능)
  const response = await fetch('https://api.example.com/posts', {
    method: 'GET',
    next: { revalidate: 3600 }, // ISR 캐싱
  });

  const data = await response.json();
  return data;
}

/**
 * 포스트를 생성하는 Server Action (Mutation)
 */
export async function createPost(formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await fetch('https://api.example.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });

  // Next.js 캐시 갱신
  revalidatePath('/posts');
}

/**
 * 포스트를 삭제하는 Server Action
 */
export async function deletePost(id: string): Promise<void> {
  await fetch(`https://api.example.com/posts/${id}`, {
    method: 'DELETE',
  });

  revalidatePath('/posts');
}
```

### 사용 예시

#### 1. Client Component + Tanstack Query (데이터 페칭)

```typescript
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getPosts } from '@/entities/post';

export function PostListTable() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts', 'latest'],
    queryFn: () => getPosts({ sort: 'latest' }),
  });

  return <div>{/* 렌더링 */}</div>;
}
```

#### 2. Form에서 Server Action 사용 (Mutation)

```typescript
'use client';

import { createPost } from '@/entities/post';

export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">제출</button>
    </form>
  );
}
```

#### 3. 버튼 클릭으로 Server Action 호출

```typescript
'use client';

import { deletePost } from '@/entities/post';

export function DeleteButton({ postId }: { postId: string }) {
  const handleDelete = async () => {
    await deletePost(postId);
  };

  return <button onClick={handleDelete}>삭제</button>;
}
```

---

## API Routes

### 정의

HTTP 엔드포인트를 제공하는 서버 측 라우트 핸들러입니다.

### 주요 용도

1. **Webhook 수신** (GitHub, Stripe 등)
2. **OAuth 콜백**
3. **외부 시스템에 API 제공** (모바일 앱, 써드파티)
4. **외부 API 프록시** (API 키 숨기기)

### 특징

- ✅ **공개 URL**: `/api/*` 경로로 외부 접근 가능
- ✅ **모든 HTTP 메서드**: GET, POST, PUT, DELETE 등
- ✅ **CORS 설정 가능**: 외부 도메인에서 호출 허용
- ❌ **타입 안전성 약함**: 수동으로 타입 정의 필요
- ❌ **Next.js 통합 제한적**: `revalidatePath` 등 사용 불가

### 예시 코드

```typescript
// src/app/api/webhook/stripe/route.ts
import { NextResponse } from 'next/server';

/**
 * Stripe Webhook 처리
 * 외부(Stripe)에서 이 엔드포인트로 요청을 보냄
 */
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();

  // Webhook 검증 및 처리
  try {
    const event = verifyWebhook(body, signature);
    await handleStripeEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}
```

```typescript
// src/app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';

/**
 * OAuth 콜백 처리
 * OAuth 프로바이더가 이 URL로 리다이렉트
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  // Access token 교환
  const token = await exchangeCodeForToken(code);

  return NextResponse.redirect('/dashboard');
}
```

```typescript
// src/app/api/proxy/external/route.ts
import { NextResponse } from 'next/server';

/**
 * 외부 API 프록시 (API 키 숨기기)
 * 클라이언트가 직접 외부 API를 호출하지 않고 우리 서버를 통해 호출
 */
export async function GET() {
  const response = await fetch('https://api.example.com/data', {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`, // 환경변수로 API 키 숨김
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

---

## 비교 요약

| 구분             | Server Actions                | API Routes                |
| ---------------- | ----------------------------- | ------------------------- |
| **주 용도**      | 내부 로직 (페칭, mutation)    | 외부 통합                 |
| **HTTP 메서드**  | POST만 (내부 구현)            | GET, POST, PUT, DELETE 등 |
| **URL**          | 없음                          | 있음 (`/api/*`)           |
| **호출 방식**    | 함수 직접 호출                | `fetch()` 필요            |
| **타입 안전성**  | ✅ 강력                       | ❌ 약함                   |
| **외부 호출**    | ❌ 불가능                     | ✅ 가능                   |
| **Next.js 통합** | ✅ 강력 (`revalidatePath` 등) | ❌ 제한적                 |
| **사용 사례**    | 폼 제출, 데이터 페칭          | Webhook, OAuth            |

---

## 의사결정 플로우차트

```
데이터 페칭/mutation이 필요한가?
│
├─ 예
│  │
│  ├─ 호출자가 내부(자기 앱)인가?
│  │  │
│  │  ├─ 예 → Server Actions 사용 ✅
│  │  │     (queryFn에서 Server Action 호출)
│  │  │
│  │  └─ 아니요 (외부 시스템, 모바일 앱)
│  │        → API Routes 사용 ✅
│  │
│  └─ Webhook, OAuth 콜백인가?
│     │
│     └─ 예 → API Routes 사용 ✅
│
└─ 아니요 → 다른 방법 고려
```

---

## DevNest 프로젝트 적용 가이드

### 현재 아키텍처

```
Server Component
  ↓ 직접 호출
Server Action
  ↓ REST API 호출
External API / Mock Data
```

**정적 페이지만 있는 경우:** Server Component에서 Server Action 직접 호출
**인터랙션 필요 시:** Client Component + Tanstack Query 추가

### 파일 구조

```
src/entities/post/
├── api/
│   ├── postsActions.ts    # ✅ Server Actions (내부 로직)
└── model/
    └── types.ts

src/app/api/                     # ⚠️ Webhook, OAuth 등만 유지
└── webhook/
    └── route.ts
```

### 언제 무엇을 사용할까?

#### ✅ Server Actions 사용

- **데이터 페칭**: 포스트 목록, 상세 조회
- **Form 제출**: 포스트 작성, 수정
- **Mutation**: 포스트 삭제, 좋아요
- **인증 관련**: 로그인, 로그아웃 (내부 처리)

#### ✅ API Routes 사용

- **Webhook**: GitHub, Stripe, Discord 등
- **OAuth 콜백**: Google, GitHub 로그인 리다이렉트
- **외부 API 제공**: 모바일 앱이 호출하는 엔드포인트
- **CORS 필요**: 다른 도메인에서 호출

#### ❌ 사용하지 말 것

- 단순히 외부 API를 감싸는 프록시 API Routes
  - 대신 Server Actions에서 직접 호출

---

## Tanstack Query 활용 가이드

### 핵심 개념

**Tanstack Query는 Server Component와 함께 사용할 수 없습니다.**

- ❌ Server Component + TQ → **초기 렌더링 시 오류 발생**
- ✅ Server Component → 직접 Server Action 호출
- ✅ Client Component + TQ → 인터랙션이 있을 때만

```
오류 예시:
Error: Server Functions cannot be called during initial render.
```

### 언제 Tanstack Query를 사용해야 하나?

#### ✅ 사용해야 하는 경우

**1. 클라이언트 측 인터랙션이 있는 GET 요청**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/entities/post';

// ✅ 실시간 검색
function SearchPosts() {
  const [search, setSearch] = useState('');

  const { data } = useQuery({
    queryKey: ['posts', search],
    queryFn: () => getPosts({ search }),
    enabled: search.length > 0, // 조건부 쿼리
  });

  return (
    <>
      <input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색..."
      />
      {data && <PostsList posts={data} />}
    </>
  );
}

// ✅ 실시간 필터링
function PostsWithFilter() {
  const [filter, setFilter] = useState<'latest' | 'popular'>('latest');

  const { data } = useQuery({
    queryKey: ['posts', filter],
    queryFn: () => getPosts({ sort: filter }),
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });

  return (
    <>
      <select onChange={(e) => setFilter(e.target.value as 'latest' | 'popular')}>
        <option value="latest">최신순</option>
        <option value="popular">인기순</option>
      </select>
      {data && <PostsList posts={data} />}
    </>
  );
}

// ✅ 무한 스크롤
function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => getPosts({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return (
    <>
      {data.pages.map((page) =>
        page.map((post) => <PostCard key={post.id} post={post} />)
      )}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? '로딩 중...' : '더 보기'}
      </button>
    </>
  );
}

// ✅ 자동 갱신 (폴링)
function LivePostList() {
  const { data } = useQuery({
    queryKey: ['posts', 'live'],
    queryFn: () => getPosts(),
    refetchInterval: 30000, // 30초마다 자동 갱신
  });

  return <PostsList posts={data} />;
}
```

**2. Mutation + 낙관적 업데이트**

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, deletePost } from '@/entities/post';

// ✅ 낙관적 업데이트 (즉시 UI 반영)
function PostForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // 이전 데이터 백업
      const previousPosts = queryClient.getQueryData(['posts']);

      // 낙관적 업데이트 (즉시 UI에 반영)
      queryClient.setQueryData(['posts'], (old: Post[]) => [
        ...old,
        { ...newPost, id: Date.now(), createdAt: new Date().toISOString() }
      ]);

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // 실패 시 이전 데이터로 롤백
      queryClient.setQueryData(['posts'], context?.previousPosts);
      toast.error('포스트 생성에 실패했습니다.');
    },
    onSuccess: () => {
      // 성공 시 서버에서 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('포스트가 생성되었습니다!');
    },
  });

  const handleSubmit = (formData: FormData) => {
    mutation.mutate(formData);
  };

  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? '생성 중...' : '제출'}
      </button>
    </form>
  );
}

// ✅ 삭제 + 낙관적 업데이트
function DeleteButton({ postId }: { postId: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deletePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // 즉시 UI에서 제거
      queryClient.setQueryData(['posts'], (old: Post[]) =>
        old.filter((post) => post.id !== postId)
      );

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate()}>
      {mutation.isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}
```

**3. 복잡한 상태 관리 및 에러 처리**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/entities/post';

// ✅ 재시도, 에러 처리, 로딩 상태
function PostList() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    retry: 3, // 실패 시 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 캐시 유지 시간
  });

  if (isLoading) return <Spinner />;
  if (isError) return (
    <div>
      <p>오류: {error.message}</p>
      <button onClick={() => refetch()}>다시 시도</button>
    </div>
  );

  return <PostsList posts={data} />;
}
```

#### ❌ 사용하지 말아야 하는 경우

**1. 정적 페이지 (초기 로드만)**

```typescript
// ❌ 잘못된 사용 - TQ 불필요
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getPosts } from '@/entities/post';

export function PostList() {
  const { data } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  });

  return <div>{/* 렌더링 */}</div>;
}
```

```typescript
// ✅ ��바른 사용 - Server Component
import { getPosts } from '@/entities/post';

export async function PostList() {
  const posts = await getPosts();

  return <div>{/* 렌더링 */}</div>;
}
```

**2. 단순 Form 제출 (낙관적 UI 불필요)**

```typescript
// ❌ TQ 불필요
'use client';

import { useMutation } from '@tanstack/react-query';
import { createPost } from '@/entities/post';

function PostForm() {
  const mutation = useMutation({
    mutationFn: createPost,
  });

  return <form onSubmit={(e) => {
    e.preventDefault();
    mutation.mutate(new FormData(e.target));
  }}>...</form>;
}
```

```typescript
// ✅ Server Action 직접 호출
'use client';

import { createPost } from '@/entities/post';
import { useRouter } from 'next/navigation';

function PostForm() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await createPost(formData);
    router.refresh(); // 페이지 새로고침
  };

  return <form action={handleSubmit}>...</form>;
}
```

### 주의사항

#### 1. Server Component vs Client Component

```typescript
// ❌ 오류 발생: Server Functions cannot be called during initial render
'use client';

export function PostList() {
  const { data } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(), // Server Action
  });

  return <div>{data}</div>;
}

// src/app/page.tsx
export default function Page() {
  return <PostList />; // 초기 렌더링 시 오류!
}
```

```typescript
// ✅ 해결 방법 1: Server Component 사용
export async function PostList() {
  const posts = await getPosts(); // Server Action 직접 호출

  return <div>{posts}</div>;
}

// ✅ 해결 방법 2: force-dynamic (SSG 포기)
// src/app/page.tsx
export const dynamic = 'force-dynamic';

export default function Page() {
  return <PostList />; // 동적 렌더링
}
```

#### 2. SSG/ISR 트레이드오프

| 방식                                    | SSG/ISR | TQ 사용 | 인터랙션 | SEO |
| --------------------------------------- | ------- | ------- | -------- | --- |
| Server Component                        | ✅      | ❌      | ❌       | ✅  |
| Client Component + TQ + `force-dynamic` | ❌      | ✅      | ✅       | ⚠️  |
| Client Component + TQ (인터랙션만)      | ✅      | ✅      | ✅       | ✅  |

**권장 패턴:**

```typescript
// ✅ 초기 데이터는 Server Component로, 인터랙션은 Client Component로
// src/app/posts/page.tsx
import { getPosts } from '@/entities/post';
import { PostListClient } from './PostListClient';

export default async function PostsPage() {
  const initialPosts = await getPosts(); // SSG

  return <PostListClient initialPosts={initialPosts} />;
}

// PostListClient.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/entities/post';

export function PostListClient({ initialPosts }: { initialPosts: Post[] }) {
  const [filter, setFilter] = useState('latest');

  const { data } = useQuery({
    queryKey: ['posts', filter],
    queryFn: () => getPosts({ sort: filter }),
    initialData: initialPosts, // 초기 데이터 사용
  });

  return (
    <>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="latest">최신순</option>
        <option value="popular">인기순</option>
      </select>
      <PostsList posts={data} />
    </>
  );
}
```

### Tanstack Query 사용 결정 플로우

```
페이지에 사용자 인터랙션이 있는가?
│
├─ 아니요 (정적 표시만)
│  │
│  └─ Server Component 사용 ✅
│     - await getPosts() 직접 호출
│     - SSG/ISR 활용
│     - SEO 최적화
│
└─ 예 (검색, 필터, 스크롤 등)
   │
   ├─ 초기 데이터 + 인터랙션 모두 필요?
   │  │
   │  ├─ 예 → Server Component + Client Component 조합 ✅
   │  │     - 초기: Server Component로 SSG
   │  │     - 인터랙션: Client Component + TQ
   │  │
   │  └─ 아니요 (인터랙션만) → Client Component + TQ ✅
   │        - force-dynamic 필요
   │
   └─ Mutation + 낙관적 UI 필요?
      │
      └─ 예 → useMutation + onMutate ✅
```

### 요약: GET vs Mutation

| 작업                            | TQ 필요 여부 | 이유                       |
| ------------------------------- | ------------ | -------------------------- |
| **GET - 정적 표시**             | ❌           | Server Component로 충분    |
| **GET - 검색/필터**             | ✅           | 클라이언트 측 상태 변화    |
| **GET - 무한 스크롤**           | ✅           | `useInfiniteQuery` 필요    |
| **GET - 자동 갱신**             | ✅           | `refetchInterval` 필요     |
| **POST/PUT/DELETE - 단순**      | ❌           | Server Action 직접 호출    |
| **POST/PUT/DELETE - 낙관적 UI** | ✅           | `useMutation` + `onMutate` |
| **복잡한 에러 처리**            | ✅           | 재시도, 에러 상태 관리     |

---

## 인터랙션에 따른 선택 가이드

| 기능                       | 권장 방식                                  | Tanstack Query 필요? |
| -------------------------- | ------------------------------------------ | -------------------- |
| 단순 목록 표시 (정적)      | Server Component                           | ❌                   |
| 실시간 검색/필터링         | Client Component + TQ + Server Actions     | ✅                   |
| Form 제출 (단순)           | Client Component + Server Actions          | ❌                   |
| Form 제출 (낙관적 UI)      | Client Component + TQ + Server Actions     | ✅                   |
| 무한 스크롤                | Client Component + TQ (`useInfiniteQuery`) | ✅                   |
| 자동 갱신 (polling)        | Client Component + TQ (`refetchInterval`)  | ✅                   |
| URL 기반 필터링 (SEO 중요) | Server Component + searchParams            | ❌                   |

---

## 참고 자료

- [Next.js Server Actions 공식 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js Route Handlers 공식 문서](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Tanstack Query with Server Actions](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
