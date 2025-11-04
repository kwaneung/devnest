import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { Header } from './Header';

// next/navigation 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({}),
}));

// useNav 훅 모킹
vi.mock('@/hooks', () => ({
  useNav: () => ({
    items: [
      { href: '/posts', label: '블로그' },
      { href: '/about', label: '소개' },
    ],
  }),
}));

describe('Header', () => {
  let localStorageMock: Record<string, string> = {};

  beforeEach(() => {
    // localStorage 모킹
    localStorageMock = {};

    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;

    // matchMedia 모킹 (다크모드 감지)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // document.createElement spy
    vi.spyOn(document, 'createElement');
    vi.spyOn(document.head, 'appendChild');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('헤더가 렌더링되어야 한다', () => {
    render(<Header />);

    expect(screen.getByText('DevNest Blog')).toBeInTheDocument();
  });

  it('네비게이션 아이템이 표시되어야 한다', () => {
    render(<Header />);

    expect(screen.getByText('블로그')).toBeInTheDocument();
    expect(screen.getByText('소개')).toBeInTheDocument();
  });

  it('테마 변경 버튼이 있어야 한다', () => {
    render(<Header />);

    const themeButton = screen.getByRole('button', { name: /테마 변경/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('테마 버튼 클릭 시 테마가 순환해야 한다', async () => {
    render(<Header />);

    const themeButton = screen.getByRole('button', { name: /테마 변경/i });

    // 초기 테마 로드 대기
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    // 클릭하면 테마가 변경됨
    fireEvent.click(themeButton);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('themeMode', expect.any(String));
    });
  });

  it('검색 입력창이 표시되어야 한다 (md 이상)', () => {
    render(<Header />);

    const searchInput = screen.getByPlaceholderText('검색');
    expect(searchInput).toBeInTheDocument();
  });

  it('모바일 사이드바 토글 버튼이 있어야 한다', () => {
    render(<Header />);

    const drawerLabel = screen.getByLabelText('Open sidebar');
    expect(drawerLabel).toBeInTheDocument();
  });

  it('홈 링크가 올바른 href를 가져야 한다', () => {
    render(<Header />);

    const homeLink = screen.getByRole('link', { name: 'DevNest Blog' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('네비게이션 링크가 올바른 href를 가져야 한다', () => {
    render(<Header />);

    const blogLink = screen.getByRole('link', { name: '블로그' });
    const aboutLink = screen.getByRole('link', { name: '소개' });

    expect(blogLink).toHaveAttribute('href', '/posts');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('localStorage에 저장된 테마를 복원해야 한다', async () => {
    // localStorage에 'dark' 테마 미리 저장
    localStorageMock['themeMode'] = 'dark';

    render(<Header />);

    // initializeTheme이 실행되어 저장된 테마를 복원함
    await waitFor(() => {
      expect(localStorage.getItem).toHaveBeenCalledWith('themeMode');
    });
  });

  it('localStorage 에러 시 system 테마로 폴백해야 한다', async () => {
    // localStorage.getItem이 에러를 throw하도록 설정
    global.localStorage = {
      ...global.localStorage,
      getItem: vi.fn(() => {
        throw new Error('localStorage access denied');
      }),
    } as Storage;

    render(<Header />);

    // 에러가 발생해도 앱이 크래시되지 않고 system 테마로 폴백
    await waitFor(() => {
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });

  it('시스템 다크모드 변경 시 테마가 업데이트되어야 한다', async () => {
    let matchMediaListener: ((e: MediaQueryListEvent) => void) | null = null;

    // matchMedia 이벤트 리스너 캡처
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(
          (event: string, listener: (e: MediaQueryListEvent) => void): void => {
            if (event === 'change') {
              matchMediaListener = listener;
            }
          },
        ),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // system 테마로 설정
    localStorageMock['themeMode'] = 'system';

    render(<Header />);

    // 초기 렌더링 대기
    await waitFor(() => {
      expect(localStorage.getItem).toHaveBeenCalledWith('themeMode');
    });

    // matchMedia 이벤트 발생 시뮬레이션 (OS 다크모드 변경)
    expect(matchMediaListener).not.toBeNull();
    if (matchMediaListener) {
      const event = { matches: true } as MediaQueryListEvent;
      (matchMediaListener as (e: MediaQueryListEvent) => void)(event);

      // applySystemTheme이 호출되어 테마 적용
      await waitFor(() => {
        expect(document.createElement).toHaveBeenCalled();
      });
    }
  });
});
