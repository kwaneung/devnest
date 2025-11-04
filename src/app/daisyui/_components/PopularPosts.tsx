import { getPosts } from '@/services/posts';
import { PostCard } from './PostCard';

export async function PopularPosts() {
  const posts = await getPosts({ sort: 'popular', limit: 3 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
