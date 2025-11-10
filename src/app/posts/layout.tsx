import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'DevNest 포스트 - 최신 포스트 목록을 확인하세요.',
};

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
