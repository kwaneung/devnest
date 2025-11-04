'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useNav } from '@/hooks';

export function Sidebar() {
  const { items } = useNav();
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };
  const closeDrawer = () => {
    const el = document.getElementById('app-drawer') as HTMLInputElement | null;
    if (el) el.checked = false;
  };
  return (
    <aside className="min-h-full w-48 md:w-52 lg:w-56 bg-base-100 overflow-y-auto">
      <div className="navbar bg-base-100 border-b border-base-300 px-4">
        <Link href="/daisyui" className="btn btn-ghost text-lg font-semibold" onClick={closeDrawer}>
          DevNest Blog
        </Link>
      </div>
      <nav className="p-2">
        <ul className="menu">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href) ? 'menu-active' : undefined}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={closeDrawer}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
