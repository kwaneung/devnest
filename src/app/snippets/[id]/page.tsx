import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, User } from 'lucide-react';

import { getSnippetById, getSnippets } from '@/services/snippets';
import BackButton from '@/components/ui/BackButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { formatDateLong } from '@/lib/date';
import { SUPPORTED_LANGUAGES } from '@/types/snippet';

export async function generateStaticParams() {
  const snippets = await getSnippets();
  return snippets.map((snippet) => ({
    id: String(snippet.id),
  }));
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const snippet = await getSnippetById(Number(id));

  if (!snippet) {
    return {
      title: '스니펫을 찾을 수 없습니다',
    };
  }

  return {
    title: snippet.title,
    description: snippet.description || `${snippet.language} 코드 스니펫`,
    openGraph: {
      title: snippet.title,
      description: snippet.description || `${snippet.language} 코드 스니펫`,
      type: 'article',
      publishedTime: snippet.createdAt,
      authors: [snippet.author],
      tags: snippet.tags,
    },
  };
}

export default async function SnippetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const snippetId = Number(id);

  if (isNaN(snippetId)) {
    notFound();
  }

  const snippet = await getSnippetById(snippetId);

  if (!snippet) {
    notFound();
  }

  // 언어 정보 찾기
  const languageInfo = SUPPORTED_LANGUAGES.find((lang) => lang.value === snippet.language);
  const languageIcon = languageInfo?.icon || '📄';
  const languageLabel = languageInfo?.label || snippet.language;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-6 px-0">
          {/* 뒤로가기 버튼 */}
          <div>
            <BackButton />
          </div>

          {/* 제목 & 언어 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{languageIcon}</span>
              <CardTitle className="text-4xl font-bold leading-tight tracking-tight flex-1">
                {snippet.title}
              </CardTitle>
            </div>
            {snippet.description && (
              <CardDescription className="text-base">{snippet.description}</CardDescription>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{snippet.author}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={snippet.createdAt}>{formatDateLong(snippet.createdAt)}</time>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span className="font-medium">{languageLabel}</span>
            </div>
          </div>

          {/* 태그 */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <Separator className="my-8" />

        <CardContent className="px-0">
          {/* 코드 블록 */}
          <CodeBlock code={snippet.code} language={snippet.language} title={snippet.title} />
        </CardContent>
      </Card>
    </div>
  );
}
