import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Github, Linkedin, BookOpen, Eye, Code2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getPostsStats } from '@/services/posts';

export const metadata: Metadata = {
  title: '소개',
  description: '프론트엔드 개발자 김관응의 개발 여정',
};

export default async function AboutPage() {
  const stats = await getPostsStats();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <Avatar className="relative w-32 h-32 ring-4 ring-background shadow-2xl">
                <AvatarImage src="/dev-jeans-kt.png" alt="김관응" />
                <AvatarFallback>김관응</AvatarFallback>
              </Avatar>
            </div>

            {/* Name & Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                김관응
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Frontend Developer
              </p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                프론트엔드 개발과 아키텍처에 관심이 많은 개발자입니다.
                <br />
                배운 것을 기록하고 공유하며 함께 성장하는 것을 좋아합니다.
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="gap-2">
                <a href="mailto:kwaneung.kim@outlook.com">
                  <Mail className="h-5 w-5" />
                  Contact
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="gap-2">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  GitHub
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="gap-2">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="통계">
          <Card className="text-center border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">작성한 글</CardTitle>
            </CardHeader>
            <CardContent>
              <BookOpen className="h-8 w-8 mx-auto mb-3 text-purple-500" aria-hidden="true" />
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                {stats.count}
              </div>
              <p className="text-sm text-muted-foreground mt-2">지속적으로 기록 중</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 조회수</CardTitle>
            </CardHeader>
            <CardContent>
              <Eye className="h-8 w-8 mx-auto mb-3 text-blue-500" aria-hidden="true" />
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-2">감사합니다</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">기술 스택</CardTitle>
            </CardHeader>
            <CardContent>
              <Code2 className="h-8 w-8 mx-auto mb-3 text-orange-500" aria-hidden="true" />
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                5+
              </div>
              <p className="text-sm text-muted-foreground mt-2">계속 학습 중</p>
            </CardContent>
          </Card>
        </section>

        {/* Tech Stack */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">기술 스택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frontend */}
            <Card>
              <CardHeader>
                <CardTitle>Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" className="text-sm py-1 px-3">
                    Next.js
                  </Badge>
                  <Badge variant="default" className="text-sm py-1 px-3">
                    React
                  </Badge>
                  <Badge variant="default" className="text-sm py-1 px-3">
                    TypeScript
                  </Badge>
                  <Badge variant="default" className="text-sm py-1 px-3">
                    Tanstack Query
                  </Badge>
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    Tailwind CSS
                  </Badge>
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    daisyUI
                  </Badge>
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    Shadcn
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Tools & Others</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    Git
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    Cursor
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    Claude Code
                  </Badge>
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    Figma
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About */}
        <section>
          <Card className="bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="text-3xl">About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>안녕하세요, 프론트엔드 개발자 김관응입니다.</p>
                <p>
                  사용자 경험을 개선하고 아름다운 인터페이스를 만드는 것에 관심이 많습니다. 최신
                  기술 트렌드를 학습하고 이를 실제 프로젝트에 적용하는 것을 즐깁니다.
                </p>
                <p>
                  이 블로그는 개발하면서 배운 것들을 정리하고, 다른 개발자들과 지식을 공유하기 위해
                  만들었습니다.
                </p>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/daisyui/posts">글 보러가기</Link>
                </Button>
                <Button asChild variant="secondary">
                  <a href="mailto:kwaneung.kim@outlook.com">문의하기</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
