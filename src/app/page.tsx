import { SectionCards } from '@/components/section-cards';
import { getPosts } from '@/services/posts';

export default async function Page() {
  const posts = await getPosts({ sort: 'popular', limit: 3 });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards posts={posts} />
        </div>
      </div>
    </div>
  );
}
