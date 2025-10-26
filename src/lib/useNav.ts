import { useContext } from 'react';
import { NavContext } from '@/hooks/nav-context';

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
