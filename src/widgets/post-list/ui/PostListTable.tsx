'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { postsApi } from '@/entities/post';

export function PostListTable() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts', 'latest'],
    queryFn: () => postsApi.getPosts({ sort: 'latest' }),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th className="w-12">#</th>
            <th>제목</th>
            <th className="hidden md:table-cell">태그</th>
            <th className="hidden sm:table-cell whitespace-nowrap">작성일</th>
            <th className="text-right">조회</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => {
            const formattedDate = new Date(post.publishedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });

            return (
              <tr key={post.id} className="hover">
                <td>{index + 1}</td>
                <td>
                  <Link href={`/posts/${post.id}`} className="link link-hover font-medium">
                    {post.title}
                  </Link>
                  <p className="text-xs text-base-content/60 mt-1 line-clamp-1 md:hidden">
                    {post.excerpt}
                  </p>
                </td>
                <td className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="badge badge-sm badge-ghost">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="hidden sm:table-cell text-sm whitespace-nowrap">{formattedDate}</td>
                <td className="text-right text-sm">{post.viewCount.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
