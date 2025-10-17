# Server Actions 및 API Routes 가이드

## 개요

Next.js App Router에서 서버 측 데이터 처리를 위한 **Server Actions**와 **API Routes**의 사용법 가이드입니다.

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

import { revalidatePath, revalidateTag } from 'next/cache';
import type { Post, GetPostsParams } from '../model';

/**
 * 포스트 목록을 가져오는 Server Action
 */
export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  'use cache';
  cacheTag('posts');

  const { data } = await supabase.from('posts').select('*');
  return data;
}

/**
 * 포스트를 생성하는 Server Action (Mutation)
 */
export async function createPost(formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await supabase.from('posts').insert({ title, content });

  // Next.js 캐시 갱신
  revalidatePath('/posts');
  revalidateTag('posts');
}

/**
 * 포스트를 수정하는 Server Action
 */
export async function updatePost(id: number, formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await supabase.from('posts').update({ title, content }).eq('id', id);

  revalidatePath(`/posts/${id}`);
  revalidateTag('posts');
  revalidateTag(`post-${id}`);
}

/**
 * 포스트를 삭제하는 Server Action
 */
export async function deletePost(id: number): Promise<void> {
  await supabase.from('posts').delete().eq('id', id);

  revalidatePath('/posts');
  revalidateTag('posts');
}
```

---

## Server Actions 사용 예시

### 1. Server Component에서 직접 호출 (데이터 페칭)

```typescript
// app/posts/page.tsx
import { getPosts } from '@/entities/post';

export default async function PostsPage() {
  const posts = await getPosts(); // 직접 호출

  return <PostList posts={posts} />;
}
```

### 2. Form에서 Server Action 사용 (Mutation)

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

### 3. 버튼 클릭으로 Server Action 호출

```typescript
'use client';

import { deletePost } from '@/entities/post';
import { useRouter } from 'next/navigation';

export function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    await deletePost(postId);
    router.refresh(); // 페이지 새로고침
  };

  return <button onClick={handleDelete}>삭제</button>;
}
```

---

## 클라이언트 측 인터랙션 처리

### useTransition을 사용한 폼 제출

Server Action을 호출할 때 `useTransition`을 사용하면 로딩 상태를 관리할 수 있습니다.

```typescript
'use client';

import { useTransition } from 'react';
import { createPost } from '@/entities/post';

export function PostForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await createPost(formData);
    });
  };

  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit" disabled={isPending}>
        {isPending ? '제출 중...' : '제출'}
      </button>
    </form>
  );
}
```

### useFormStatus를 사용한 폼 상태

```typescript
'use client';

import { useFormStatus } from 'react-dom';
import { createPost } from '@/entities/post';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '제출 중...' : '제출'}
    </button>
  );
}

export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <SubmitButton />
    </form>
  );
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

#### Webhook 처리

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

#### OAuth 콜백

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

#### 외부 API 프록시

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

## Server Actions vs API Routes 비교

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
  ↓ Supabase 호출
Database
```

**기본 패턴:** Server Component에서 Server Action 직접 호출

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

## 참고 자료

- [Next.js Server Actions 공식 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js Route Handlers 공식 문서](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Data Fetching 패턴](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)
