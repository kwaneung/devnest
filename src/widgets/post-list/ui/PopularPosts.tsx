'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { postsApi, PostCard } from '@/entities/post';

export function PopularPosts() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts', 'popular', 3],
    queryFn: () => postsApi.getPosts({ sort: 'popular', limit: 3 }),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
