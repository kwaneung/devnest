# shadcn/ui 마이그레이션 계획

## 목표

기존 daisyUI 화면을 유지하면서 shadcn/ui로 동일한 화면을 구축하여 비교 테스트 후, 최종 결정하여 마이그레이션 완료

## 전략

**별도 라우팅 경로를 활용한 병렬 구축 전략**

- `daisyui/` 폴더: 기존 화면 유지 (URL: `/daisyui`)
- `shadcn/` 폴더: 새로운 shadcn/ui 화면 구축 (URL: `/shadcn`)
- 루트 페이지 `/`에서 두 버전 선택 가능
- 최종 결정 후 선택한 폴더만 남기고 루트로 이동

## Phase 1: 환경 설정

### 1.1 shadcn/ui 초기 설정

**한 줄 명령어로 모든 초기 설정 완료:**

```bash
pnpm dlx shadcn@latest init
```

이 명령어가 자동으로 처리하는 것들:

- 필요한 의존성 설치 (clsx, tailwind-merge, class-variance-authority 등)
- `components.json` 생성
- `lib/utils.ts` 생성 (cn 헬퍼 함수)
- Tailwind CSS 설정 업데이트
- globals.css에 CSS 변수 추가

**설치 시 선택 옵션:**

- Style: `New York` (추천) 또는 `Default`
- Base color: `Neutral` (추천)
- CSS variables: `Yes`
- React Server Components: `Yes`
- 나머지는 기본값 사용

### 1.2 기본 shadcn/ui 컴포넌트 설치

```bash
pnpm dlx shadcn@latest add button card input badge avatar separator sheet navigation-menu
```

---

## Phase 2: 라우팅 그룹 구조 설계

### 2.1 최종 폴더 구조

```
src/app/
├── page.tsx                # 선택 페이지 (루트 /)
├── layout.tsx              # 루트 layout (최소한)
├── providers.tsx           # 공통
├── globals.css            # 공통 스타일 (daisyUI + shadcn 모두 포함)
│
├── daisyui/               # 기존 화면 (URL: /daisyui)
│   ├── layout.tsx          # daisyUI 전용 layout
│   ├── page.tsx            # 기존 홈페이지
│   ├── about/
│   │   └── page.tsx
│   ├── posts/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── _components/        # daisyUI 전용 컴포넌트
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Footer.tsx
│       └── ...
│
└── shadcn/                # 신규 화면 (URL: /shadcn)
    ├── layout.tsx          # shadcn 전용 layout
    ├── page.tsx            # shadcn 홈페이지
    ├── about/
    │   └── page.tsx
    ├── posts/
    │   ├── page.tsx
    │   └── [id]/
    │       └── page.tsx
    └── _components/        # shadcn 전용 컴포넌트
        ├── Header.tsx
        ├── Sidebar.tsx
        ├── Footer.tsx
        └── ...
```

### 2.2 라우팅 경로

**기존 (daisyUI):**

- `/daisyui` → 홈
- `/daisyui/posts` → 포스트 목록
- `/daisyui/posts/[id]` → 포스트 상세
- `/daisyui/about` → 소개

**신규 (shadcn/ui):**

- `/shadcn` → 홈
- `/shadcn/posts` → 포스트 목록
- `/shadcn/posts/[id]` → 포스트 상세
- `/shadcn/about` → 소개

### 2.3 루트 페이지 처리

루트 경로(`/`)는 사용자가 선택할 수 있도록 리다이렉트 또는 선택 페이지 제공:

**옵션 1: 선택 페이지 (추천)**

```typescript
// src/app/page.tsx
export default function RootPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-4">
      <Link href="/daisyui" className="...">
        daisyUI 버전 보기
      </Link>
      <Link href="/shadcn" className="...">
        shadcn/ui 버전 보기
      </Link>
    </div>
  );
}
```

**옵션 2: 자동 리다이렉트**

```typescript
// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/shadcn'); // 또는 '/daisyui'
}
```

---

## Phase 3: 기존 페이지를 daisyui 폴더로 이동

### 3.1 이동할 파일 목록

1. **Layout 및 Provider:**
   - `app/layout.tsx` → 루트 layout으로 간소화 (선택 페이지용)
   - 기존 layout 복사 → `app/daisyui/layout.tsx`
   - `app/providers.tsx` → 그대로 유지 (공통)

2. **페이지:**
   - `app/page.tsx` → 선택 페이지로 변경
   - 기존 홈페이지 복원 → `app/daisyui/page.tsx`
   - `app/about/` → `app/daisyui/about/`
   - `app/posts/` → `app/daisyui/posts/`

3. **컴포넌트:**
   - `app/_components/` → `app/daisyui/_components/`

4. **서비스 레이어:**
   - `src/services/` → 그대로 유지 (공통, 재사용)
   - `src/types/` → 그대로 유지 (공통, 재사용)
   - `src/hooks/` → 그대로 유지 (공통, 재사용)

### 3.2 import 경로 수정

이동 후 모든 파일에서 import 경로 확인 및 수정:

- `app/daisyui/layout.tsx`에서 `../globals.css`, `../providers` 사용
- 절대 경로(`@/...`)를 사용 중이므로 대부분 수정 불필요

---

## Phase 4: shadcn 폴더에 새 layout 생성

### 4.1 shadcn 전용 layout 생성

**파일: `app/shadcn/layout.tsx`**

```typescript
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';

import '../globals.css'; // 공통 스타일
import { Providers } from '../providers';
import { NavProvider } from '@/hooks';
import { Header, Sidebar, Footer } from './_components';

export const metadata: Metadata = {
  title: {
    default: 'DevNest (shadcn) | 프론트엔드 개발 블로그',
    template: 'DevNest (shadcn) | %s',
  },
  description: '프론트엔드 개발과 아키텍처에 대한 인사이트를 공유하는 개발 블로그입니다. (shadcn/ui)',
  // ... 나머지 메타데이터
};

export default function ShadcnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased min-h-dvh">
        <NextTopLoader {...config} />
        <Providers>
          <NavProvider>
            <div className="flex min-h-dvh">
              {/* shadcn/ui Sheet를 활용한 사이드바 */}
              <Sidebar />
              <div className="flex flex-col flex-1">
                <Header />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </NavProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
```

### 4.2 테마 시스템 구성

**next-themes 설치 (옵션):**

```bash
pnpm add next-themes
```

**ThemeProvider 생성:**

```typescript
// src/providers/theme-provider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

---

## Phase 5: shadcn으로 메인 페이지 구현

### 5.1 구현 순서

1. **공통 컴포넌트 (shadcn 버전)**
   - Header.tsx (navbar + 테마 토글 + 검색)
   - Sidebar.tsx (Sheet 활용)
   - Footer.tsx
   - PostCard.tsx (Card + Badge)
   - BackButton.tsx (Button)

2. **페이지 구현**
   - `app/(shadcn)/page.tsx` - 홈페이지
   - `app/(shadcn)/posts/page.tsx` - 포스트 목록
   - `app/(shadcn)/posts/[id]/page.tsx` - 포스트 상세
   - `app/(shadcn)/about/page.tsx` - 소개

### 5.2 컴포넌트 매핑

| daisyUI 컴포넌트 | shadcn/ui 대체             |
| ---------------- | -------------------------- |
| `btn`            | `<Button>`                 |
| `card`           | `<Card>`                   |
| `badge`          | `<Badge>`                  |
| `input`          | `<Input>`                  |
| `navbar`         | 커스텀 navbar + `<Button>` |
| `menu`           | `<NavigationMenu>`         |
| `drawer`         | `<Sheet>`                  |
| `stats`          | 커스텀 Card 조합           |
| `avatar`         | `<Avatar>`                 |
| `divider`        | `<Separator>`              |

### 5.3 예시: PostCard 컴포넌트

**daisyUI 버전:**

```typescript
// src/app/daisyui/_components/PostCard.tsx
<article className="card bg-base-100 shadow-lg ...">
  <div className="card-body">
    <h2 className="card-title">{post.title}</h2>
    <span className="badge badge-primary">{tag}</span>
  </div>
</article>
```

**shadcn/ui 버전:**

```typescript
// src/app/shadcn/_components/PostCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

<Card className="hover:shadow-2xl transition-shadow">
  <CardHeader>
    <CardTitle>{post.title}</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge variant="default">{tag}</Badge>
  </CardContent>
</Card>
```

---

## Phase 6: 테스트 및 비교

### 6.1 테스트 체크리스트

**기능 테스트:**

- [ ] 홈페이지 렌더링
- [ ] 포스트 목록 페이지
- [ ] 포스트 상세 페이지
- [ ] 소개 페이지
- [ ] 네비게이션 (Header, Sidebar)
- [ ] 테마 전환 (light/dark)
- [ ] 모바일 메뉴 (Sheet)
- [ ] 검색 기능

**반응형 테스트:**

- [ ] 모바일 (< 640px)
- [ ] 태블릿 (640px ~ 1024px)
- [ ] 데스크톱 (> 1024px)

**접근성 테스트:**

- [ ] 키보드 네비게이션
- [ ] 스크린 리더 호환성
- [ ] ARIA 속성 확인

**성능 테스트:**

- [ ] Lighthouse 점수 비교
- [ ] 번들 크기 비교
- [ ] 렌더링 성능 비교

### 6.2 비교 기준

| 항목          | daisyUI    | shadcn/ui  | 비고                        |
| ------------- | ---------- | ---------- | --------------------------- |
| 개발 속도     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     | daisyUI가 빠름              |
| 커스터마이징  | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | shadcn/ui가 유연함          |
| 번들 크기     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | daisyUI가 작음 (CSS only)   |
| 접근성        | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | shadcn/ui가 우수 (Radix UI) |
| 컴포넌트 품질 | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | shadcn/ui가 세밀함          |
| 학습 곡선     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     | daisyUI가 쉬움              |

---

## Phase 7: 최종 결정 및 정리

### 7.1 shadcn/ui 선택 시

1. **daisyui 폴더 전체 삭제**

   ```bash
   rm -rf src/app/daisyui
   ```

2. **daisyUI 의존성 제거**

   ```bash
   pnpm remove daisyui
   ```

3. **globals.css에서 daisyUI 플러그인 제거**

   ```css
   /* 삭제 */
   @plugin "daisyui";
   @plugin "daisyui/theme" { ... }
   ```

4. **shadcn 폴더를 루트로 이동**
   - `app/shadcn/*` → `app/*`
   - 라우팅 경로 정규화 (`/shadcn/...` → `/...`)
   - `app/page.tsx` 선택 페이지 삭제

5. **daisyUI 가이드 삭제**

   ```bash
   rm .claude/guides/daisyui-guide.md
   ```

6. **CLAUDE.md 업데이트**
   - daisyUI 5 → shadcn/ui로 변경

### 7.2 daisyUI 유지 시

1. **shadcn 폴더 전체 삭제**

   ```bash
   rm -rf src/app/shadcn
   ```

2. **shadcn/ui 관련 의존성 제거**

   ```bash
   pnpm remove class-variance-authority clsx tailwind-merge lucide-react
   pnpm remove @radix-ui/react-*
   ```

3. **설치된 shadcn 컴포넌트 삭제**

   ```bash
   rm -rf src/components/ui
   rm src/lib/utils.ts
   rm components.json
   rm .mcp.json
   ```

4. **globals.css에서 shadcn CSS 변수 제거**

   ```css
   /* 삭제 */
   @custom-variant dark (&:is(.dark *));
   @layer base { ... }
   :root { ... }
   .dark { ... }
   ```

5. **daisyui 폴더를 루트로 이동**
   - `app/daisyui/*` → `app/*`
   - 라우팅 경로 정규화 (`/daisyui/...` → `/...`)
   - `app/page.tsx` 선택 페이지 삭제

---

## 타임라인

| Phase                          | 예상 시간      | 담당          |
| ------------------------------ | -------------- | ------------- |
| Phase 1: 환경 설정             | 30분           | Claude        |
| Phase 2: 라우팅 그룹 구조 설계 | 15분           | Claude        |
| Phase 3: 기존 페이지 이동      | 20분           | Claude        |
| Phase 4: shadcn layout 생성    | 30분           | Claude        |
| Phase 5: 페이지 구현           | 2-3시간        | Claude        |
| Phase 6: 테스트 및 비교        | 1시간          | User + Claude |
| Phase 7: 최종 정리             | 30분           | Claude        |
| **총 예상 시간**               | **약 5-6시간** |               |

---

## 참고 자료

- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Tailwind CSS 4 문서](https://tailwindcss.com)

---

## 체크리스트

### Phase 1: 환경 설정

- [x] `pnpm dlx shadcn@latest init` 실행 및 초기 설정 완료
- [x] `pnpm dlx shadcn@latest mcp init --client claude` MCP 서버 설정 완료
- [ ] shadcn 기본 컴포넌트 설치 (button, card, input, badge, avatar, separator, sheet, navigation-menu)

### Phase 2-3: 라우팅 구조 및 파일 이동

- [x] 루트 페이지를 선택 페이지로 변경
- [x] 루트 layout 간소화
- [x] daisyui 폴더 생성
- [x] 기존 layout을 daisyui/layout.tsx로 복사
- [x] 기존 \_components를 daisyui/\_components로 이동
- [x] 기존 about, posts를 daisyui/ 폴더로 이동
- [x] 기존 홈페이지를 daisyui/page.tsx로 복원
- [x] import 경로 수정 완료
- [x] 코드 품질 검증 통과

### Phase 4: shadcn layout

- [ ] shadcn/layout.tsx 생성
- [ ] 테마 시스템 구성 (선택)

### Phase 5: 페이지 구현

- [ ] Header 컴포넌트
- [ ] Sidebar 컴포넌트
- [ ] Footer 컴포넌트
- [ ] PostCard 컴포넌트
- [ ] BackButton 컴포넌트
- [ ] 홈페이지
- [ ] 포스트 목록 페이지
- [ ] 포스트 상세 페이지
- [ ] 소개 페이지

### Phase 6: 테스트

- [ ] 기능 테스트
- [ ] 반응형 테스트
- [ ] 접근성 테스트
- [ ] 성능 비교

### Phase 7: 최종 결정

- [ ] 선택한 버전만 남기기
- [ ] 불필요한 의존성 제거
- [ ] 문서 업데이트
