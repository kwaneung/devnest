'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useNav } from '@/shared/context';

export default function Header() {
  const { items } = useNav();
  useEffect(() => {
    // 테마 동기화 함수
    const syncTheme = () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');

      // 라디오 버튼 동기화
      const lightRadio = document.querySelector('input[value="modern-light"]') as HTMLInputElement;
      const darkRadio = document.querySelector('input[value="modern-dark"]') as HTMLInputElement;

      // 토글 버튼 동기화
      const toggleCheckbox = document.querySelector(
        'input[type="checkbox"].theme-controller',
      ) as HTMLInputElement;

      if (currentTheme === 'modern-dark') {
        if (darkRadio) darkRadio.checked = true;
        if (toggleCheckbox) toggleCheckbox.checked = true;
      } else {
        if (lightRadio) lightRadio.checked = true;
        if (toggleCheckbox) toggleCheckbox.checked = false;
      }
    };

    // 초기 동기화
    syncTheme();

    // 테마 변경 감지
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // 라디오 버튼 이벤트 리스너
    const lightRadio = document.querySelector('input[value="modern-light"]') as HTMLInputElement;
    const darkRadio = document.querySelector('input[value="modern-dark"]') as HTMLInputElement;

    const handleRadioChange = () => {
      const toggleCheckbox = document.querySelector(
        'input[type="checkbox"].theme-controller',
      ) as HTMLInputElement;
      if (toggleCheckbox) {
        toggleCheckbox.checked = darkRadio?.checked || false;
      }
    };

    if (lightRadio) lightRadio.addEventListener('change', handleRadioChange);
    if (darkRadio) darkRadio.addEventListener('change', handleRadioChange);

    // 토글 버튼 이벤트 리스너
    const toggleCheckbox = document.querySelector(
      'input[type="checkbox"].theme-controller',
    ) as HTMLInputElement;
    const handleToggleChange = () => {
      if (toggleCheckbox) {
        if (toggleCheckbox.checked) {
          if (darkRadio) darkRadio.checked = true;
        } else {
          if (lightRadio) lightRadio.checked = true;
        }
      }
    };

    if (toggleCheckbox) toggleCheckbox.addEventListener('change', handleToggleChange);

    // 클린업
    return () => {
      observer.disconnect();
      if (lightRadio) lightRadio.removeEventListener('change', handleRadioChange);
      if (darkRadio) darkRadio.removeEventListener('change', handleRadioChange);
      if (toggleCheckbox) toggleCheckbox.removeEventListener('change', handleToggleChange);
    };
  }, []);
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
        <Link href="/" className="btn btn-ghost text-lg font-semibold">
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
        <label className="swap swap-rotate btn btn-ghost btn-md">
          <input type="checkbox" className="theme-controller" value="modern-dark" />
          <svg
            className="swap-off h-5 w-5 fill-base-content"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg
            className="swap-on h-5 w-5 fill-base-content"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>
    </div>
  );
}
