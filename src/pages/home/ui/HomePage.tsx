import Link from 'next/link';

import { PopularPosts } from '@/widgets/post-list';

export function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold">DevNest</h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          개발 여정을 기록하고 공유하는 공간입니다.
          <br />
          프론트엔드 개발, 아키텍처, 그리고 배운 것들을 정리합니다.
        </p>
      </section>

      {/* 인기 포스트 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">인기 포스트</h2>
          <Link href="/posts" className="link link-hover text-sm">
            전체 보기 →
          </Link>
        </div>

        <PopularPosts />
      </section>
    </div>
  );
}
