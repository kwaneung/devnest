'use server';

import type { Post, GetPostsParams } from '../model';

// 모킹 데이터 (실제로는 DB나 외부 API에서 가져옴)
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Next.js 15와 React 19로 시작하는 모던 웹 개발',
    excerpt: 'Next.js 15의 새로운 기능과 React 19의 주요 변경사항을 알아봅니다.',
    content: 'Next.js 15와 React 19가 출시되면서 웹 개발의 새로운 장이 열렸습니다...',
    author: 'DevNest',
    publishedAt: '2025-10-01T09:00:00Z',
    tags: ['Next.js', 'React', 'Web Development'],
    viewCount: 1250,
  },
  {
    id: 2,
    title: 'Tanstack Query로 서버 상태 관리 마스터하기',
    excerpt: 'Tanstack Query를 활용한 효율적인 서버 상태 관리 전략을 소개합니다.',
    content: '서버 상태 관리는 현대 웹 애플리케이션에서 필수적입니다...',
    author: 'DevNest',
    publishedAt: '2025-10-03T14:30:00Z',
    tags: ['Tanstack Query', 'State Management', 'React'],
    viewCount: 890,
  },
  {
    id: 3,
    title: 'TypeScript 5.9의 새로운 기능 살펴보기',
    excerpt: 'TypeScript 5.9에서 추가된 새로운 기능과 개선사항을 정리했습니다.',
    content: 'TypeScript 5.9는 개발자 경험을 크게 향상시키는 여러 기능을 제공합니다...',
    author: 'DevNest',
    publishedAt: '2025-10-05T10:15:00Z',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    viewCount: 670,
  },
  {
    id: 4,
    title: 'Tailwind CSS 4로 구현하는 반응형 디자인',
    excerpt: 'Tailwind CSS 4의 새로운 기능을 활용한 반응형 웹 디자인 패턴을 알아봅니다.',
    content: 'Tailwind CSS 4는 더욱 강력한 반응형 디자인 도구를 제공합니다...',
    author: 'DevNest',
    publishedAt: '2025-10-06T16:45:00Z',
    tags: ['Tailwind CSS', 'CSS', 'Responsive Design'],
    viewCount: 540,
  },
  {
    id: 5,
    title: 'FSD 아키텍처로 확장 가능한 프론트엔드 구축하기',
    excerpt: 'Feature-Sliced Design 아키텍처의 핵심 개념과 실전 적용 방법을 설명합니다.',
    content: 'FSD는 프론트엔드 프로젝트의 구조를 체계적으로 관리할 수 있게 해줍니다...',
    author: 'DevNest',
    publishedAt: '2025-10-07T11:20:00Z',
    tags: ['Architecture', 'FSD', 'Frontend'],
    viewCount: 320,
  },
];

/**
 * 포스트 목록을 가져오는 Server Action
 * @param params - 정렬 및 제한 파라미터
 * @returns 포스트 배열
 */
export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  // 실제로는 외부 API나 DB에서 데이터를 가져옴
  // await fetch('https://api.example.com/posts', { next: { revalidate: 3600 } })

  const sort = params?.sort || 'latest';
  const limit = params?.limit;

  // 정렬
  let sortedPosts = [...mockPosts];
  if (sort === 'popular') {
    sortedPosts.sort((a, b) => b.viewCount - a.viewCount);
  } else {
    // 최신순 (기본)
    sortedPosts.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  // limit 적용
  if (limit) {
    sortedPosts = sortedPosts.slice(0, limit);
  }

  return sortedPosts;
}
