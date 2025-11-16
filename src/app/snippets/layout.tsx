import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'DevNest 스니펫 - 유용한 코드 스니펫을 확인하세요.',
};

export default function SnippetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
