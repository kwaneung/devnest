'use server';

import type { Post, GetPostsParams } from '../model';
import { POST_TAGS } from '../model';

// 모킹 데이터 (실제로는 DB나 외부 API에서 가져옴)
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Next.js 15와 React 19로 시작하는 모던 웹 개발',
    excerpt: 'Next.js 15의 새로운 기능과 React 19의 주요 변경사항을 알아봅니다.',
    content: `## 소개

Next.js 15와 React 19가 출시되면서 웹 개발의 새로운 장이 열렸습니다. 이 글에서는 두 프레임워크의 주요 변경사항과 실무에서 어떻게 활용할 수 있는지 살펴보겠습니다.

### Next.js 15의 주요 기능

**1. Turbopack 안정화**

빌드 속도가 기존 Webpack 대비 최대 700% 향상되었습니다. 🚀

\`\`\`typescript
// next.config.ts
export default {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
        },
      },
    },
  },
};
\`\`\`

**2. Server Components 기본 활성화**

모든 컴포넌트가 기본적으로 Server Component로 동작합니다.

\`\`\`typescript
// app/page.tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data.title}</div>;
}
\`\`\`

### React 19의 혁신

- **Server Actions**: 서버 로직을 클라이언트에서 직접 호출
- **use() Hook**: Promise와 Context를 더 쉽게 다룰 수 있음
- **Document Metadata**: 컴포넌트 내에서 직접 메타데이터 관리

## 마치며

Next.js 15와 React 19는 개발 생산성과 성능을 모두 향상시켜줍니다. 새 프로젝트를 시작한다면 꼭 고려해보세요!`,
    author: 'DevNest',
    publishedAt: '2025-10-01T09:00:00Z',
    tags: [POST_TAGS.NEXTJS, POST_TAGS.REACT, POST_TAGS.WEB_DEVELOPMENT],
    viewCount: 1250,
  },
  {
    id: 2,
    title: 'Tanstack Query로 서버 상태 관리 마스터하기',
    excerpt: 'Tanstack Query를 활용한 효율적인 서버 상태 관리 전략을 소개합니다.',
    content: `## Tanstack Query란?

서버 상태 관리는 현대 웹 애플리케이션에서 필수적입니다. Tanstack Query(구 React Query)는 이를 간단하고 강력하게 해결해줍니다.

### 핵심 개념

**1. useSuspenseQuery**

Suspense와 함께 사용하여 로딩 상태를 자연스럽게 처리합니다.

\`\`\`typescript
import { useSuspenseQuery } from '@tanstack/react-query';

function Posts() {
  const { data } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return (
    <div>
      {data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\`

**2. 자동 캐싱 및 동기화**

- 백그라운드에서 자동으로 데이터를 최신 상태로 유지
- 중복 요청 자동 제거
- 옵티미스틱 업데이트 지원

### 실전 팁

\`\`\`typescript
// 전역 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      gcTime: 5 * 60 * 1000, // 5분
    },
  },
});
\`\`\`

## 결론

Tanstack Query를 사용하면 서버 상태 관리가 정말 쉬워집니다. Redux나 MobX 없이도 충분히 강력한 상태 관리를 구현할 수 있습니다.`,
    author: 'DevNest',
    publishedAt: '2025-10-03T14:30:00Z',
    tags: [POST_TAGS.TANSTACK_QUERY, POST_TAGS.STATE_MANAGEMENT, POST_TAGS.REACT],
    viewCount: 890,
  },
  {
    id: 3,
    title: 'TypeScript 5.9의 새로운 기능 살펴보기',
    excerpt: 'TypeScript 5.9에서 추가된 새로운 기능과 개선사항을 정리했습니다.',
    content: `## TypeScript 5.9 업데이트

TypeScript 5.9는 개발자 경험을 크게 향상시키는 여러 기능을 제공합니다.

### 주요 변경사항

**1. Inferred Type Predicates**

타입 가드 함수를 자동으로 추론합니다.

\`\`\`typescript
// 이제 반환 타입을 명시하지 않아도 됩니다
function isString(value: unknown) {
  return typeof value === 'string';
}

const value: unknown = 'hello';
if (isString(value)) {
  // value는 자동으로 string 타입으로 추론됨
  console.log(value.toUpperCase());
}
\`\`\`

**2. 성능 개선**

- 빌드 속도 15-20% 향상
- 메모리 사용량 감소
- IDE 반응 속도 개선

**3. 에러 메시지 개선**

더 직관적이고 도움이 되는 에러 메시지를 제공합니다.

### 마이그레이션 가이드

\`\`\`bash
# package.json 업데이트
pnpm add -D typescript@5.9
\`\`\`

대부분의 경우 호환성 문제 없이 업그레이드가 가능합니다.

## 정리

TypeScript 5.9는 점진적이지만 의미 있는 개선을 제공합니다. 특히 타입 추론 개선은 실무에서 큰 도움이 될 것입니다.`,
    author: 'DevNest',
    publishedAt: '2025-10-05T10:15:00Z',
    tags: [POST_TAGS.TYPESCRIPT, POST_TAGS.JAVASCRIPT, POST_TAGS.PROGRAMMING],
    viewCount: 670,
  },
  {
    id: 4,
    title: 'Tailwind CSS 4로 구현하는 반응형 디자인',
    excerpt: 'Tailwind CSS 4의 새로운 기능을 활용한 반응형 웹 디자인 패턴을 알아봅니다.',
    content: `## Tailwind CSS 4 소개

Tailwind CSS 4는 더욱 강력한 반응형 디자인 도구를 제공합니다. 이 글에서는 실무에서 바로 사용할 수 있는 패턴들을 소개합니다.

### 새로운 기능

**1. Native Cascade Layers**

\`@layer\` 지시어가 네이티브 CSS로 변환됩니다.

\`\`\`css
@layer base {
  h1 {
    @apply text-4xl font-bold;
  }
}
\`\`\`

**2. Container Queries 지원**

\`\`\`tsx
<div className="@container">
  <div className="@lg:grid @lg:grid-cols-2">
    <Card />
    <Card />
  </div>
</div>
\`\`\`

### 반응형 패턴

**모바일 퍼스트 접근**

\`\`\`tsx
<div className="
  p-4
  md:p-6
  lg:p-8
  xl:p-10
">
  {/* 모바일부터 시작해서 점진적으로 확장 */}
</div>
\`\`\`

**그리드 레이아웃**

\`\`\`tsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
">
  {items.map(item => <Card key={item.id} />)}
</div>
\`\`\`

## 마무리

Tailwind CSS 4는 반응형 웹 개발을 더욱 쉽고 직관적으로 만들어줍니다. 컨테이너 쿼리 지원은 특히 게임 체인저입니다! 🎨`,
    author: 'DevNest',
    publishedAt: '2025-10-06T16:45:00Z',
    tags: [POST_TAGS.TAILWIND_CSS, POST_TAGS.CSS, POST_TAGS.RESPONSIVE_DESIGN],
    viewCount: 540,
  },
  {
    id: 5,
    title: 'FSD 아키텍처로 확장 가능한 프론트엔드 구축하기',
    excerpt: 'Feature-Sliced Design 아키텍처의 핵심 개념과 실전 적용 방법을 설명합니다.',
    content: `## Feature-Sliced Design이란?

FSD는 프론트엔드 프로젝트의 구조를 체계적으로 관리할 수 있게 해줍니다.

### 핵심 원칙

**1. 레이어 구조**

\`\`\`
src/
├── app/        # 앱 초기화, 라우팅
├── pages/      # 페이지 컴포넌트
├── widgets/    # 독립적인 UI 블록
├── features/   # 사용자 시나리오
├── entities/   # 비즈니스 엔티티
└── shared/     # 공유 코드
\`\`\`

**2. Public API**

각 슬라이스는 \`index.ts\`를 통해 공개 API를 제공합니다.

\`\`\`typescript
// src/entities/post/index.ts
export { PostCard } from './ui/PostCard';
export { getPosts } from './api/postsActions';
export type { Post } from './model/types';
\`\`\`

### 실전 예제

**엔티티 구조**

\`\`\`
src/entities/post/
├── api/           # Server Actions
├── model/         # 타입, 상수
├── ui/            # UI 컴포넌트
└── index.ts       # Public API
\`\`\`

**의존성 규칙**

상위 레이어는 하위 레이어만 import 가능합니다:

\`\`\`typescript
// ✅ 가능
import { Post } from '@/entities/post';

// ❌ 불가능
import { SomePage } from '@/pages/home';
\`\`\`

### 장점

- **확장성**: 새로운 기능 추가가 쉬움
- **유지보수성**: 명확한 구조로 코드 이해도 향상
- **팀 협업**: 역할 분담이 명확함

## 결론

FSD는 처음엔 복잡해 보이지만, 프로젝트가 커질수록 그 진가를 발휘합니다. 중대형 프로젝트라면 꼭 고려해보세요!`,
    author: 'DevNest',
    publishedAt: '2025-10-07T11:20:00Z',
    tags: [POST_TAGS.ARCHITECTURE, POST_TAGS.FSD, POST_TAGS.FRONTEND],
    viewCount: 320,
  },
];

/**
 * 포스트 목록을 가져오는 Server Action
 * @param params - 정렬 및 제한 파라미터
 * @returns 포스트 배열
 */
export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  // 실제로는 외부 API나 DB에서 데이터를 가져옴
  // await fetch('https://api.example.com/posts', { next: { revalidate: 3600 } })

  const sort = params?.sort || 'latest';
  const limit = params?.limit;

  // 정렬
  let sortedPosts = [...mockPosts];
  if (sort === 'popular') {
    sortedPosts.sort((a, b) => b.viewCount - a.viewCount);
  } else {
    // 최신순 (기본)
    sortedPosts.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  // limit 적용
  if (limit) {
    sortedPosts = sortedPosts.slice(0, limit);
  }

  return sortedPosts;
}

/**
 * 특정 포스트 상세 정보를 가져오는 Server Action
 * @param id - 포스트 ID
 * @returns 포스트 상세 정보 또는 null
 */
export async function getPostById(id: number): Promise<Post | null> {
  // 실제로는 외부 API나 DB에서 데이터를 가져옴
  // await fetch(`https://api.example.com/posts/${id}`, { next: { revalidate: 3600 } })

  const post = mockPosts.find((post) => post.id === id);

  return post || null;
}
