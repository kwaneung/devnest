# daisyUI 컴포넌트 가이드

## 기본 원칙

1. daisyUI 제공 클래스 우선 사용
2. Tailwind 유틸리티로 커스터마이징
3. 프로젝트 전체에서 일관된 패턴 유지

## 현재 프로젝트 테마

- **라이트 모드**: `modern-light`
- **다크 모드**: `modern-dark`
- **테마 전환**: `data-theme` 속성 사용

## 주요 컴포넌트

### 버튼

```tsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-outline">Outline</button>

{/* 반응형 크기 */}
<button className="btn btn-sm md:btn-md lg:btn-lg">Responsive</button>
```

### 카드

```tsx
<div className="card w-full max-w-sm md:max-w-md lg:max-w-lg bg-base-100 shadow-xl">
  <div className="card-body p-4 md:p-6">
    <h2 className="card-title text-lg md:text-xl">Card Title</h2>
    <p className="text-sm md:text-base">Card content</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary btn-sm">Action</button>
    </div>
  </div>
</div>
```

### 입력 필드

```tsx
<label className="input input-bordered flex items-center gap-2">
  <input type="text" className="grow" placeholder="Search" />
  <svg>...</svg>
</label>

<input type="text" className="input input-bordered w-full max-w-xs" />
<input type="text" className="input input-primary" />
```

### 네비게이션 바

```tsx
<div className="navbar bg-base-100">
  <div className="navbar-start">
    <a className="btn btn-ghost text-xl">Logo</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <li>
        <a>Item 1</a>
      </li>
      <li>
        <a>Item 2</a>
      </li>
    </ul>
  </div>
  <div className="navbar-end">
    <a className="btn">Button</a>
  </div>
</div>
```

### 드로어 (모바일 사이드바)

```tsx
<div className="drawer">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
      Open drawer
    </label>
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer" className="drawer-overlay"></label>
    <ul className="menu p-4 w-80 min-h-full bg-base-200">
      <li>
        <a>Sidebar Item 1</a>
      </li>
      <li>
        <a>Sidebar Item 2</a>
      </li>
    </ul>
  </div>
</div>
```

### 알림 (Alert)

```tsx
<div className="alert alert-info">
  <svg>...</svg>
  <span>Info message</span>
</div>
<div className="alert alert-success">Success message</div>
<div className="alert alert-warning">Warning message</div>
<div className="alert alert-error">Error message</div>
```

### 폼 컨트롤

```tsx
{
  /* 체크박스 */
}
<input type="checkbox" className="checkbox checkbox-primary" />;

{
  /* 토글 */
}
<input type="checkbox" className="toggle toggle-primary" />;

{
  /* 라디오 */
}
<input type="radio" name="radio" className="radio radio-primary" />;

{
  /* 범위 */
}
<input type="range" className="range range-primary" />;
```

### 모달

```tsx
<dialog id="my-modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Modal Title</h3>
    <p className="py-4">Modal content</p>
    <div className="modal-action">
      <form method="dialog">
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>;

{
  /* 모달 열기 */
}
<button onClick={() => document.getElementById('my-modal').showModal()}>Open Modal</button>;
```

## 테마 전환

```tsx
'use client';

export function ThemeToggle() {
  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'modern-light' ? 'modern-dark' : 'modern-light';
    html.setAttribute('data-theme', next);
  };

  return (
    <label className="swap swap-rotate">
      <input type="checkbox" onChange={toggleTheme} />
      <svg className="swap-on">☀️</svg>
      <svg className="swap-off">🌙</svg>
    </label>
  );
}
```

## 색상 시스템

- `bg-base-100` - 기본 배경
- `bg-base-200` - 보조 배경
- `bg-base-300` - 테두리/구분선
- `text-base-content` - 기본 텍스트
- `bg-primary` / `text-primary-content` - 주요 색상
- `bg-secondary` / `text-secondary-content` - 보조 색상
- `bg-accent` / `text-accent-content` - 강조 색상
