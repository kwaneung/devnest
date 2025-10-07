'use client';

import { createContext } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavContextValue {
  items: NavItem[];
  setItems: (items: NavItem[]) => void;
}

export const defaultNavItems: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '포스트', href: '/posts' },
  { label: '디자인 시스템', href: '/design-system' },
  { label: '소개', href: '/about' },
];

export const NavContext = createContext<NavContextValue | undefined>(undefined);
