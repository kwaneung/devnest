'use client';

import { useEffect } from 'react';

const DesignSystemPage = () => {
  useEffect(() => {
    // 테마 동기화 함수
    const syncTheme = () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');

      // 라디오 버튼 동기화
      const lightRadio = document.querySelector('input[value="modern-light"]') as HTMLInputElement;
      const darkRadio = document.querySelector('input[value="modern-dark"]') as HTMLInputElement;

      // 토글 버튼 동기화
      const toggleCheckbox = document.querySelector(
        'input[type="checkbox"].theme-controller',
      ) as HTMLInputElement;

      if (currentTheme === 'modern-dark') {
        if (darkRadio) darkRadio.checked = true;
        if (toggleCheckbox) toggleCheckbox.checked = true;
      } else {
        if (lightRadio) lightRadio.checked = true;
        if (toggleCheckbox) toggleCheckbox.checked = false;
      }
    };

    // 초기 동기화
    syncTheme();

    // 테마 변경 감지
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // 라디오 버튼 이벤트 리스너
    const lightRadio = document.querySelector('input[value="modern-light"]') as HTMLInputElement;
    const darkRadio = document.querySelector('input[value="modern-dark"]') as HTMLInputElement;

    const handleRadioChange = () => {
      const toggleCheckbox = document.querySelector(
        'input[type="checkbox"].theme-controller',
      ) as HTMLInputElement;
      if (toggleCheckbox) {
        toggleCheckbox.checked = darkRadio?.checked || false;
      }
    };

    if (lightRadio) lightRadio.addEventListener('change', handleRadioChange);
    if (darkRadio) darkRadio.addEventListener('change', handleRadioChange);

    // 토글 버튼 이벤트 리스너
    const toggleCheckbox = document.querySelector(
      'input[type="checkbox"].theme-controller',
    ) as HTMLInputElement;
    const handleToggleChange = () => {
      if (toggleCheckbox) {
        if (toggleCheckbox.checked) {
          if (darkRadio) darkRadio.checked = true;
        } else {
          if (lightRadio) lightRadio.checked = true;
        }
      }
    };

    if (toggleCheckbox) toggleCheckbox.addEventListener('change', handleToggleChange);

    // 클린업
    return () => {
      observer.disconnect();
      if (lightRadio) lightRadio.removeEventListener('change', handleRadioChange);
      if (darkRadio) darkRadio.removeEventListener('change', handleRadioChange);
      if (toggleCheckbox) toggleCheckbox.removeEventListener('change', handleToggleChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Header */}
      <div className="navbar bg-base-200 shadow-lg">
        <div className="navbar-start">
          <h1 className="text-xl font-bold">Modern Design System</h1>
        </div>
        <div className="navbar-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden sm:inline">테마:</span>
            <div className="join">
              <input
                type="radio"
                name="theme-options"
                value="modern-light"
                className="theme-controller join-item btn btn-sm"
                aria-label="라이트 모드"
                defaultChecked
              />
              <input
                type="radio"
                name="theme-options"
                value="modern-dark"
                className="theme-controller join-item btn btn-sm"
                aria-label="다크 모드"
              />
            </div>
            <label className="swap swap-rotate btn btn-ghost btn-sm">
              <input type="checkbox" className="theme-controller" value="modern-dark" />
              <svg
                className="swap-off h-5 w-5 fill-base-content"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
              <svg
                className="swap-on h-5 w-5 fill-base-content"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="hero bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Modern Theme</h1>
              <p className="py-6">
                깊은 블루, 세련된 그레이, 그리고 액센트 컬러로 구성된 모던한 daisyUI 5 테마입니다.
              </p>
              <button className="btn btn-primary">시작하기</button>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">색상 팔레트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-primary text-primary-content">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Primary</h3>
                <p>깊은 모던 블루</p>
              </div>
            </div>
            <div className="card bg-secondary text-secondary-content">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Secondary</h3>
                <p>세련된 퍼플</p>
              </div>
            </div>
            <div className="card bg-accent text-accent-content">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Accent</h3>
                <p>활기찬 틸</p>
              </div>
            </div>
            <div className="card bg-neutral text-neutral-content">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Neutral</h3>
                <p>전문적인 그레이</p>
              </div>
            </div>
          </div>
        </div>

        {/* Components Showcase */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">컴포넌트 예시</h2>

          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">버튼</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-accent">Accent</button>
              <button className="btn btn-neutral">Neutral</button>
              <button className="btn btn-outline">Outline</button>
              <button className="btn btn-ghost">Ghost</button>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">카드</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">기본 카드</h2>
                  <p>모던한 디자인의 기본 카드입니다.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">자세히</button>
                  </div>
                </div>
              </div>
              <div className="card bg-primary text-primary-content shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Primary 카드</h2>
                  <p>Primary 색상을 사용한 카드입니다.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-secondary btn-sm">액션</button>
                  </div>
                </div>
              </div>
              <div className="card bg-accent text-accent-content shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Accent 카드</h2>
                  <p>Accent 색상을 사용한 카드입니다.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">확인</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">알림</h3>
            <div className="space-y-2">
              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>정보 메시지입니다.</span>
              </div>
              <div className="alert alert-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>성공 메시지입니다!</span>
              </div>
              <div className="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>경고 메시지입니다.</span>
              </div>
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>오류 메시지입니다.</span>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">폼 요소</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">이메일</span>
                  </label>
                  <input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">비밀번호</span>
                  </label>
                  <input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">메시지</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder="메시지를 입력하세요"
                  ></textarea>
                </div>
              </div>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">체크박스</span>
                    <input type="checkbox" className="checkbox checkbox-primary" />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">토글</span>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">범위</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="40"
                    className="range range-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemPage;
