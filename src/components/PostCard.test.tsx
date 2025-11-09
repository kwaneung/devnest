import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Post } from '@/types/post';

import { PostCard } from './PostCard';

describe('PostCard', () => {
  const mockPost: Post = {
    id: 1,
    title: '테스트 포스트 제목',
    excerpt: '이것은 테스트 포스트의 발췌문입니다.',
    content: '전체 내용',
    author: '테스트 작성자',
    publishedAt: '2025-10-31T00:00:00.000Z',
    tags: ['React', 'TypeScript', 'Testing', 'Vitest'],
    viewCount: 1234,
    status: 'Published',
  };

  it('포스트 정보가 올바르게 렌더링되어야 한다', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('테스트 포스트 제목')).toBeInTheDocument();
    expect(screen.getByText('이것은 테스트 포스트의 발췌문입니다.')).toBeInTheDocument();
    expect(screen.getByText('테스트 작성자')).toBeInTheDocument();
  });

  it('날짜가 한국어 형식으로 포맷되어야 한다', () => {
    render(<PostCard post={mockPost} />);

    // '2025년 10월 31일' 형식으로 표시되어야 함
    expect(screen.getByText(/2025년 10월 31일/)).toBeInTheDocument();
  });

  it('태그가 최대 3개까지만 표시되어야 한다', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
    expect(screen.queryByText('Vitest')).not.toBeInTheDocument(); // 4번째 태그는 표시 안 됨
  });

  it('조회수가 천 단위 구분자와 함께 표시되어야 한다', () => {
    render(<PostCard post={mockPost} />);

    // toLocaleString()으로 포맷됨: 1,234
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('포스트 상세 페이지로 가는 링크를 가져야 한다', () => {
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/posts/1');
  });

  it('태그가 없어도 정상 렌더링되어야 한다', () => {
    const postWithoutTags: Post = {
      ...mockPost,
      tags: [],
    };

    render(<PostCard post={postWithoutTags} />);

    expect(screen.getByText('테스트 포스트 제목')).toBeInTheDocument();
  });

  it('조회수가 0이어도 정상 표시되어야 한다', () => {
    const postWithZeroViews: Post = {
      ...mockPost,
      viewCount: 0,
    };

    render(<PostCard post={postWithZeroViews} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('긴 제목은 line-clamp-2 클래스를 가져야 한다', () => {
    render(<PostCard post={mockPost} />);

    const title = screen.getByText('테스트 포스트 제목');
    expect(title).toHaveClass('line-clamp-2');
  });

  it('발췌문은 line-clamp-3 클래스를 가져야 한다', () => {
    render(<PostCard post={mockPost} />);

    const excerpt = screen.getByText('이것은 테스트 포스트의 발췌문입니다.');
    expect(excerpt).toHaveClass('line-clamp-3');
  });
});
