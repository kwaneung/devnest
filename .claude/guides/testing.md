# 테스트 가이드

DevNest 프로젝트의 테스트 환경 및 작성 가이드입니다.

## 테스트 스택

- **단위/통합 테스트**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **E2E 테스트**: [Playwright](https://playwright.dev/)

## 테스트 전략 및 피라미드

```
        ▲
       /E2E\          10% - 느림 (초~분), 핵심 사용자 플로우
      /─────\              Playwright - 브라우저 전체 시나리오
     /통합테스트\       20% - 중간 (ms~초), 모듈 간 상호작용
    /────────\              Vitest - Server Actions + DB 모킹
   /  단위테스트  \    70% - 빠름 (ms), 개별 함수/로직/컴포넌트
  /──────────────\        Vitest - 유틸, Zod, Client Components
```

### 각 테스트의 특징

| 테스트 종류 | 속도         | 범위             | CI/CD 실행   | 예시                        |
| ----------- | ------------ | ---------------- | ------------ | --------------------------- |
| **단위**    | ⚡ 매우 빠름 | 함수/모듈        | ✅ 모든 커밋 | `getCurrentKST()`           |
| **통합**    | ⚡ 빠름      | 모듈 간 상호작용 | ✅ 모든 커밋 | `getPosts()` 전체 플로우    |
| **E2E**     | 🐢 느림      | 전체 앱          | ⚠️ 선택적    | 사용자 로그인 → 포스트 작성 |

## 테스트 명령어

### 단위/통합 테스트 (Vitest)

```bash
# 테스트 실행 (watch 모드)
pnpm test

# 테스트 단일 실행
pnpm test:run

# 단위 테스트만 실행
pnpm test:unit

# 통합 테스트만 실행
pnpm test:integration

# UI 모드로 테스트 실행
pnpm test:ui

# 커버리지 측정
pnpm test:coverage
```

### E2E 테스트 (Playwright)

```bash
# E2E 테스트 실행 (headless, 모든 브라우저)
pnpm test:e2e

# CI용 E2E 테스트 (Chromium만, 빠름)
pnpm test:e2e:ci

# UI 모드로 E2E 테스트 실행
pnpm test:e2e:ui

# 디버그 모드로 E2E 테스트 실행
pnpm test:e2e:debug
```

### 통합 명령어

```bash
# 모든 테스트 실행 (단위 + 통합 + E2E)
pnpm test:all

# Vercel과 동일한 빌드 (단위/통합 테스트 + 빌드)
pnpm build:vercel
```

## 테스트 파일 네이밍 규칙

| 테스트 타입  | 파일명 패턴             | 실행 도구  | 위치     | 예시                        |
| ------------ | ----------------------- | ---------- | -------- | --------------------------- |
| **단위**     | `*.test.ts`             | Vitest     | `src/**` | `date.test.ts`              |
| **통합**     | `*.integration.test.ts` | Vitest     | `src/**` | `posts.integration.test.ts` |
| **E2E**      | `*.spec.ts`             | Playwright | `e2e/`   | `home.spec.ts`              |
| **컴포넌트** | `*.test.tsx`            | Vitest     | `src/**` | `PostCard.test.tsx`         |

## 프로젝트 구조

```
devnest/
├── src/
│   ├── lib/
│   │   ├── date.ts
│   │   └── date.test.ts                      # 단위 테스트 (유틸)
│   ├── types/
│   │   ├── post.ts
│   │   └── post.test.ts                      # 단위 테스트 (타입)
│   ├── services/
│   │   ├── posts.ts
│   │   └── posts.integration.test.ts         # 통합 테스트
│   ├── components/
│   │   ├── PostCard.tsx
│   │   ├── PostCard.test.tsx                 # 단위 테스트 (컴포넌트)
│   │   └── ui/
│   │       ├── BackButton.tsx
│   │       └── BackButton.test.tsx           # 단위 테스트 (컴포넌트)
│   └── app/
│       └── _components/
│           ├── Header.tsx
│           └── Header.test.tsx               # 단위 테스트 (컴포넌트)
├── e2e/
│   ├── home.spec.ts                          # E2E 테스트
│   └── posts.spec.ts                         # E2E 테스트
├── vitest.config.mts                         # Vitest 설정
├── vitest.setup.ts                           # Vitest 전역 설정
└── playwright.config.ts                      # Playwright 설정
```

## 테스트 작성 시점 및 방법론

### TDD vs TAD: 언제 무엇을 사용할까?

DevNest 프로젝트에서는 다음과 같은 혼합 접근법을 사용합니다:

```
TDD (Test-Driven Development) - 테스트 먼저 작성 ✍️
├─ 단위 테스트 (70%)
│  └─ 순수 함수, 유틸리티, 비즈니스 로직
│     예: formatDate(), validateEmail(), Zod 스키마
└─ 핵심 통합 테스트 (주요 플로우)
   └─ 중요한 DB/API 연동의 Happy Path
      예: getPosts() 기본 동작, createPost() 성공 케이스

TAD (Test-After Development) - 개발 후 테스트 작성 🔧
├─ 나머지 통합 테스트 (엣지 케이스)
│  └─ 에러 처리, 경계값, 예외 상황
│     예: 네트워크 실패, 빈 결과, 잘못된 입력
└─ E2E 테스트 (10%)
   └─ 주요 사용자 시나리오 (기능 완성 후)
      예: 로그인 → 포스트 작성 → 게시
```

### 실무 워크플로우

#### 1. TDD로 시작 (빠르고 확실한 것)

```typescript
// ✅ STEP 1: 단위 테스트 먼저 작성 (Red)
describe('formatDate', () => {
  it('ISO 문자열을 한국어로 변환해야 한다', () => {
    expect(formatDate('2025-01-15')).toBe('2025년 1월 15일');
  });
});

// ✅ STEP 2: 최소 코드로 테스트 통과 (Green)
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// ✅ STEP 3: 리팩토링
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
```

#### 2. 핵심 통합 테스트 (TDD 가능하면 우선)

```typescript
// ✅ 핵심 플로우는 먼저 작성
describe('getPosts 핵심 플로우', () => {
  it('Supabase에서 포스트 목록을 가져와야 한다', async () => {
    const posts = await getPosts();
    expect(posts).toHaveLength(expect.any(Number));
    expect(posts[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
    });
  });
});

// 구현...

// ⚠️ 개발 중 발견한 엣지 케이스는 나중에 추가 (TAD)
describe('getPosts 엣지 케이스', () => {
  it('네트워크 에러 시 재시도해야 한다', async () => {
    // 개발하면서 발견한 문제 추가
  });

  it('빈 결과도 정상 처리해야 한다', async () => {
    mockLimit.mockResolvedValue({ data: [], error: null });
    const posts = await getPosts();
    expect(posts).toEqual([]);
  });
});
```

#### 3. UI 컴포넌트 (TAD - 빠른 프로토타이핑)

```typescript
// 1. 컴포넌트 먼저 개발
export function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  // ...
}

// 2. 주요 동작 테스트 추가
describe('LikeButton', () => {
  it('클릭 시 좋아요 수가 증가해야 한다', async () => {
    render(<LikeButton postId={1} initialLikes={10} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('11')).toBeInTheDocument();
  });
});
```

#### 4. E2E (TAD - 기능 완성 후)

```typescript
// 전체 기능 완성 후 사용자 시나리오 검증
test('사용자는 포스트에 좋아요를 누를 수 있다', async ({ page }) => {
  await page.goto('/posts/1');
  await page.getByRole('button', { name: /좋아요/ }).click();
  await expect(page.getByText('11개')).toBeVisible();
});
```

### 테스트 작성 시간 배분

```
전체 개발 시간 기준:

TDD (60-70% 시간)
├─ 단위 테스트: 빠른 피드백 (밀리초)
└─ 핵심 통합: 주요 플로우 검증 (초 단위)

TAD (30-40% 시간)
├─ 엣지 케이스: 개발 중 발견
└─ E2E: 기능 완성 후 (분 단위)
```

### 실무 예시: "포스트 좋아요 기능" 개발

```typescript
// 🔴 Day 1 - TDD로 시작
// services/likes.test.ts
describe('likePost', () => {
  it('포스트 좋아요 수를 1 증가시켜야 한다', async () => {
    const result = await likePost(1);
    expect(result.likes).toBe(11); // ❌ 실패
  });
});

// 🟢 구현
export async function likePost(postId: number) {
  // 최소 코드
}

// 🔵 리팩토링
export async function likePost(postId: number) {
  // 개선된 코드
}

// ⚠️ Day 2 - 개발 중 발견한 엣지 케이스 추가 (TAD)
it('이미 좋아요한 포스트는 에러를 반환해야 한다', async () => {
  await likePost(1);
  await expect(likePost(1)).rejects.toThrow('Already liked');
});

// 🎨 Day 3 - UI 컴포넌트 개발 및 테스트 (TAD)
// components/LikeButton.tsx 개발 후
// components/LikeButton.test.tsx 작성

// 🚀 Day 4 - E2E 테스트 (TAD)
// e2e/likes.spec.ts
test('사용자는 포스트에 좋아요를 누를 수 있다', async ({ page }) => {
  // 전체 시나리오 검증
});
```

### 핵심 원칙

| 대상                | 접근법 | 이유                               |
| ------------------- | ------ | ---------------------------------- |
| 순수 함수/유틸리티  | TDD    | 요구사항 명확, 빠른 피드백         |
| 비즈니스 로직       | TDD    | 버그 비용 높음, 테스트 가능한 설계 |
| DB/API 핵심 플로우  | TDD    | 중요한 동작 먼저 검증              |
| DB/API 엣지 케이스  | TAD    | 개발 중 발견, 복잡도 높음          |
| UI 컴포넌트         | TAD    | 빠른 프로토타이핑, UI 변경 빈번    |
| E2E 사용자 시나리오 | TAD    | 전체 기능 완성 후, 느림 (분 단위)  |

### Google 70/20/10 법칙

```
        ▲
       /E2E\      10% - TAD (기능 완성 후)
      /─────\
     /통합테스트\  20% - TDD (핵심) + TAD (엣지)
    /────────\
   /  단위테스트  \ 70% - TDD (무조건 먼저)
  /──────────────\
```

## 작성 가이드

### 단위 테스트 (Vitest)

**대상**: 순수 함수, 유틸리티, 비즈니스 로직, 타입 검증

**예시**: [src/lib/date.test.ts](src/lib/date.test.ts)

```typescript
import { describe, expect, it, vi } from 'vitest';
import { getCurrentKST } from './date';

describe('getCurrentKST', () => {
  it('KST 형식의 시간 문자열을 반환해야 한다', () => {
    const mockDate = new Date('2025-10-31T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const result = getCurrentKST();

    expect(result).toBe('2025-10-31 09:00:00');

    vi.useRealTimers();
  });
});
```

**팁**:

- `describe`: 테스트 그룹
- `it` 또는 `test`: 개별 테스트 케이스
- `expect`: 검증 (assertion)
- `vi`: Vitest 유틸리티 (모킹, 타이머 등)

### 통합 테스트 (Vitest)

**대상**: Server Actions, 여러 모듈이 함께 동작하는 플로우

**예시**: [src/services/posts.integration.test.ts](src/services/posts.integration.test.ts)

```typescript
import { describe, expect, it, vi, beforeEach } from 'vitest';

// Supabase 클라이언트 모킹
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
    })),
  },
}));

describe('getPosts - 통합 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit });
  });

  it('Supabase에서 데이터를 가져와 Zod 검증 후 camelCase로 변환해야 한다', async () => {
    const mockData = [
      {
        id: 1,
        title: 'Test',
        view_count: 100, // snake_case (DB)
        created_at: '2025-10-31T00:00:00Z',
      },
    ];

    mockLimit.mockResolvedValue({ data: mockData, error: null });

    const { getPosts } = await import('./posts');
    const result = await getPosts();

    expect(result[0].viewCount).toBe(100); // camelCase (앱)
  });
});
```

**팁**:

- `vi.mock()`: 외부 의존성 모킹 (Supabase, API 등)
- `beforeEach()`: 각 테스트 전 초기화
- **실제 DB 호출 없이** 전체 플로우 검증
- Zod 검증, 타입 변환 등 **실제 코드 실행**

### 컴포넌트 테스트 (Vitest + Testing Library)

**대상**: Client Components, UI 컴포넌트

**예시**: [src/components/PostCard.test.tsx](src/components/PostCard.test.tsx)

```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostCard } from './PostCard';

describe('PostCard', () => {
  const mockPost = {
    id: 1,
    title: '테스트 제목',
    excerpt: '발췌문',
    author: '작성자',
    publishedAt: '2025-10-31T00:00:00.000Z',
    tags: ['React', 'TypeScript'],
    viewCount: 1234,
  };

  it('포스트 정보가 렌더링되어야 한다', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    expect(screen.getByText('작성자')).toBeInTheDocument();
  });

  it('조회수가 천 단위 구분자와 함께 표시되어야 한다', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('1,234')).toBeInTheDocument();
  });
});
```

**Next.js 훅 모킹 예시**: [src/components/ui/BackButton.test.tsx](src/components/ui/BackButton.test.tsx)

```typescript
import { fireEvent } from '@testing-library/react';

// next/navigation 모킹
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockBack }),
}));

it('버튼 클릭 시 router.back()이 호출되어야 한다', () => {
  render(<BackButton />);
  fireEvent.click(screen.getByRole('button'));
  expect(mockBack).toHaveBeenCalledTimes(1);
});
```

**팁**:

- `render`: 컴포넌트 렌더링
- `screen`: DOM 쿼리 (getByText, getByRole 등)
- `fireEvent`: 사용자 이벤트 시뮬레이션
- `vi.mock()`: Next.js 훅 모킹 (useRouter, usePathname 등)
- `@testing-library/jest-dom`: 추가 매처 (toBeInTheDocument 등)

### E2E 테스트 (Playwright)

**대상**: 페이지 전체 플로우, 사용자 시나리오

**예시**: [e2e/home.spec.ts](e2e/home.spec.ts)

```typescript
import { expect, test } from '@playwright/test';

test.describe('홈페이지', () => {
  test('페이지가 로드되고 기본 요소가 표시되어야 한다', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/DevNest/);

    const header = page.locator('header');
    await expect(header).toBeVisible();
  });
});
```

**팁**:

- `page.goto()`: 페이지 이동
- `page.locator()`: 요소 선택
- `page.getByRole()`, `page.getByText()`: 접근성 기반 선택
- `expect(page).toHaveTitle()`: 페이지 타이틀 검증
- `expect(element).toBeVisible()`: 요소 가시성 검증

## 테스트 작성 우선순위

### 1. High Priority (핵심 비즈니스 로직)

- [x] `src/lib/date.ts` - KST 시간 변환 (4 tests)
- [x] `src/types/post.ts` - Zod 검증 및 타입 변환 (23 tests)
- [x] `src/services/posts.ts` - 포스트 조회 로직 (9 integration tests)
- [ ] `src/lib/supabase/env.ts` - 환경 변수 검증

### 2. Medium Priority (UI 로직)

- [x] `src/app/_components/Header.tsx` - 테마 관리 (8 tests)
- [x] `src/components/PostCard.tsx` - 포스트 카드 렌더링 (9 tests)
- [x] `src/components/ui/BackButton.tsx` - 뒤로가기 버튼 (3 tests)
- [ ] `src/hooks/nav-provider.tsx` - 네비게이션 상태

### 3. E2E Tests

- [x] `e2e/home.spec.ts` - 홈페이지 기본 동작
- [x] `e2e/posts.spec.ts` - 포스트 목록 및 상세 페이지
- [ ] `e2e/navigation.spec.ts` - 페이지 간 이동
- [ ] `e2e/theme.spec.ts` - 테마 전환 시나리오

## 현재 커버리지

```bash
# 커버리지 측정
pnpm test:coverage
```

**통계** (2025-10-31 기준):

- 단위 테스트 (유틸): 27 tests passing
  - date.test.ts: 4 tests
  - post.test.ts: 23 tests
- 단위 테스트 (컴포넌트): 20 tests passing
  - BackButton.test.tsx: 3 tests
  - PostCard.test.tsx: 9 tests
  - Header.test.tsx: 8 tests
- 통합 테스트: 9 tests passing
  - posts.integration.test.ts: 9 tests
- **합계**: 56 tests passing
- 테스트 파일: 6 files
- 실행 시간: ~1.29s

## CI/CD 테스트 전략

### 업계 표준 (2024 기준)

**테스트 실행 시점:**

| 테스트 종류  | 실행 시점                      | 이유               | 시간   |
| ------------ | ------------------------------ | ------------------ | ------ |
| 단위 + 통합  | ✅ **모든 커밋/PR**            | 빠르고 신뢰성 높음 | ~1초   |
| E2E (핵심만) | ⚠️ **PR/배포 전**              | 중요 플로우만 검증 | ~5분   |
| E2E (전체)   | ⏰ **주기적** (nightly/weekly) | 모든 시나리오 검증 | ~30분+ |

**권장 사항:**

- 70% 단위 테스트 (빠름)
- 20% 통합 테스트 (중간)
- 10% E2E 테스트 (느림, 핵심만)

## Vercel 배포 시 테스트

### 현재 전략: 단위/통합만 실행 (빠른 배포 우선)

프로젝트에 [vercel.json](../../vercel.json) 설정이 추가되어 있어, Vercel 배포 시 자동으로 **단위/통합 테스트만** 실행됩니다.

**빌드 프로세스:**

```bash
pnpm build:vercel
# = pnpm test:run && next build
# E2E 테스트는 제외 (빠른 배포)
```

**동작 방식:**

1. ✅ 단위/통합 테스트 실행 (`pnpm test:run`) - ~1초
2. ✅ 테스트 통과 시 → Next.js 빌드 진행
3. ❌ 테스트 실패 시 → 빌드 중단, 배포 취소

**E2E 테스트는 왜 제외?**

- E2E는 느림 (~5-10분) → Vercel 빌드 시간 증가
- Vercel은 빌드 시간당 과금 → 비용 증가
- E2E 실패 시 전체 배포 차단 → 배포 속도 저하
- E2E는 주기적으로 별도 실행 권장

### 대안: E2E도 CI/CD에 포함하려면?

필요시 로컬에서 전체 테스트를 실행할 수 있습니다:

```bash
# 로컬에서 모든 테스트 실행 (단위 + 통합 + E2E)
pnpm test:all
# = pnpm test:run && pnpm test:e2e:ci

# Vercel에서 E2E도 실행하려면 vercel.json 수정:
# "buildCommand": "pnpm test:all && next build"
```

**트레이드오프:**

- ✅ 장점: 배포 전 E2E 검증
- ❌ 단점: 빌드 시간 5-10분 증가, 비용 증가

### Vercel 대시보드에서 확인

배포 로그에서 다음과 같이 테스트 결과를 확인할 수 있습니다:

```
Running "pnpm build:vercel"
> pnpm test:run && next build

RUN  v4.0.5
✓ src/lib/date.test.ts (4 tests) 2ms
✓ src/types/post.test.ts (23 tests) 6ms
✓ src/services/posts.integration.test.ts (9 tests) 89ms
✓ src/components/ui/BackButton.test.tsx (3 tests) 73ms
✓ src/components/PostCard.test.tsx (9 tests) 107ms
✓ src/app/_components/Header.test.tsx (8 tests) 174ms

Test Files  6 passed (6)
     Tests  56 passed (56)

Building...
```

### 로컬에서 Vercel 빌드 테스트

```bash
# Vercel과 동일한 빌드 프로세스 실행
pnpm build:vercel

# 성공 시 출력:
# ✓ 56 tests passed (47 unit + 9 integration)
# ✓ Compiled successfully
```

## 참고 자료

- [Vitest 공식 문서](https://vitest.dev/)
- [Testing Library 공식 문서](https://testing-library.com/)
- [Playwright 공식 문서](https://playwright.dev/)
- [Next.js Testing 가이드](https://nextjs.org/docs/app/building-your-application/testing)
- [Vercel Build Configuration](https://vercel.com/docs/projects/project-configuration)
