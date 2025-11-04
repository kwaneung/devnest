# DevNest 사이드바 기획서

## 개요

DevNest 블로그의 사이드바 구조 및 네비게이션 설계 문서

## 사이드바 구성 요소

### 1. Header (브랜드)

- **로고**: IconInnerShadowTop 아이콘
- **브랜드명**: DevNest
- **링크**: 홈페이지(/)로 이동

### 2. Main Navigation (NavMain)

주요 네비게이션 메뉴 - 단일 레벨 구조

| 메뉴명   | URL       | 아이콘 (lucide) | 설명                                            |
| -------- | --------- | --------------- | ----------------------------------------------- |
| Home     | /         | Home            | 메인 페이지, 최근 포스트 및 주요 콘텐츠 표시    |
| Posts    | /posts    | FileText        | 전체 포스트 목록 (필터링, 검색, 정렬 기능 포함) |
| Snippets | /snippets | Code2           | 재사용 가능한 코드 조각 모음                    |

**특징:**

- 현재 페이지 활성화 상태 표시 (현재 URL과 매칭되는 메뉴 하이라이트)
- 툴팁으로 메뉴명 표시
- 아이콘과 텍스트 함께 표시 (collapsed 시 아이콘만)

### 3. Projects Section (NavProjects)

접을 수 있는(Collapsible) 프로젝트 섹션

```
Projects (Folder)
├── Project A
│   ├── Overview
│   ├── Features
│   └── Demo
├── Project B
│   ├── Overview
│   ├── Tech Stack
│   └── Demo
└── Project C
    ├── Overview
    ├── Architecture
    └── Demo
```

**특징:**

- Collapsible 구조 (ChevronRight 아이콘으로 상태 표시)
- 프로젝트별 하위 메뉴 구성
- 기본적으로 접혀있음 (사용자 선택 시 펼쳐짐)
- 각 프로젝트는 독립적인 포트폴리오 페이지

### 4. Secondary Navigation (NavSecondary)

보조 유틸리티 메뉴

| 메뉴명   | URL       | 아이콘 (lucide) | 설명                 |
| -------- | --------- | --------------- | -------------------- |
| Search   | /search   | Search          | 전체 사이트 검색     |
| Archive  | /archive  | Archive         | 과거 포스트 아카이브 |
| Settings | /settings | Settings        | 사용자 설정          |
| Help     | /help     | HelpCircle      | 도움말 및 문서       |

**특징:**

- 하단 고정 (mt-auto 사용)
- 자주 사용하지 않는 유틸리티 기능 모음

### 5. Footer (User Section)

사용자 정보 및 계정 관리

```
User Avatar | User Name
            | user@email.com
            |
            | > Account
            | > Billing
            | > Notifications
            | > About (/about)
            | ---
            | > Sign out
```

**특징:**

- 드롭다운 메뉴로 계정 관련 옵션 제공
- About 페이지 링크 포함
- 로그아웃 옵션

## 포스트 페이지 필터 기능 (/posts)

Posts 페이지에서 제공할 필터 및 정렬 기능:

### 필터 옵션

1. **카테고리 필터**
   - React
   - TypeScript
   - Next.js
   - Architecture
   - DevOps
   - Testing

2. **태그 필터** (다중 선택 가능)
   - hooks
   - performance
   - shadcn/ui
   - tailwind
   - server-components
   - best-practices

3. **정렬 옵션**
   - 최신순
   - 오래된순
   - 인기순 (조회수)
   - 댓글 많은순

4. **검색**
   - 제목 검색
   - 내용 검색
   - 제목+내용 통합 검색

## 반응형 동작

### Desktop (lg 이상)

- 사이드바 항상 표시
- 모든 메뉴 텍스트와 아이콘 표시
- 너비: 256px

### Tablet (md)

- 사이드바 토글 가능
- Collapsed 모드: 아이콘만 표시
- Expanded 모드: 전체 메뉴 표시

### Mobile (sm 이하)

- 사이드바 기본 숨김
- 햄버거 메뉴로 토글
- Overlay 방식으로 표시

## 현재 페이지 표시 방식

1. **Active State**
   - 현재 페이지 메뉴 아이템 하이라이트
   - 배경색 변경 (primary/10)
   - 텍스트 색상 강조 (primary)

2. **Breadcrumb (선택사항)**
   - 헤더에 현재 위치 표시
   - 예: Home > Posts > React Hooks Guide

## 아이콘 라이브러리

- **Primary**: lucide-react
  - shadcn/ui 기본 아이콘
  - 일관된 스타일
  - 커뮤니티 지원 우수

- **Secondary**: @tabler/icons-react
  - 더 다양한 아이콘이 필요할 때 보조적으로 사용

## 구현 우선순위

1. **Phase 1** (필수)
   - [ ] NavMain 메뉴 구현
   - [ ] 현재 페이지 활성화 상태
   - [ ] 반응형 토글 기능

2. **Phase 2** (중요)
   - [ ] Projects 섹션 (Collapsible)
   - [ ] Posts 페이지 필터 기능
   - [ ] 검색 기능

3. **Phase 3** (선택)
   - [ ] User 드롭다운 메뉴
   - [ ] 다크모드 지원

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Icons**: lucide-react (primary), @tabler/icons-react (secondary)
- **Styling**: Tailwind CSS
- **State Management**: React useState/useContext (필요시)

## 참고사항

- 모든 링크는 Next.js Link 컴포넌트 사용 (SPA 네비게이션)
- 접근성 고려 (aria-label, sr-only 텍스트 등)
- 키보드 네비게이션 지원
- 애니메이션은 최소화 (성능 우선)
