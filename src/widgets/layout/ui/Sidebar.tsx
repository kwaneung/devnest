'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useNav } from '@/shared/context';

export default function Sidebar() {
  const { items } = useNav();
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
    <aside className="min-h-full w-64 md:w-72 lg:w-80 bg-base-100 overflow-y-auto">
      <div className="navbar bg-base-100 border-b border-base-300 p-4">
        <div className="navbar-start">
          <h2 className="text-base font-semibold pl-2">탐색</h2>
        </div>
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
