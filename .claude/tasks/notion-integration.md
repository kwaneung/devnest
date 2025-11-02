# Notion + Supabase 하이브리드 블로그 구현 계획

## 🎯 목표

**Notion에서 편하게 글 작성 → Supabase에 자동 동기화 → Next.js에서 빠르게 읽기**

---

## 📐 최종 아키텍처

```
┌─────────────────────┐
│   Notion Database   │  ← 글 작성/수정 (Write-only CMS)
│   (CMS)             │     - Title, Content, Tags, Status
└──────────┬──────────┘
           │
           │ Notion API (6시간마다)
           ↓
┌─────────────────────┐
│  Vercel Cron Job    │  ← 자동 동기화
│  (Sync Service)     │     GET /api/cron/sync
└──────────┬──────────┘
           │
           │ INSERT/UPDATE
           ↓
┌─────────────────────┐
│   Supabase DB       │  ← 읽기 전용 복제본 (Read-only Cache)
│   (Cache)           │     - posts 테이블
│                     │     - 조회수, 좋아요 등 메타데이터
└──────────┬──────────┘
           │
           │ SQL Query (빠름! 10-100ms)
           ↓
┌─────────────────────┐
│   Next.js App       │  ← 사용자가 보는 프론트엔드
│   (Frontend)        │     getPosts(), getPostById()
└─────────────────────┘
```

---

## 🚀 구현 단계

### **Phase 1: Notion 설정 및 SDK 연동** (30분)

#### ✅ 1.1 Notion Integration 생성

```
1. https://www.notion.so/my-integrations 접속
2. "+ New Integration" 클릭
3. 이름: "DevNest Blog"
4. 권한: Read content
5. Integration Token 복사
```

#### ✅ 1.2 Notion Database 생성

**Database 구조:**

| 속성 이름 | 타입         | 설명                 |
| --------- | ------------ | -------------------- |
| Title     | Title        | 제목 (기본)          |
| Status    | Select       | Draft, Published     |
| Tags      | Multi-select | React, Next.js, etc. |
| Published | Date         | 발행일               |
| Excerpt   | Text         | 발췌문 (요약)        |
| Content   | Page         | 본문 (서브 페이지)   |

**설정 방법:**

```
1. Notion에서 새 페이지 생성: "Blog Posts"
2. Database - Full page 선택
3. 위 속성 추가
4. Share → DevNest Blog Integration 초대
5. Database ID 복사 (URL에서)
```

#### ✅ 1.3 패키지 설치 및 환경 변수

```bash
# Notion SDK 설치
pnpm add @notionhq/client

# .env.local 업데이트
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxx
```

---

### **Phase 2: Notion → Supabase 동기화 로직** (2-3시간)

#### 📁 파일 구조

```
src/
├── lib/
│   └── notion/
│       ├── client.ts           # Notion 클라이언트 초기화
│       └── converter.ts        # Notion 응답 → Post 타입 변환
│
├── services/
│   ├── posts.ts                # Supabase에서 읽기 (기존 유지)
│   └── sync-notion.ts          # 동기화 로직 (신규)
│
└── app/
    └── api/
        └── cron/
            └── sync/
                └── route.ts    # Vercel Cron 엔드포인트 (신규)
```

#### ✅ 2.1 Notion 클라이언트 설정

**파일:** `src/lib/notion/client.ts`

```typescript
import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;

if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
  throw new Error('Missing Notion environment variables');
}
```

#### ✅ 2.2 Notion → Post 타입 변환기

**파일:** `src/lib/notion/converter.ts`

```typescript
import type { Post } from '@/types/post';

export function convertNotionPageToPost(page: any): Post {
  return {
    id: page.id,
    title: page.properties.Title.title[0]?.plain_text || '',
    excerpt: page.properties.Excerpt.rich_text[0]?.plain_text || '',
    publishedAt: page.properties.Published.date?.start || new Date().toISOString(),
    tags: page.properties.Tags.multi_select.map((tag: any) => tag.name),
    viewCount: 0, // Notion에 없으므로 0
    author: 'Your Name', // 고정값 또는 환경 변수
  };
}

export async function getNotionPageContent(pageId: string): Promise<string> {
  const blocks = await notion.blocks.children.list({ block_id: pageId });
  return convertBlocksToMarkdown(blocks.results);
}

function convertBlocksToMarkdown(blocks: any[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'paragraph':
          return block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
        case 'heading_1':
          return `# ${block.heading_1.rich_text.map((t: any) => t.plain_text).join('')}`;
        case 'heading_2':
          return `## ${block.heading_2.rich_text.map((t: any) => t.plain_text).join('')}`;
        case 'heading_3':
          return `### ${block.heading_3.rich_text.map((t: any) => t.plain_text).join('')}`;
        case 'code':
          return `\`\`\`${block.code.language}\n${block.code.rich_text.map((t: any) => t.plain_text).join('')}\n\`\`\``;
        case 'bulleted_list_item':
          return `- ${block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('')}`;
        case 'numbered_list_item':
          return `1. ${block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join('')}`;
        default:
          return '';
      }
    })
    .join('\n\n');
}
```

#### ✅ 2.3 동기화 Server Action

**파일:** `src/services/sync-notion.ts`

```typescript
'use server';

import { revalidateTag } from 'next/cache';
import { notion, NOTION_DATABASE_ID } from '@/lib/notion/client';
import { convertNotionPageToPost, getNotionPageContent } from '@/lib/notion/converter';
import { supabase } from '@/lib/supabase';

export async function syncNotionToSupabase() {
  console.log('[Sync] 🔄 Notion → Supabase 동기화 시작');

  try {
    // 1. Notion에서 Published 포스트만 가져오기
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
    });

    console.log(`[Sync] 📄 ${response.results.length}개 포스트 발견`);

    // 2. 각 포스트를 Supabase에 Upsert
    for (const page of response.results) {
      const post = convertNotionPageToPost(page);
      const content = await getNotionPageContent(page.id);

      const { error } = await supabase.from('posts').upsert(
        {
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: content,
          published_at: post.publishedAt,
          tags: post.tags,
          author: post.author,
          // view_count는 유지 (COALESCE)
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false,
        },
      );

      if (error) {
        console.error(`[Sync] ❌ 포스트 동기화 실패 (${post.title}):`, error);
      } else {
        console.log(`[Sync] ✅ ${post.title}`);
      }
    }

    // 3. 캐시 무효화
    revalidateTag('posts');

    console.log('[Sync] 🎉 동기화 완료');
    return { success: true, count: response.results.length };
  } catch (error) {
    console.error('[Sync] ❌ 동기화 중 에러:', error);
    throw error;
  }
}
```

---

### **Phase 3: 수동 동기화 테스트** (1시간)

#### ✅ 3.1 관리자 동기화 페이지

**파일:** `src/app/admin/sync/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { syncNotionToSupabase } from '@/services/sync-notion';

export default function SyncPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);

  async function handleSync() {
    setLoading(true);
    setResult(null);

    try {
      const res = await syncNotionToSupabase();
      setResult(res);
    } catch (error) {
      alert('동기화 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-2xl font-bold">Notion 동기화</h1>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <p className="mb-4">Notion에서 Supabase로 포스트를 동기화합니다.</p>

          <button
            onClick={handleSync}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '동기화 중...' : '수동 동기화 실행'}
          </button>

          {result && (
            <div className="alert alert-success mt-4">
              <span>✅ {result.count}개 포스트 동기화 완료!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### ✅ 3.2 테스트 절차

```
1. Notion에서 테스트 글 작성
   - Title: "테스트 포스트"
   - Status: Published
   - Tags: React, Next.js
   - Published: 오늘 날짜
   - Content: 간단한 내용

2. http://localhost:3000/admin/sync 접속

3. "수동 동기화 실행" 버튼 클릭

4. Supabase 테이블 확인
   - Table Editor → posts
   - 새 포스트 확인

5. 블로그 페이지 확인
   - http://localhost:3000/posts
   - 새 글 표시 확인
```

---

### **Phase 4: Vercel Cron 자동화** (1시간)

#### ✅ 4.1 Cron 엔드포인트 생성

**파일:** `src/app/api/cron/sync/route.ts`

```typescript
import { syncNotionToSupabase } from '@/services/sync-notion';

export async function GET(request: Request) {
  // Vercel Cron Secret으로 인증
  const authHeader = request.headers.get('Authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await syncNotionToSupabase();

    return Response.json({
      success: true,
      message: `${result.count} posts synced`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Sync failed:', error);

    return Response.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
```

#### ✅ 4.2 Vercel Cron 설정

**파일:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**스케줄 설명:**

```
0 */6 * * *  = 6시간마다 (0시, 6시, 12시, 18시)
0 */4 * * *  = 4시간마다
0 0 * * *    = 매일 자정
```

#### ✅ 4.3 환경 변수 추가

```bash
# .env.local (로컬)
CRON_SECRET=your-random-secret-string

# Vercel Dashboard (프로덕션)
Settings → Environment Variables
→ CRON_SECRET 추가
```

#### ✅ 4.4 배포 및 확인

```bash
# Git commit & push
git add .
git commit -m "feat: Notion + Supabase 동기화 구현"
git push

# Vercel 자동 배포 대기

# Cron 작동 확인
Vercel Dashboard → Deployments → Functions → Cron Jobs
```

---

### **Phase 5: 조회수 기능 추가** (선택, 1-2시간)

#### ✅ 5.1 Supabase Function 추가

**Supabase SQL Editor:**

```sql
-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_view_count(post_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

#### ✅ 5.2 Server Action 추가

**파일:** `src/services/posts.ts`

```typescript
'use server';

export async function incrementViewCount(postId: string) {
  await supabase.rpc('increment_view_count', { post_id: postId });
  revalidateTag(`post-${postId}`);
}
```

#### ✅ 5.3 포스트 페이지에 적용

**파일:** `src/app/posts/[id]/page.tsx`

```typescript
export default async function PostPage({ params }: { params: { id: string } }) {
  // 조회수 증가 (비동기, 백그라운드)
  incrementViewCount(params.id);

  const post = await getPostById(params.id);

  return <MarkdownContent content={post.content} />;
}
```

---

## 📊 완성 후 데이터 흐름

### 글 작성 플로우

```
1. Notion에서 글 작성
   ├─ Title: "Next.js 16 업데이트"
   ├─ Status: Draft (초안)
   └─ Content: 본문 작성

2. 검토 후 발행
   └─ Status: Draft → Published

3. 최대 6시간 대기 (Cron)
   └─ 또는 /admin/sync에서 수동 트리거

4. Supabase에 자동 동기화
   └─ posts 테이블 업데이트

5. Next.js에서 즉시 표시
   └─ 캐시 무효화 (revalidateTag)
```

### 사용자 읽기 플로우

```
사용자 방문
    ↓
Next.js Server Component
    ↓
Supabase 조회 (10-50ms, 빠름!)
    ↓
Next.js 캐시 (use cache)
    ↓
HTML 렌더링
```

---

## ⏱️ 예상 개발 시간

| Phase    | 작업 내용          | 예상 시간   |
| -------- | ------------------ | ----------- |
| Phase 1  | Notion 설정 및 SDK | 30분        |
| Phase 2  | 동기화 로직 구현   | 2-3시간     |
| Phase 3  | 수동 동기화 테스트 | 1시간       |
| Phase 4  | Vercel Cron 자동화 | 1시간       |
| Phase 5  | 조회수 기능 (선택) | 1-2시간     |
| **합계** |                    | **5-8시간** |

---

## ✅ 체크리스트

### Phase 1: Notion 설정

- [ ] Notion Integration 생성
- [ ] Notion Database 생성 (속성 설정)
- [ ] Integration을 Database에 초대
- [ ] `@notionhq/client` 설치
- [ ] `.env.local`에 환경 변수 추가

### Phase 2: 동기화 로직

- [ ] `src/lib/notion/client.ts` 작성
- [ ] `src/lib/notion/converter.ts` 작성
- [ ] `src/services/sync-notion.ts` 작성
- [ ] 타입 오류 해결

### Phase 3: 수동 테스트

- [ ] `src/app/admin/sync/page.tsx` 작성
- [ ] Notion에 테스트 글 작성
- [ ] 수동 동기화 실행
- [ ] Supabase 테이블 확인
- [ ] 블로그에서 글 표시 확인

### Phase 4: Cron 자동화

- [ ] `src/app/api/cron/sync/route.ts` 작성
- [ ] `vercel.json` 설정
- [ ] `CRON_SECRET` 환경 변수 추가
- [ ] Git push & Vercel 배포
- [ ] Cron 작동 확인

### Phase 5: 조회수 (선택)

- [ ] Supabase Function 생성
- [ ] `incrementViewCount` Server Action
- [ ] 포스트 페이지 적용
- [ ] 테스트

---

## 🎯 기대 효과

### 성능

- ⚡ 읽기 속도: 800ms → 10-50ms (80배 빠름)
- 🚀 Next.js `use cache` 완벽 활용
- 💾 Supabase Free Tier로 충분

### 개발 경험

- ✅ Notion의 강력한 에디터 사용
- ✅ 관리자 페이지 개발 불필요
- ✅ 이미지, 코드 블록 자동 처리

### 신기술 체험

- ✅ Notion API
- ✅ Supabase
- ✅ Vercel Cron
- ✅ Server Actions
- ✅ `use cache` (Next.js 16)

---

## 📚 참고 자료

- [Notion API 공식 문서](https://developers.notion.com/)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
