'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };
  const closeDrawer = () => {
    const el = document.getElementById('app-drawer') as HTMLInputElement | null;
    if (el) el.checked = false;
  };
  return (
    <aside className="min-h-full w-80 bg-base-100 overflow-y-auto">
      <div className="navbar bg-base-100 border-b border-base-300 p-4">
        <div className="navbar-start">
          <h2 className="text-base font-semibold pl-2">탐색</h2>
        </div>
      </div>
      <nav className="p-2">
        <ul className="menu">
          <li>
            <Link
              href="/"
              className={isActive('/') ? 'menu-active' : undefined}
              aria-current={isActive('/') ? 'page' : undefined}
              onClick={closeDrawer}
            >
              홈
            </Link>
          </li>
          <li>
            <Link
              href="/design-system"
              className={isActive('/design-system') ? 'menu-active' : undefined}
              aria-current={isActive('/design-system') ? 'page' : undefined}
              onClick={closeDrawer}
            >
              디자인 시스템
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={isActive('/about') ? 'menu-active' : undefined}
              aria-current={isActive('/about') ? 'page' : undefined}
              onClick={closeDrawer}
            >
              소개
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
