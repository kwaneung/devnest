import { Suspense } from 'react';
import type { Metadata } from 'next';

import { getSnippets } from '@/services/snippets';
import { SnippetDataTable } from '@/components/snippet-data-table';

export const metadata: Metadata = {
  title: 'Snippets',
};

export default async function SnippetsPage() {
  const snippets = await getSnippets();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Suspense fallback={<></>}>
            <SnippetDataTable data={snippets} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
