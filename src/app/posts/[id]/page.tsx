import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPostById } from '@/entities/post';
import { PostDetailPage } from '@/pages/post-detail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 60;

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

  return <PostDetailPage post={post} />;
}
