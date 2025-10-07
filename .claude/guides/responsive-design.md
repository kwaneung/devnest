# 반응형 웹 디자인 가이드

## 핵심 원칙

1. **모바일 퍼스트**: 모든 디자인은 모바일부터 시작
2. **브레이크포인트 준수**: Tailwind CSS 표준 브레이크포인트만 사용
3. **접근성 우선**: 모든 디바이스에서 동등한 경험 제공

## Tailwind 브레이크포인트

| 접두사 | 최소 너비 | 디바이스      |
| ------ | --------- | ------------- |
| (기본) | 0px       | 모바일        |
| `sm:`  | 640px     | 태블릿 세로   |
| `md:`  | 768px     | 태블릿 가로   |
| `lg:`  | 1024px    | 데스크톱      |
| `xl:`  | 1280px    | 대형 데스크톱 |
| `2xl:` | 1536px    | 초대형 화면   |

## 필수 반응형 패턴

### 컨테이너

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">{/* 콘텐츠 */}</div>
```

### 그리드 레이아웃

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  {/* 그리드 아이템 */}
</div>
```

### 타이포그래피

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">제목</h1>
<p className="text-sm md:text-base lg:text-lg">본문</p>
```

### 간격 조정

```tsx
<div className="p-4 md:p-6 lg:p-8">
  <div className="space-y-4 md:space-y-6 lg:space-y-8">{/* 콘텐츠 */}</div>
</div>
```

### 네비게이션

```tsx
{
  /* 모바일: 햄버거 메뉴 */
}
<button className="lg:hidden">☰</button>;

{
  /* 데스크톱: 전체 메뉴 */
}
<nav className="hidden lg:flex">{/* 메뉴 항목 */}</nav>;
```

### 이미지

```tsx
// Next.js Image 컴포넌트 사용 필수
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="설명"
  width={800}
  height={600}
  className="w-full h-auto object-cover"
/>;
```

### 버튼

```tsx
<button className="btn btn-primary btn-sm md:btn-md lg:btn-lg">클릭</button>
```

## 검증 체크리스트

- [ ] Chrome, Firefox, Safari, Edge에서 테스트
- [ ] 개발자 도구 반응형 모드로 모든 브레이크포인트 확인
- [ ] Lighthouse 모바일 성능 점수 90+ 확인
- [ ] 터치 타겟 최소 44x44px 확인
- [ ] 가로/세로 모드 모두 테스트
