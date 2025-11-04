'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useState } from 'react';

import { useNav } from '@/hooks';

type ThemeMode = 'light' | 'dark' | 'system';

export function Header() {
  const { items } = useNav();

  /**
   * 초기 테마 모드: null로 시작하여 클라이언트에서 설정 (Hydration 안전)
   */
  const [themeMode, setThemeMode] = useState<ThemeMode | null>(null);

  /**
   * theme-color 메타 태그 업데이트
   * Next.js Metadata API로 생성된 메타 태그를 클라이언트에서 동적으로 제어
   */
  const updateThemeColor = (theme: 'pastel' | 'night') => {
    const themeColor = theme === 'night' ? '#1a1a1a' : '#ffffff';

    // 1. Metadata API로 생성된 모든 theme-color 메타 태그 제거
    const existingMetas = document.querySelectorAll('meta[name="theme-color"]');
    existingMetas.forEach((meta) => meta.remove());

    // 2. 새로운 단일 메타 태그 생성 (media 속성 없이)
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = themeColor;
    document.head.appendChild(meta);

    // 3. iOS Safari safe area 강제 갱신
    // iOS Safari는 메타 태그 변경만으로는 status bar 색상을 즉시 업데이트하지 않음
    // 새로운 compositing layer를 생성하여 viewport 재평가 유도
    const trigger = document.createElement('div');
    trigger.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.01);
      pointer-events: none;
      z-index: 9999;
      transform: translateZ(0);
      will-change: transform;
    `;
    document.body.appendChild(trigger);

    requestAnimationFrame(() => {
      trigger.style.transform = 'translateZ(1px)';
      setTimeout(() => {
        if (trigger.parentNode) {
          trigger.parentNode.removeChild(trigger);
        }
      }, 300);
    });
  };

  /**
   * 테마 적용
   * daisyUI data-theme 속성과 theme-color 메타 태그를 동기화
   */
  const applyTheme = (mode: ThemeMode) => {
    let appliedTheme: 'pastel' | 'night';

    // 테마 결정
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      appliedTheme = prefersDark ? 'night' : 'pastel';
    } else if (mode === 'light') {
      appliedTheme = 'pastel';
    } else {
      appliedTheme = 'night';
    }

    // daisyUI 테마 적용
    document.documentElement.setAttribute('data-theme', appliedTheme);

    // theme-color 메타 태그 동기화
    updateThemeColor(appliedTheme);

    // localStorage 저장
    try {
      localStorage.setItem('themeMode', mode);
    } catch {
      // localStorage 사용 불가능 시 무시
    }
  };

  /**
   * 초기 마운트: localStorage에서 테마 복원 및 적용
   */
  const initializeTheme = useEffectEvent(() => {
    try {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setThemeMode(savedMode);
        applyTheme(savedMode);
      } else {
        setThemeMode('system');
        applyTheme('system');
      }
    } catch {
      setThemeMode('system');
      applyTheme('system');
    }
  });

  useEffect(() => {
    initializeTheme();
  }, []);

  /**
   * 시스템 테마 적용 (Effect 전용)
   */
  const applySystemTheme = useEffectEvent(() => {
    applyTheme('system');
  });

  /**
   * 시스템 다크모드 변경 감지
   */
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applySystemTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  /**
   * 테마 순환: light → dark → system
   */
  const cycleTheme = () => {
    if (!themeMode) return;
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeMode(nextMode);
    applyTheme(nextMode);
  };

  return (
    <div className="navbar bg-base-100/80 backdrop-blur border-b border-base-300 px-4 sticky top-0 z-50">
      <div className="navbar-start gap-2">
        <label
          htmlFor="app-drawer"
          aria-label="Open sidebar"
          className="btn btn-ghost btn-square lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </label>
        <Link href="/daisyui" className="btn btn-ghost text-lg font-semibold">
          DevNest Blog
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <label className="input items-center hidden md:flex w-40 md:w-56">
          <input type="text" placeholder="검색" className="grow" />
        </label>
        <button onClick={cycleTheme} className="btn btn-ghost btn-md" aria-label="테마 변경">
          {themeMode ? (
            <>
              {themeMode === 'light' && (
                <svg
                  className="h-5 w-5 fill-base-content"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>
              )}
              {themeMode === 'dark' && (
                <svg
                  className="h-5 w-5 fill-base-content"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
              )}
              {themeMode === 'system' && (
                <svg
                  className="h-5 w-5 fill-base-content"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M20,3H4C2.897,3,2,3.897,2,5v11c0,1.103,0.897,2,2,2h7v2H8v2h8v-2h-3v-2h7c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z M20,16H4V5h16V16z" />
                </svg>
              )}
            </>
          ) : (
            <div className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
