# FSD 아키텍처 가이드

## Feature-Sliced Design v2.1 구조

```
src/
├── app/                 # Next.js App Router (라우팅만)
├── pages/              # Pages Layer (페이지 조합)
├── widgets/            # Widgets Layer
├── features/           # Features Layer
├── entities/           # Entities Layer
└── shared/             # Shared Layer
```

> **중요**: Next.js App Router 사용 시 `src/pages/`는 Pages Router로 인식되지 않으므로, FSD 표준 `pages` 레이어 이름을 그대로 사용 가능합니다.

## 레이어 설명

### app/ (Next.js App Router)

- **역할**: Next.js 라우팅만 담당
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` 파일 관리
- 비즈니스 로직 없이 pages 레이어의 컴포넌트만 import

### pages/ (Pages Layer)

- **역할**: 페이지 컴포넌트 (라우트별 페이지 구성)
- 여러 widgets와 features를 조합
- FSD 표준 레이어

### widgets/ (Widgets Layer)

- 독립적인 UI 블록
- 예: Header, Sidebar, Footer, Card 컴포넌트

### features/ (Features Layer)

- 비즈니스 기능
- 예: 로그인, 검색, 댓글, 좋아요

### entities/ (Entities Layer)

- 비즈니스 엔티티
- 예: User, Product, Post, Comment

### shared/ (Shared Layer)

- 공통 유틸리티
- UI 컴포넌트, API 클라이언트, 유틸리티 함수

## FSD 규칙

1. **레이어 계층**: `app → pages → widgets → features → entities → shared`
2. 상위 레이어는 하위 레이어만 import 가능
3. 같은 레이어 내에서는 import 금지 (슬라이스 간 의존성 금지)
4. shared 레이어는 다른 레이어를 import 불가
5. `pnpm steiger`로 아키텍처 검증

## 실제 구조 예시

```
src/
├── app/
│   ├── page.tsx                    # import from @/pages/home
│   └── posts/
│       └── page.tsx                # import from @/pages/posts
│
├── pages/
│   ├── home/
│   │   └── ui/HomePage.tsx         # import from @/widgets
│   └── posts/
│       └── ui/PostsPage.tsx        # import from @/widgets
│
├── widgets/
│   └── post-list/
│       └── ui/
│           ├── PostListTable.tsx   # import from @/entities/post
│           └── PopularPosts.tsx
│
├── entities/
│   └── post/
│       ├── api/postsApi.ts         # import from @/shared/api
│       ├── model/types.ts
│       └── ui/PostCard.tsx
│
└── shared/
    └── api/apiClient.ts
```
