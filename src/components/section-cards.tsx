import { IconEye } from '@tabler/icons-react';
import Link from 'next/link';

import type { Post } from '@/types/post';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SectionCardsProps {
  posts: Post[];
}

export function SectionCards({ posts }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {posts.map((post) => {
        const formattedDate = new Date(post.publishedAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <Card className="@container/card cursor-pointer transition-all hover:shadow-lg">
              <CardHeader>
                <CardDescription>{post.author}</CardDescription>
                <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconEye className="size-4" />
                    {post.viewCount.toLocaleString()}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-2 font-medium">{post.excerpt}</div>
                <div className="text-muted-foreground">{formattedDate}</div>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
