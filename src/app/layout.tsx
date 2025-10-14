import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

import './globals.css';
import { Providers } from '@/app/providers';
import { NavProvider } from '@/shared/context';
import { Header, Sidebar, Footer } from '@/widgets/layout';

export const metadata: Metadata = {
  title: {
    default: 'DevNest | 프론트엔드 개발 블로그',
    template: 'DevNest | %s',
  },
  description: '프론트엔드 개발과 아키텍처에 대한 인사이트를 공유하는 개발 블로그입니다.',
  keywords: [
    'Frontend',
    'React',
    'Next.js',
    'TypeScript',
    'Web Development',
    '프론트엔드',
    '개발 블로그',
  ],
  authors: [{ name: '김관응' }],
  creator: '김관응',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://devnest-orcin.vercel.app',
    title: 'DevNest | 프론트엔드 개발 블로그',
    description: '프론트엔드 개발과 아키텍처에 대한 인사이트를 공유하는 개발 블로그입니다.',
    siteName: 'DevNest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevNest | 프론트엔드 개발 블로그',
    description: '프론트엔드 개발과 아키텍처에 대한 인사이트를 공유하는 개발 블로그입니다.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 1. localStorage에서 저장된 테마 모드 확인
                  const savedMode = localStorage.getItem('themeMode');

                  if (savedMode === 'light') {
                    document.documentElement.setAttribute('data-theme', 'pastel');
                    return;
                  }

                  if (savedMode === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'night');
                    return;
                  }

                  // 2. system 또는 없으면 OS 다크모드 설정 확인
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = prefersDark ? 'night' : 'pastel';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch {
                  // 3. 실패 시 기본값 (pastel)
                  document.documentElement.setAttribute('data-theme', 'pastel');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-dvh">
        <Providers>
          <NavProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn btn-sm"
            >
              본문 바로가기
            </a>
            <div className="drawer">
              <input id="app-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content flex flex-col min-h-dvh">
                <Header />
                <main
                  id="main"
                  className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full"
                >
                  {children}
                </main>
                <Footer />
              </div>
              <div className="drawer-side z-60">
                <label
                  htmlFor="app-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <Sidebar />
              </div>
            </div>
          </NavProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
