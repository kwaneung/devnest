# 캐싱 가이드 (Next.js 15+)

## 개요

Next.js 15의 `use cache` 지시문을 사용한 최신 캐싱 전략 가이드입니다.

---

## ⚡ use cache - 최신 캐싱 방식

**권장**: Next.js 15부터는 `use cache` 지시문을 사용하여 간단하게 캐싱을 구현할 수 있습니다.

### 기본 사용법

```typescript
// src/entities/post/api/postsActions.ts
'use server';

import { unstable_cacheTag as cacheTag } from 'next/cache';

export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  'use cache';
  cacheTag('posts');

  // DB 호출
  const { data } = await supabase.from('posts').select('*');
  return data;
}
```

### next.config.ts 설정

```typescript
const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    cacheLife: {
      // 기본 캐시 프로필
      default: {
        stale: 60, // 1분: 클라이언트가 서버 체크 없이 캐시 사용
        revalidate: 300, // 5분: 서버 측 캐시 갱신 주기
        expire: 900, // 15분: 완전 만료 후 동적 페칭
      },
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
  experimental: {
    useCache: true,
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
  },
};
```

### 2. 코드에서 사용

```typescript
'use server';

import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

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

### cacheTag의 역할

`cacheTag`는 캐시된 데이터에 **태그(라벨)**를 붙여서 나중에 특정 태그의 모든 캐시를 한번에 무효화할 수 있게 해줍니다.

**왜 필요한가?**

- 데이터 변경(생성/수정/삭제) 후 관련 캐시를 즉시 갱신하기 위해
- 캐시 시간이 남아있어도 강제로 새로고침하기 위해

### 기본 사용법

```typescript
'use server';

import { unstable_cacheTag as cacheTag } from 'next/cache';

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

```typescript
// 2. 데이터 변경 후 캐시 무효화
import { revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  await supabase.from('posts').insert({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  // 'posts' 태그가 붙은 모든 캐시 무효화
  revalidateTag('posts');
}

export async function updatePost(id: number, formData: FormData) {
  await supabase
    .from('posts')
    .update({
      title: formData.get('title'),
      content: formData.get('content'),
    })
    .eq('id', id);

  // 특정 포스트만 무효화
  revalidateTag(`post-${id}`);
  // 또는 모든 포스트 목록도 갱신
  revalidateTag('posts');
}

export async function deletePost(id: number) {
  await supabase.from('posts').delete().eq('id', id);

  // 여러 태그 동시 무효화
  revalidateTag('posts');
  revalidateTag(`post-${id}`);
}
```

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

// 쓰기 함수
export async function updatePost(id: number, category: string, data: FormData) {
  await supabase.from('posts').update(data).eq('id', id);

  // 선택적 무효화
  revalidateTag(`post-${id}`); // 해당 포스트만
  // revalidateTag(`posts-${category}`); // 해당 카테고리만
  // revalidateTag('posts');             // 모든 포스트
}
```

---

## 캐시 무효화 전략

### 1. 보수적 전략 (더 많이 무효화)

```typescript
export async function createPost(data: FormData) {
  await supabase.from('posts').insert(data);

  // 포스트 관련 모든 캐시 무효화
  revalidateTag('posts');
  revalidateTag('popular-posts');
  revalidateTag('recent-posts');
}
```

- 장점: 항상 최신 데이터 보장
- 단점: 캐시 효율 낮음

### 2. 세밀한 전략 (최소한만 무효화)

```typescript
export async function updatePost(id: number, data: FormData) {
  await supabase.from('posts').update(data).eq('id', id);

  // 해당 포스트만 무효화
  revalidateTag(`post-${id}`);
}
```

- 장점: 캐시 효율 높음
- 단점: 관련 목록이 갱신 안될 수 있음

### 3. 균형잡힌 전략 (권장)

```typescript
export async function updatePost(id: number, data: FormData) {
  await supabase.from('posts').update(data).eq('id', id);

  revalidateTag(`post-${id}`); // 상세 페이지 갱신
  revalidateTag('posts'); // 목록도 갱신 (중요 변경사항이면)
}
```

---

## 주의사항

⚠️ **태그는 일관성 있게**: 같은 데이터에 대해 항상 같은 태그 사용
⚠️ **과도한 태그 지양**: 한 함수에 너무 많은 태그 붙이지 말 것 (3개 이하 권장)
⚠️ **무효화 타이밍**: Server Action 완료 직후 `revalidateTag()` 호출

---

## use cache 장점

✅ **간결한 코드**: `cache()` + `unstable_cache()` 이중 래핑 불필요
✅ **자동 키 관리**: Next.js가 함수명 + 파라미터로 자동 생성
✅ **타입 안전성**: 래핑 함수 없어서 타입 추론 더 정확
✅ **선언적**: 캐싱 의도가 명확하게 표현됨

---

## use cache 주의사항

⚠️ **실험적 기능**: Next.js 15에서 실험적으로 도입
⚠️ **개발 모드**: 개발 중에는 캐시가 약하게 작동 (프로덕션에서 확인 필요)
⚠️ **직렬화**: 반환 값은 JSON 직렬화 가능해야 함

---

## use cache vs 기존 방식 비교

| 구분               | 기존 방식 (삼중 캐싱)               | use cache (Next.js 15+)    |
| ------------------ | ----------------------------------- | -------------------------- |
| **코드 복잡도**    | 높음 (cache + unstable_cache + ISR) | 낮음 (use cache 한 줄)     |
| **캐시 키 관리**   | 수동 (`['posts', sort, limit]`)     | 자동 (함수명 + 파라미터)   |
| **타입 안전성**    | 래핑으로 인한 타입 추론 약화        | 직접 호출로 타입 추론 강화 |
| **Function-level** | `unstable_cache()` 명시 필요        | `cacheLife()` 자동 처리    |
| **Page-level**     | `export const revalidate` 설정      | `cacheLife` expire로 통합  |
| **캐시 무효화**    | `revalidateTag()` (동일)            | `revalidateTag()` (동일)   |

### 코드 비교

**기존 방식 (복잡):**

```typescript
'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { CACHE_TIME } from '@/shared/config';

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

import { unstable_cacheTag as cacheTag } from 'next/cache';

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
