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
    <Link href={`/posts/${post.id}`} className="group">
      <article className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-base-content/5 hover:border-primary/20 overflow-hidden">
        {/* 상단 색상 바 - Apple Intelligence 스타일 */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

        <div className="card-body gap-4">
          {/* 제목 */}
          <h2 className="card-title text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {/* 발췌문 */}
          <p className="text-sm text-base-content/70 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="badge badge-sm badge-ghost hover:badge-primary transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 하단 메타 정보 */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-base-content/5">
            <div className="flex items-center gap-3 text-xs text-base-content/60">
              {/* 저자 */}
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">{post.author}</span>
              </div>

              {/* 날짜 */}
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* 조회수 */}
            <div className="flex items-center gap-1 text-xs text-base-content/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="font-medium">{post.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
