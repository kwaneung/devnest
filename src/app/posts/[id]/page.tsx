import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, Eye, User } from 'lucide-react';
import { getPostById, getPosts } from '@/services/posts';
import MarkdownContent from '@/components/ui/MarkdownContent';
import BackButton from '@/components/ui/BackButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDateLong } from '@/lib/date';

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
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
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
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-6 px-0">
          {/* 뒤로가기 버튼 */}
          <div>
            <BackButton />
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold leading-tight tracking-tight">
              {post.title}
            </CardTitle>
            <CardDescription className="text-base">{post.excerpt}</CardDescription>
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={post.publishedAt}>{formatDateLong(post.publishedAt)}</time>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount.toLocaleString()} views</span>
            </div>
          </div>

          {/* 태그 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <Separator className="my-8" />

        <CardContent className="px-0">
          {/* 본문 - Markdown 렌더링 */}
          <MarkdownContent content={post.content} />
        </CardContent>
      </Card>
    </div>
  );
}
