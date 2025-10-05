# FSD 아키텍처 가이드

## Feature-Sliced Design v2.1 구조

```
src/
├── app/                 # Next.js App Router (Pages Layer)
├── pages/              # Pages Layer (FSD)
├── widgets/            # Widgets Layer (FSD)
├── features/           # Features Layer (FSD)
├── entities/           # Entities Layer (FSD)
├── shared/             # Shared Layer (FSD)
└── public/             # Static assets
```

## 레이어 설명

### app/ (Next.js App Router)
- Next.js 라우팅 및 페이지 레이아웃
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` 파일 관리

### pages/ (Pages Layer)
- 페이지 컴포넌트 (라우트별 페이지 구성)
- 여러 widgets와 features를 조합

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

1. 상위 레이어는 하위 레이어만 import 가능
2. 같은 레이어 내에서는 import 금지
3. shared 레이어는 다른 레이어를 import 불가
4. `pnpm steiger`로 아키텍처 검증
