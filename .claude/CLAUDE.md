# DevNest 프로젝트

## 프로젝트 개요

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + daisyUI 5 기반의 반응형 웹 애플리케이션

- **패키지 매니저**: pnpm
- **아키텍처**: FSD (Feature-Sliced Design) v2.1
- **빌드 도구**: Turbopack
- **상태 관리**: Tanstack Query v5 (React Query)
- **데이터 페칭**: `useSuspenseQuery` + API Routes

## 핵심 원칙

1. **반응형 웹 디자인**: 모바일 퍼스트 접근, Tailwind 브레이크포인트 준수
2. **코드 품질**: ESLint, Prettier, TypeScript strict 모드
3. **접근성**: WCAG 가이드라인 준수
4. **성능**: Next.js 최적화 기능 활용 (Image, Font 등)
5. **데이터 페칭**: `useSuspenseQuery` 위주 사용, Suspense + Error Boundary 패턴

## 작업 후 필수 검사

코드 수정 후 **반드시** 다음 검사를 실행하세요:

```bash
# 1. FSD 아키텍처 검사
pnpm steiger

# 2. ESLint 검사
pnpm lint
```

IMPORTANT: 파일 수정(Edit, Write) 작업을 완료한 후에는 항상 `pnpm steiger`와 `pnpm lint`를 실행하여 아키텍처 및 코드 품질을 검증해야 합니다.

## 상세 가이드

필요시 아래 파일들을 참조하세요:

- @.claude/guides/architecture.md - FSD 아키텍처 구조
- @.claude/guides/coding-standards.md - TypeScript/React 코딩 표준
- @.claude/guides/responsive-design.md - 반응형 웹 디자인 가이드
- @.claude/guides/nextjs-patterns.md - Next.js App Router 패턴
- @.claude/guides/daisyui-guide.md - daisyUI 컴포넌트 사용법
- @.claude/guides/development.md - 개발 워크플로우

## 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 린팅
pnpm lint

# FSD 아키텍처 검사
pnpm steiger
```
