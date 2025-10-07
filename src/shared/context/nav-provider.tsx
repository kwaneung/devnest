'use client';

import { useMemo, useState, type ReactNode } from 'react';

import { defaultNavItems, NavContext, type NavItem } from './nav-context';

export function NavProvider({
  children,
  initialItems,
}: {
  children: ReactNode;
  initialItems?: NavItem[];
}) {
  const [items, setItems] = useState<NavItem[]>(initialItems ?? defaultNavItems);
  const value = useMemo(() => ({ items, setItems }), [items]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
