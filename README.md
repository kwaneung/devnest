# DevNest

Next.js 16(App Router) 기반 **개발 블로그·스니펫 허브**입니다. Supabase(Postgres)에서 글·스니펫을 읽고, shadcn/ui 사이드바 대시보드로 목록·상세를 제공합니다. **blog-it** 이후 스택을 올리며 Server Actions, Cache Components, 빌드 타임 SSG를 실험한 제품형 레포입니다.

## Links

| | |
|---|---|
| **Live** | https://devnest-orcin.vercel.app |
| **Repository** | https://github.com/kwaneung/devnest |

## Highlights

- **Posts** — Markdown 본문, 태그·조회수 메타, `/posts/[id]` **generateStaticParams** SSG
- **Snippets** — 언어·태그 필터, TanStack Table + dnd-kit 정렬 UI
- **Data layer** — Supabase JS v2, Zod 런타임 검증, Server Actions (`'use server'`)
- **Caching** — Next.js 16 **Cache Components** (`'use cache'`, `cacheTag`), `cacheLife` 프로필
- **UI** — shadcn/ui, Radix, sidebar 레이아웃, `react-markdown` + GFM, 다크 모드
- **Quality** — Vitest(단위·통합), Playwright E2E, `build:vercel` = test 후 build, Husky

## Stack

- **Framework** — Next.js 16, React 19, TypeScript, React Compiler
- **UI** — Tailwind CSS v4, shadcn/ui, Radix, Lucide / Tabler icons
- **Data** — Supabase (`posts`, `snippets`), `server-only` 클라이언트 분리
- **Tables** — TanStack React Table, `@dnd-kit/*`
- **Deploy** — Vercel (`pnpm build:vercel`), Analytics

## Features

| 영역 | 경로 | 설명 |
|------|------|------|
| Home | `/` | 인기 글 카드(상위 3) |
| Posts | `/posts`, `/posts/[id]` | 목록 테이블 · Markdown 상세 · OG 메타 |
| Snippets | `/snippets`, `/snippets/[id]` | 코드 스니펫 목록·상세 |
| About | `/about` | 소개·통계(Supabase 집계) |

## Project structure

```
src/
├── app/                 # App Router (posts, snippets, about)
├── components/          # UI, sidebar, data-table, PostCard
├── services/            # Server Actions → Supabase (posts, snippets)
├── lib/supabase/        # client, env, generated types
├── types/               # Post, Snippet + Zod schemas
├── hooks/               # nav context, mobile
└── ...
e2e/                     # Playwright
```

## Local development

### Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/)
- Supabase 프로젝트 (로컬/원격)

### Setup

```bash
git clone https://github.com/kwaneung/devnest.git
cd devnest
pnpm install
```

`.env.local` 예시 (이름은 `src/lib/supabase/env.ts` 기준):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# 타입 생성 시 (선택)
SUPABASE_ACCESS_TOKEN=sbp_...
```

```bash
pnpm dev          # http://localhost:3000
pnpm test:run     # Vitest
pnpm test:e2e     # Playwright
pnpm build        # next build (Supabase 연결 필요)
```

타입 재생성:

```bash
pnpm supabase:gen-types
```

## Deployment & data (중요)

- **Vercel** — `main` 브랜치 push 시 배포 (`vercel.json` → `pnpm build:vercel`).
- **`/posts/[id]`** — 빌드 시 `generateStaticParams()`로 id별 HTML을 **미리 생성**합니다. 마지막 성공 빌드 이후 Supabase가 **paused**여도, 이미 생성된 URL은 CDN **PRERENDER** 스냅샷으로 열릴 수 있습니다.
- **재배포·신규 id·런타임-only 경로** — DB가 pause면 `getPosts()` / `getPostById()` 실패 → 빌드 실패 또는 500 가능.
- **blog-it** — 인증·CRUD 중심의 이전 블로그; DevNest는 읽기 중심 대시보드 + Next 16 캐시/SSG 실험용 후속 프로젝트입니다.

## Status

| | |
|---|---|
| **Role** | 포트폴리오용 Public 제품 레포 (Pin 후보) |
| **Supabase** | Free tier — 프로젝트 **paused** 시 Live는 마지막 빌드 스냅샷에 의존 |
| **Maintenance** | 기능 추가는 낮은 빈도; 스택·캐시 패턴 참고용으로 유지 |

## License

MIT (또는 레포에 명시된 라이선스에 따름)
