import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostById, getPosts } from '@/services/posts';
import MarkdownContent from '@/components/ui/MarkdownContent';
import BackButton from '@/components/ui/BackButton';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    id: String(post.id),
  }));
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(Number(id));

  if (!post) {
    return {
      title: '게시글을 찾을 수 없습니다',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt, // 이미 ISO string 형식
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (isNaN(postId)) {
    notFound();
  }

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
          <button className="btn btn-ghost btn-sm gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>
            공유
          </button>
          <button className="btn btn-ghost btn-sm gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
            북마크
          </button>
        </div>
      </footer>
    </div>
  );
}
