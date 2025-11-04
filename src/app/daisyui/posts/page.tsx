import type { Metadata } from 'next';

import { PostListTable } from './_components/PostListTable';

export const metadata: Metadata = {
  title: '포스트',
  description: '프론트엔드 개발, React, Next.js, TypeScript 등 다양한 기술에 대한 글을 작성합니다.',
};

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">포스트</h1>
        <p className="text-base-content/70">DevNest의 모든 글을 만나보세요</p>
      </div>

      <PostListTable />
    </div>
  );
}
