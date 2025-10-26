# 캐싱 가이드 (Next.js 16+)

## 개요

Next.js 16의 `use cache` 지시문을 사용한 최신 캐싱 전략 가이드입니다. Next.js 16부터는 `use cache`가 안정화되었으며, Cache Components 기능이 공식 지원됩니다.

---

## ⚡ use cache - 최신 캐싱 방식

**권장**: Next.js 16에서는 `use cache` 지시문 하나로 모든 컴포넌트 단위 캐싱을 처리합니다.

### 기본 사용법

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

  // DB 호출
  const { data } = await supabase.from('posts').select('*');
  const validated = PostSchema.array().parse(data);
  return validated.map(mapPostRowToPost);
}
```

**주요 변경사항 (Next.js 16):**

- `unstable_cacheTag` → `cacheTag` (안정화)
- `unstable_cacheLife` → `cacheLife` (안정화)
- `revalidate` 페이지 설정 더 이상 사용하지 않음 (Cache Components와 호환 불가)

### next.config.ts 설정

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true, // React Compiler 활성화
  cacheComponents: true, // Cache Components 활성화 (Next.js 16)
  cacheLife: {
    // experimental에서 제거됨
    // 기본 캐시 프로필
    default: {
      stale: 60, // 60초: fresh 상태
      revalidate: 300, // 5분: 백그라운드 재검증 (ISR 개념)
      expire: 900, // 15분: 완전 만료
    },
  },
};
```

---

## 커스텀 캐시 프로필

기본 캐시 설정과 다른 캐싱이 필요한 경우 커스텀 프로필을 추가할 수 있습니다.

### 1. next.config.ts에 프로필 추가

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  cacheLife: {
    // 기본 프로필 (5분 캐시)
    default: {
      stale: 60,
      revalidate: 300,
      expire: 900,
    },
    // 자주 변경되는 데이터 (1분 캐시)
    short: {
      stale: 10, // 10초
      revalidate: 60, // 1분
      expire: 300, // 5분
    },
    // 거의 변경 안되는 데이터 (1시간 캐시)
    long: {
      stale: 300, // 5분
      revalidate: 3600, // 1시간
      expire: 7200, // 2시간
    },
  },
};
```

### 2. 코드에서 사용

```typescript
'use server';

import { cacheLife, cacheTag } from 'next/cache';

// 자주 변경되는 데이터 (실시간 랭킹 등)
export async function getRanking() {
  'use cache';
  cacheLife('short'); // short 프로필 사용
  cacheTag('ranking');

  const { data } = await supabase.from('ranking').select('*');
  return data;
}

// 거의 변경 안되는 데이터 (카테고리, 설정 등)
export async function getCategories() {
  'use cache';
  cacheLife('long'); // long 프로필 사용
  cacheTag('categories');

  const { data } = await supabase.from('categories').select('*');
  return data;
}

// cacheLife() 생략 시 default 프로필 사용
export async function getPosts() {
  'use cache';
  cacheTag('posts');

  const { data } = await supabase.from('posts').select('*');
  return data;
}
```

### 3. 사용 시나리오별 권장 프로필

| 데이터 유형   | 권장 프로필   | 예시                    |
| ------------- | ------------- | ----------------------- |
| 실시간 데이터 | short (1분)   | 랭킹, 좋아요 수, 조회수 |
| 일반 데이터   | default (5분) | 게시글, 댓글            |
| 정적 데이터   | long (1시간)  | 카테고리, 태그, 설정    |

---

## 캐시 태그와 무효화

### 4가지 API 개요

Next.js 16에서는 캐싱 관련 4가지 주요 API를 제공합니다:

1. **`cacheTag()`**: 캐시된 데이터에 태그 부여
2. **`revalidateTag()`**: 태그된 캐시를 무효화 (Stale-While-Revalidate)
3. **`updateTag()`**: 태그된 캐시를 즉시 갱신 (Read-Your-Writes) - **Next.js 16 신규**
4. **`refresh()`**: 캐시되지 않은 동적 데이터만 갱신 - **Next.js 16 신규**

### cacheTag() - 캐시 태그 부여

`cacheTag`는 캐시된 데이터에 **태그(라벨)**를 붙여서 나중에 특정 태그의 모든 캐시를 무효화하거나 갱신할 수 있게 해줍니다.

**왜 필요한가?**

- 데이터 변경(생성/수정/삭제) 후 관련 캐시를 즉시 갱신하기 위해
- 캐시 시간이 남아있어도 강제로 새로고침하기 위해

### 기본 사용법

```typescript
'use server';

import { cacheTag } from 'next/cache';

// 1. 캐시할 때 태그 붙이기
export async function getPosts() {
  'use cache';
  cacheTag('posts'); // 'posts' 태그 지정

  const { data } = await supabase.from('posts').select('*');
  return data;
}

export async function getPostById(id: number) {
  'use cache';
  cacheTag('posts', `post-${id}`); // 여러 태그 지정 가능

  const { data } = await supabase.from('posts').select('*').eq('id', id).single();
  return data;
}
```

### revalidateTag() - Stale-While-Revalidate 무효화

**⚠️ Next.js 16 Breaking Change**: `revalidateTag()`는 이제 **두 번째 인자가 필수**입니다.

```typescript
'use server';

import { revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  await supabase.from('posts').insert({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  // ✅ Next.js 16: 두 번째 인자 필수
  revalidateTag('posts', 'max'); // 'max' 프로필 권장
}

export async function deletePost(id: number) {
  await supabase.from('posts').delete().eq('id', id);

  // 여러 태그 동시 무효화
  revalidateTag('posts', 'max');
  revalidateTag(`post-${id}`, 'max');
}
```

**cacheLife 프로필 옵션:**

```typescript
// 내장 프로필
revalidateTag('posts', 'max'); // 가장 긴 캐시 (권장)
revalidateTag('news', 'hours'); // 시간 단위 캐시
revalidateTag('analytics', 'days'); // 일 단위 캐시

// 커스텀 revalidate 시간
revalidateTag('products', { revalidate: 3600 }); // 1시간
```

**특징:**

- **Stale-While-Revalidate**: 기존 캐시를 제공하면서 백그라운드에서 갱신
- **점진적 반영**: 사용자가 즉시 변경사항을 보지 못할 수 있음
- **Server Actions & Route Handlers**: 모두 사용 가능

### updateTag() - 즉시 갱신 (Read-Your-Writes) 🆕

**Next.js 16 신규 API**: 사용자가 변경한 내용을 **즉시** 볼 수 있어야 할 때 사용합니다.

```typescript
'use server';

import { updateTag } from 'next/cache';

export async function updateUserProfile(formData: FormData) {
  const userId = formData.get('userId') as string;
  const name = formData.get('name') as string;

  // 1. DB 업데이트
  await supabase.from('users').update({ name }).eq('id', userId);

  // 2. 캐시를 즉시 만료하고 새 데이터로 갱신
  updateTag(`user-${userId}`);

  // ✅ 사용자가 폼 제출 직후 변경된 내용을 즉시 확인 가능
}

export async function updatePost(id: number, formData: FormData) {
  await supabase
    .from('posts')
    .update({
      title: formData.get('title'),
      content: formData.get('content'),
    })
    .eq('id', id);

  // 특정 포스트 즉시 갱신
  updateTag(`post-${id}`);
  // 목록도 즉시 갱신
  updateTag('posts');
}
```

**특징:**

- **Read-Your-Writes**: 변경 직후 사용자가 즉시 확인 가능
- **Server Actions 전용**: Route Handlers에서는 사용 불가
- **즉시 갱신**: Stale 캐시 제공 없이 바로 새 데이터 페칭

### 캐싱 API 전체 비교

| 구분                | `cacheTag()`       | `revalidateTag()`                   | `updateTag()`                 | `refresh()`                      |
| ------------------- | ------------------ | ----------------------------------- | ----------------------------- | -------------------------------- |
| **역할**            | 캐시에 태그 부여   | 태그된 캐시 무효화                  | 태그된 캐시 즉시 갱신         | 캐시되지 않은 데이터만 갱신      |
| **사용 위치**       | `'use cache'` 함수 | Server Actions, Route Handlers      | **Server Actions만**          | **Server Actions만**             |
| **동작 방식**       | 태깅               | Stale-While-Revalidate              | 즉시 만료 + 즉시 갱신         | 캐시 무시하고 동적 데이터만 갱신 |
| **캐시 영향**       | 없음 (태그만 부여) | 캐시 무효화 (백그라운드 갱신)       | 캐시 만료 (즉시 갱신)         | **캐시 건드리지 않음**           |
| **사용자 경험**     | -                  | 변경사항이 점진적으로 반영됨        | **변경사항을 즉시 확인 가능** | 동적 데이터만 즉시 반영          |
| **인자**            | 태그 이름(들)      | **필수**: 태그, cacheLife 프로필    | 태그 이름(들)                 | 없음                             |
| **사용 사례**       | 모든 캐시 함수     | 정적 콘텐츠, eventual consistency   | 폼 제출, 사용자 설정 변경     | 알림 수, 조회수, 실시간 지표     |
| **Next.js 16 변경** | `unstable_` 제거   | 두 번째 인자 필수로 변경 (Breaking) | 신규 추가                     | 신규 추가                        |

### 언제 무엇을 사용할까?

#### ✅ `updateTag()` 사용 (즉시 반영 필요)

- **폼 제출**: 사용자 프로필 수정, 게시글 작성/수정
- **사용자 설정**: 테마, 알림 설정 변경
- **실시간 피드백**: 좋아요, 북마크 등
- **중요한 변경**: 결제 정보, 주문 상태 등

```typescript
'use server';
import { updateTag } from 'next/cache';

export async function likePost(postId: number) {
  await supabase.from('likes').insert({ post_id: postId });
  updateTag(`post-${postId}`); // 즉시 좋아요 수 반영
}
```

#### ✅ `revalidateTag()` 사용 (점진적 반영 허용)

- **백그라운드 갱신**: 뉴스 피드, 블로그 목록
- **정적 콘텐츠**: 카테고리, 태그 목록
- **대규모 데이터**: 캐시 갱신 비용이 큰 경우
- **Eventual Consistency 허용**: 약간의 지연이 문제없는 경우

```typescript
'use server';
import { revalidateTag } from 'next/cache';

export async function publishPost(postId: number) {
  await supabase.from('posts').update({ published: true }).eq('id', postId);
  revalidateTag('posts', 'max'); // 백그라운드에서 갱신
}
```

#### ✅ `refresh()` 사용 (캐시되지 않은 동적 데이터) 🆕

- **실시간 카운터**: 알림 수, 읽지 않은 메시지 수
- **라이브 지표**: 조회수, 좋아요 수, 온라인 사용자 수
- **상태 표시**: 진행률, 배송 상태
- **동적 콘텐츠**: 캐시하지 않는 데이터만 갱신

**`refresh()` vs `router.refresh()` 비교:**

| 구분          | `refresh()` (서버)                  | `router.refresh()` (클라이언트) |
| ------------- | ----------------------------------- | ------------------------------- |
| **호출 위치** | Server Action                       | Client Component                |
| **동작**      | 캐시 없는 서버 컴포넌트만 재렌더링  | 모든 서버 컴포넌트 재렌더링     |
| **캐시 영향** | 캐시는 유지 (건드리지 않음)         | 캐시 무시하고 전부 갱신         |
| **성능**      | 낮은 비용 (필요한 부분만)           | 높은 비용 (전체 새로고침)       |
| **사용 예**   | 알림 수, 조회수 등 동적 부분만 갱신 | 전체 페이지 강제 갱신           |

```typescript
'use server';
import { refresh } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  // DB 업데이트
  await supabase.from('notifications').update({ read: true }).eq('id', notificationId);

  // refresh() 호출
  refresh();

  // 동작:
  // 1. Next.js가 현재 페이지의 서버 컴포넌트 스캔
  // 2. 'use cache' 없는 컴포넌트 찾기 (예: Header의 알림 배지)
  // 3. 해당 컴포넌트만 다시 렌더링 → 알림 수 다시 페칭
  // 4. 캐시된 컴포넌트는 그대로 유지 (성능 최적화)
}

export async function incrementViewCount(postId: number) {
  // 조회수 증가
  await supabase.rpc('increment_view_count', { post_id: postId });

  // 캐시된 포스트 내용은 그대로, 조회수 컴포넌트만 갱신
  refresh();
}
```

**동작 원리:**

```typescript
// app/posts/[id]/page.tsx
export default async function PostPage({ params }) {
  return (
    <div>
      <PostContent id={params.id} />    {/* 'use cache' 있음 → refresh() 영향 없음 */}
      <ViewCount id={params.id} />      {/* 'use cache' 없음 → refresh()로 갱신됨 */}
      <CommentList id={params.id} />    {/* 'use cache' 있음 → refresh() 영향 없음 */}
    </div>
  );
}

// ViewCount.tsx - 캐시 안됨 (매번 최신 조회수 페칭)
async function ViewCount({ id }) {
  // 'use cache' 없음!
  const { view_count } = await supabase
    .from('posts')
    .select('view_count')
    .eq('id', id)
    .single();

  return <span>조회수: {view_count}</span>;
}
```

**특징:**

- **캐시 건드리지 않음**: `'use cache'` 있는 컴포넌트는 그대로 유지
- **선택적 갱신**: Next.js가 자동으로 캐시 없는 컴포넌트만 찾아서 재렌더링
- **Server Actions 전용**: Route Handlers에서는 사용 불가
- **성능 최적화**: `router.refresh()`보다 훨씬 가볍고 효율적
- **스마트한 새로고침**: 필요한 동적 부분만 갱신

### 고급 패턴: 계층적 태그 구조

```typescript
// 읽기 함수
export async function getAllPosts() {
  'use cache';
  cacheTag('posts'); // 전체 포스트
  // ...
}

export async function getPostsByCategory(category: string) {
  'use cache';
  cacheTag('posts', `posts-${category}`); // 카테고리별
  // ...
}

export async function getPostById(id: number, category: string) {
  'use cache';
  cacheTag('posts', `posts-${category}`, `post-${id}`); // 계층적 태그
  // ...
}

// 쓰기 함수 - 케이스 1: 사용자가 수정한 내용을 즉시 확인해야 하는 경우
export async function updatePostImmediate(id: number, category: string, data: FormData) {
  await supabase.from('posts').update(data).eq('id', id);

  // 즉시 갱신 (사용자가 수정 직후 변경사항 확인)
  updateTag(`post-${id}`); // 해당 포스트 즉시 갱신
  updateTag(`posts-${category}`); // 해당 카테고리 목록도 즉시 갱신
  updateTag('posts'); // 전체 목록도 즉시 갱신
}

// 쓰기 함수 - 케이스 2: 백그라운드 갱신으로 충분한 경우
export async function updatePostBackground(id: number, category: string, data: FormData) {
  await supabase.from('posts').update(data).eq('id', id);

  // 백그라운드 갱신 (관리자 작업 등, 즉시 반영 불필요)
  revalidateTag(`post-${id}`, 'max'); // 해당 포스트 백그라운드 갱신
  revalidateTag(`posts-${category}`, 'max'); // 해당 카테고리만 백그라운드 갱신
  revalidateTag('posts', 'max'); // 모든 포스트 백그라운드 갱신
}
```

---

## 캐시 무효화 전략

### 1. 보수적 전략 (더 많이 즉시 갱신)

```typescript
export async function createPost(data: FormData) {
  await supabase.from('posts').insert(data);

  // 포스트 관련 모든 캐시 즉시 갱신 (사용자가 작성한 포스트 즉시 확인)
  updateTag('posts');
  updateTag('popular-posts');
  updateTag('recent-posts');
}
```

- 장점: 사용자가 변경사항 즉시 확인, 최신 데이터 보장
- 단점: 캐시 갱신 비용이 높음 (여러 캐시 동시 갱신)

### 2. 세밀한 전략 (최소한만 갱신)

```typescript
export async function updatePost(id: number, data: FormData) {
  await supabase.from('posts').update(data).eq('id', id);

  // 해당 포스트만 즉시 갱신
  updateTag(`post-${id}`);
}
```

- 장점: 캐시 효율 높음, 갱신 비용 낮음
- 단점: 관련 목록이 갱신 안됨 (목록에서는 여전히 이전 내용 표시)

### 3. 균형잡힌 전략 (권장)

```typescript
export async function updatePost(id: number, data: FormData) {
  await supabase.from('posts').update(data).eq('id', id);

  updateTag(`post-${id}`); // 상세 페이지 즉시 갱신
  revalidateTag('posts', 'max'); // 목록은 백그라운드 갱신
}
```

- 장점: 사용자는 상세 페이지에서 변경사항 즉시 확인, 목록은 자연스럽게 갱신
- 균형: 즉시 갱신 (`updateTag`) + 백그라운드 갱신 (`revalidateTag`) 혼합

---

## DevNest 프로젝트 캐싱 전략

### 현재 설정

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  cacheLife: {
    default: {
      stale: 60, // 60초간 fresh
      revalidate: 300, // 5분마다 백그라운드 재검증
      expire: 900, // 15분 후 완전 만료
    },
  },
};
```

### 원칙

1. **`revalidate` 페이지 설정은 사용하지 않음**: Cache Components와 호환 불가
2. **`use cache` 단일 전략**: 모든 컴포넌트/함수 단위 캐싱은 `'use cache'`로 통일
3. **`cacheLife` 프로필**: 필요시 `default` 외에 추가 프로필 정의 가능
4. **캐시 무효화**: Server Actions에서 적절한 API 사용 (`updateTag`, `revalidateTag`, `refresh`)

### 캐시 무효화 API 사용 계획

프로젝트에서 데이터 변경 시 다음 API들을 사용할 예정:

- **`updateTag(tag)`**: 즉시 반영이 필요한 변경 (폼 제출, 사용자 설정)
- **`revalidateTag(tag, profile)`**: 백그라운드 갱신 허용 (목록, 정적 콘텐츠)
- **`revalidatePath(path)`**: 특정 경로의 캐시 무효화
- **`refresh()`**: 캐시되지 않은 동적 데이터만 갱신 (알림 수, 실시간 지표) - **Server Actions 전용**

## 주의사항

⚠️ **태그는 일관성 있게**: 같은 데이터에 대해 항상 같은 태그 사용
⚠️ **과도한 태그 지양**: 한 함수에 너무 많은 태그 붙이지 말 것 (3개 이하 권장)
⚠️ **무효화 타이밍**: Server Action 완료 직후 적절한 API 호출

- `updateTag()`: 캐시된 데이터 즉시 갱신
- `revalidateTag()`: 캐시된 데이터 백그라운드 갱신
- `refresh()`: 캐시되지 않은 동적 데이터만 갱신

⚠️ **Next.js 16 Breaking Change & 신규 API**:

- `revalidateTag(tag, profile)` 두 번째 인자 **필수** (Breaking)
- `updateTag(tag)` 신규 API (Server Actions 전용)
- `refresh()` 신규 API (Server Actions 전용, 캐시 영향 없음)

---

## use cache 장점

✅ **간결한 코드**: `cache()` + `unstable_cache()` 이중 래핑 불필요
✅ **자동 키 관리**: Next.js가 함수명 + 파라미터로 자동 생성
✅ **타입 안전성**: 래핑 함수 없어서 타입 추론 더 정확
✅ **선언적**: 캐싱 의도가 명확하게 표현됨

---

## use cache 주의사항

⚠️ **안정화**: Next.js 16에서 정식 기능으로 안정화됨
⚠️ **개발 모드**: 개발 중에는 캐시가 약하게 작동 (프로덕션에서 확인 필요)
⚠️ **직렬화**: 반환 값은 JSON 직렬화 가능해야 함

---

## use cache vs 기존 방식 비교

| 구분               | 기존 방식 (삼중 캐싱)               | use cache (Next.js 16+)                      |
| ------------------ | ----------------------------------- | -------------------------------------------- |
| **코드 복잡도**    | 높음 (cache + unstable_cache + ISR) | 낮음 (use cache 한 줄)                       |
| **캐시 키 관리**   | 수동 (`['posts', sort, limit]`)     | 자동 (함수명 + 파라미터)                     |
| **타입 안전성**    | 래핑으로 인한 타입 추론 약화        | 직접 호출로 타입 추론 강화                   |
| **Function-level** | `unstable_cache()` 명시 필요        | `cacheLife()` 자동 처리                      |
| **Page-level**     | `export const revalidate` 설정      | ~~사용 불가~~ (Cache Components와 호환 불가) |
| **캐시 무효화**    | `revalidateTag()` (동일)            | `revalidateTag()` (동일)                     |

### 코드 비교

**기존 방식 (복잡):**

```typescript
'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { CACHE_TIME } from '@/lib/constants';

async function getPostsInternal(params) {
  const { data } = await supabase.from('posts').select('*');
  return data;
}

export const getPosts = cache(async (params) => {
  const cached = unstable_cache(
    async () => getPostsInternal(params),
    ['posts', params?.sort, String(params?.limit)],
    {
      revalidate: CACHE_TIME,
      tags: ['posts'],
    },
  );
  return await cached();
});
```

**use cache (간결):**

```typescript
'use server';

import { cacheTag } from 'next/cache';

export async function getPosts(params) {
  'use cache';
  cacheTag('posts');

  const { data } = await supabase.from('posts').select('*');
  return data;
}
```

**결과**: 코드 44% 감소 (188줄 → 105줄)

---

## 참고 자료

- [Next.js Caching 공식 문서](https://nextjs.org/docs/app/building-your-application/caching)
- [Next.js use cache RFC](https://github.com/vercel/next.js/discussions/54075)
