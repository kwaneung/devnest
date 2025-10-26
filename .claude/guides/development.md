# 개발 워크플로우

## 패키지 관리 (pnpm)

```bash
# 의존성 설치
pnpm install

# 패키지 추가
pnpm add <package>
pnpm add -D <package>  # devDependencies

# 패키지 제거
pnpm remove <package>

# 의존성 업데이트
pnpm update
```

## 개발 서버

```bash
# 개발 모드 (Turbopack)
pnpm dev

# 빌드 (프로덕션)
pnpm build

# 프로덕션 서버
pnpm start

# 포트 변경
pnpm dev -- -p 3001
```

## 코드 품질

```bash
# Prettier 포맷팅 및 자동 수정
pnpm format

# Prettier, ESLint 및 TypeScript 검사
pnpm check

# ESLint 실행
pnpm lint

# ESLint 자동 수정
pnpm lint --fix
```

## Git 워크플로우

### Pre-commit Hook (자동 실행)

- Prettier 자동 포맷팅
- ESLint 자동 수정
- TypeScript 타입 검사

### 커밋 메시지 (Conventional Commits)

```bash
# 기능 추가
git commit -m "feat: 새로운 기능 추가"

# 버그 수정
git commit -m "fix: 버그 수정"

# 문서 업데이트
git commit -m "docs: 문서 업데이트"

# 스타일 변경 (코드 동작 변경 없음)
git commit -m "style: 코드 포맷팅"

# 리팩토링
git commit -m "refactor: 코드 리팩토링"

# 성능 개선
git commit -m "perf: 성능 개선"

# 테스트
git commit -m "test: 테스트 추가"

# 빌드/설정
git commit -m "chore: 빌드 설정 변경"
```

## 반응형 테스트

### 브라우저 개발자 도구

1. F12 또는 Cmd+Opt+I
2. Toggle device toolbar (Cmd+Shift+M)
3. 다양한 디바이스 프리셋 테스트

### 테스트해야 할 브레이크포인트

- [ ] 360px (모바일 S)
- [ ] 375px (모바일 M)
- [ ] 414px (모바일 L)
- [ ] 640px (태블릿 세로)
- [ ] 768px (태블릿 가로)
- [ ] 1024px (데스크톱)
- [ ] 1440px (대형 데스크톱)

### Lighthouse 성능 검사

```bash
# Chrome DevTools > Lighthouse
# - Performance
# - Accessibility
# - Best Practices
# - SEO

목표: 모든 항목 90+ 점수
```

## 라이브러리 추천

### 필요시 추가할 라이브러리

```bash
# 상태 관리
pnpm add zustand
pnpm add jotai

# 데이터 페칭
pnpm add @tanstack/react-query
pnpm add axios

# 폼 관리
pnpm add react-hook-form
pnpm add zod  # 유효성 검사
pnpm add @hookform/resolvers

# UI 컴포넌트
pnpm add @headlessui/react
pnpm add @radix-ui/react-*

# 아이콘
pnpm add lucide-react
pnpm add @heroicons/react

# 애니메이션
pnpm add framer-motion

# 유틸리티
pnpm add clsx  # 클래스명 조합
pnpm add date-fns  # 날짜 처리
```

## IDE 설정 (VSCode)

### 권장 확장

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### 워크스페이스 설정

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]]
}
```
