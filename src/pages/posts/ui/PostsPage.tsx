import { Suspense } from 'react';

import { PostListTable } from '@/widgets/post-list';

export function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">포스트</h1>
        <p className="text-base-content/70">DevNest의 모든 글을 만나보세요</p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        <PostListTable />
      </Suspense>
    </div>
  );
}
