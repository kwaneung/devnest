const DesignSystemPage = () => {
  return (
    <div className="space-y-12">
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
              <div className="join join-vertical w-full">
                <label className="input join-item flex items-center gap-3">
                  <span className="w-24 text-sm text-base-content/70">이메일</span>
                  <input type="email" placeholder="이메일을 입력하세요" className="grow" />
                </label>
                <label className="input join-item flex items-center gap-3">
                  <span className="w-24 text-sm text-base-content/70">비밀번호</span>
                  <input type="password" placeholder="비밀번호를 입력하세요" className="grow" />
                </label>
                <label className="input join-item flex items-center gap-3">
                  <span className="w-24 text-sm text-base-content/70">메시지</span>
                  <input type="text" placeholder="메시지를 입력하세요" className="grow" />
                </label>
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
  );
};

export default DesignSystemPage;
