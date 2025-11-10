import { Suspense } from 'react';

import { DataTable } from '@/components/data-table';
import { getPosts } from '@/services/posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Posts',
};

export default async function Page() {
  // 동적 데이터 가져오기
  const posts = await getPosts({ sort: 'latest' });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Suspense fallback={<></>}>
            <DataTable data={posts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
