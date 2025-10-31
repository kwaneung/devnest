import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import BackButton from './BackButton';

// next/navigation 모킹
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe('BackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('버튼이 렌더링되어야 한다', () => {
    render(<BackButton />);

    const button = screen.getByRole('button', { name: '목록으로' });
    expect(button).toBeInTheDocument();
  });

  it('버튼 클릭 시 router.back()이 호출되어야 한다', () => {
    render(<BackButton />);

    const button = screen.getByRole('button', { name: '목록으로' });
    fireEvent.click(button);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('올바른 스타일 클래스를 가져야 한다', () => {
    render(<BackButton />);

    const button = screen.getByRole('button', { name: '목록으로' });
    expect(button).toHaveClass('btn', 'btn-neutral');
  });
});
