'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

interface NavContextValue {
  items: NavItem[];
  setItems: (items: NavItem[]) => void;
}

const defaultItems: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '디자인 시스템', href: '/design-system' },
  { label: '소개', href: '/about' },
];

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavProvider({
  children,
  initialItems,
}: {
  children: ReactNode;
  initialItems?: NavItem[];
}) {
  const [items, setItems] = useState<NavItem[]>(initialItems ?? defaultItems);
  const value = useMemo<NavContextValue>(() => ({ items, setItems }), [items]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
