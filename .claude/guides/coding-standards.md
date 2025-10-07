# 코딩 표준

## TypeScript 설정

- **타겟**: ES2017
- **모듈**: ESM
- **엄격 모드**: 활성화
- **경로 별칭**: `@/*` → `./src/*`

## 코드 스타일

- **세미콜론**: 사용
- **따옴표**: 작은따옴표 (single quotes)
- **들여쓰기**: 2칸 공백
- **파일 확장자**:
  - `.tsx` - React 컴포넌트
  - `.ts` - 유틸리티/로직

## 네이밍 컨벤션

| 타입       | 컨벤션           | 예시           |
| ---------- | ---------------- | -------------- |
| 컴포넌트   | PascalCase       | `UserProfile`  |
| 인터페이스 | PascalCase       | `UserData`     |
| 타입 별칭  | PascalCase       | `ApiResponse`  |
| 함수/변수  | camelCase        | `getUserData`  |
| 상수       | UPPER_SNAKE_CASE | `API_BASE_URL` |

## React 규칙

- 함수형 컴포넌트 사용
- Props는 TypeScript 인터페이스로 정의
- 이벤트 핸들러는 `useCallback` 사용
- UI는 daisyUI 클래스 우선 사용

## ESLint 주요 규칙

- Import 자동 정렬 (카테고리별, 알파벳순)
- 사용하지 않는 import 자동 제거
- React Hooks 의존성 배열 검증
- 접근성(a11y) 검증 활성화
- 상대 경로 import 금지 (절대 경로 사용)

## Import 순서

```typescript
// 1. builtin
import { useState } from 'react';

// 2. external
import { useQuery } from '@tanstack/react-query';

// 3. internal (@/)
import { Button } from '@/shared/ui';
import { useAuth } from '@/features/auth';

// 4. relative (최소화)
import './styles.css';
```
