# Next.js App Router 패턴

## 파일 구조

| 파일 | 용도 |
|------|------|
| `page.tsx` | 페이지 컴포넌트 |
| `layout.tsx` | 레이아웃 (중첩 가능) |
| `loading.tsx` | 로딩 UI (Suspense) |
| `error.tsx` | 에러 UI |
| `not-found.tsx` | 404 페이지 |

## 페이지 컴포넌트 템플릿

```typescript
import type { Metadata } from 'next';

// 메타데이터 (정적)
export const metadata: Metadata = {
  title: '페이지 제목',
  description: '페이지 설명',
};

// 또는 동적 메타데이터
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `제목 - ${params.id}`,
  };
}

// 페이지 컴포넌트
export default function PageName() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 콘텐츠 */}
    </div>
  );
}
```

## 레이아웃 패턴

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-dvh">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## 성능 최적화

### 이미지 최적화 (필수)
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="설명"
  width={800}
  height={600}
  priority // LCP 이미지에만 사용
/>
```

### 폰트 최적화
```typescript
import localFont from 'next/font/local';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
});

export default function RootLayout({ children }) {
  return (
    <html className={pretendard.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 동적 Import
```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // CSR만 필요한 경우
});
```

## 데이터 페칭

### Server Component (기본)
```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }, // ISR
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

### Client Component
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export default function ClientPage() {
  const { data } = useQuery({
    queryKey: ['data'],
    queryFn: () => fetch('/api/data').then(r => r.json()),
  });

  return <div>{data?.title}</div>;
}
```

## 현재 프로젝트 폰트

- **Pretendard**: 한글 최적화 폰트
- CSS 변수: `--font-sans`, `--font-mono`
