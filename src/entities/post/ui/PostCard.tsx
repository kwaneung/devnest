import Link from 'next/link';

import type { Post } from '@/entities/post';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow h-full">
        <div className="card-body">
          <h2 className="card-title text-lg line-clamp-2">{post.title}</h2>
          <p className="text-sm text-base-content/70 line-clamp-3">{post.excerpt}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <span key={tag} className="badge badge-sm badge-outline">
                {tag}
              </span>
            ))}
          </div>

          <div className="card-actions justify-between items-center mt-4 text-xs text-base-content/60">
            <div className="flex items-center gap-4">
              <span>{post.author}</span>
              <span>{formattedDate}</span>
            </div>
            <span>조회 {post.viewCount.toLocaleString()}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
