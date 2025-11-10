import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'DevNest | Home',
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
      <body className="antialiased min-h-dvh">
        <NextTopLoader
          color="#FF6B6B"
          height={4}
          showSpinner={false}
          easing="cubic-bezier(0.4, 0, 0.2, 1)"
          speed={300}
          shadow="0 0 10px #FF6B6B,0 0 5px #FF6B6B"
          crawlSpeed={300}
          initialPosition={0.08}
          zIndex={9999}
        />
        <Providers>
          <SidebarProvider
            style={
              {
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as React.CSSProperties
            }
          >
            <AppSidebar variant="inset" />
            <SidebarInset>
              <SiteHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
