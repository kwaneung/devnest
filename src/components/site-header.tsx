'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  const [pageTitle, setPageTitle] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const updateTitle = () => {
      const fullTitle = document.title;
      const title = fullTitle.split('|')[1]?.trim();
      if (title) {
        setPageTitle(title);
      }
    };

    // 초기 타이틀 설정 시도
    updateTitle();

    // MutationObserver로 <head> 태그의 변경 감지
    const headElement = document.querySelector('head');
    if (!headElement) return;

    const observer = new MutationObserver(() => {
      updateTitle();
    });

    observer.observe(headElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/kwaneung"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
