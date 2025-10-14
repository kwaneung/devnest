import { notFound } from 'next/navigation';

import { getPostById } from '@/entities/post';
import BackButton from '@/shared/ui/BackButton';
import MarkdownContent from '@/shared/ui/MarkdownContent';

interface PostDetailPageProps {
  postId: number;
}

export default async function PostDetailPage({ postId }: PostDetailPageProps) {
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70">
          <span>작성자: {post.author}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>조회수: {post.viewCount.toLocaleString()}</span>
        </div>
        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag: string) => (
            <span key={tag} className="badge badge-primary badge-sm">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* 구분선 */}
      <div className="divider"></div>

      {/* 본문 - Markdown 렌더링 */}
      <MarkdownContent content={post.content} />

      {/* 구분선 */}
      <div className="divider mt-12"></div>

      {/* 하단 액션 */}
      <footer className="flex justify-between items-center">
        <BackButton />
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm">공유</button>
          <button className="btn btn-outline btn-sm">북마크</button>
        </div>
      </footer>
    </div>
  );
}
