/**
 * 블로그 포스트 태그 상수
 */
export const POST_TAGS = {
  // Frontend Frameworks
  NEXTJS: 'Next.js',
  REACT: 'React',

  // Languages
  TYPESCRIPT: 'TypeScript',
  JAVASCRIPT: 'JavaScript',

  // State Management
  TANSTACK_QUERY: 'Tanstack Query',
  STATE_MANAGEMENT: 'State Management',

  // Styling
  TAILWIND_CSS: 'Tailwind CSS',
  CSS: 'CSS',

  // Architecture
  ARCHITECTURE: 'Architecture',
  FSD: 'FSD',

  // General
  WEB_DEVELOPMENT: 'Web Development',
  FRONTEND: 'Frontend',
  PROGRAMMING: 'Programming',
  RESPONSIVE_DESIGN: 'Responsive Design',
} as const;

/**
 * 태그 타입
 */
export type PostTag = (typeof POST_TAGS)[keyof typeof POST_TAGS];
