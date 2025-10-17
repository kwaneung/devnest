import Link from 'next/link';

import { getPosts } from '@/entities/post';

export async function PostListTable() {
  const posts = await getPosts({ sort: 'latest' });

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
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
            // Server Actions에서 반환된 publishedAt은 ISO string이므로 Date로 변환
            const formattedDate = new Date(post.publishedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });

            return (
              <tr key={post.id} className="hover:bg-base-200 cursor-pointer">
                <td>
                  <Link href={`/posts/${post.id}`} className="block">
                    {index + 1}
                  </Link>
                </td>
                <td>
                  <Link href={`/posts/${post.id}`} className="block">
                    <div className="font-medium">{post.title}</div>
                    <p className="text-xs text-base-content/60 mt-1 line-clamp-1 md:hidden">
                      {post.excerpt}
                    </p>
                  </Link>
                </td>
                <td className="hidden md:table-cell">
                  <Link href={`/posts/${post.id}`} className="block">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="badge badge-sm badge-ghost">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </td>
                <td className="hidden sm:table-cell text-sm whitespace-nowrap">
                  <Link href={`/posts/${post.id}`} className="block">
                    {formattedDate}
                  </Link>
                </td>
                <td className="text-right text-sm">
                  <Link href={`/posts/${post.id}`} className="block">
                    {post.viewCount.toLocaleString()}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
