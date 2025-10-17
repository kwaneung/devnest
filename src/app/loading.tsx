'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [show, setShow] = useState(false);
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    // 300ms 후에 로딩 표시 시작 (빠른 로딩은 표시 안 함)
    const delayTimer = setTimeout(() => {
      setShow(true);
    }, 300);

    // 표시되면 최소 800ms 유지
    const minDisplayTimer = setTimeout(() => {
      setForceShow(true);
    }, 300 + 800);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minDisplayTimer);
    };
  }, []);

  // 300ms 이내에 로딩이 끝나면 아무것도 표시 안 함
  if (!show && !forceShow) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-base-100 transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* 로딩 애니메이션 */}
        <div className="relative">
          {/* 외부 회전 링 */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-base-300 border-t-primary animate-spin"></div>

          {/* 내부 펄스 효과 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/20 animate-pulse"></div>
          </div>

          {/* 중앙 점 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
          </div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg md:text-xl font-semibold text-base-content">
            Loading
            <span className="inline-flex ml-1">
              <span className="animate-[bounce_1s_ease-in-out_0s_infinite]">.</span>
              <span className="animate-[bounce_1s_ease-in-out_0.2s_infinite]">.</span>
              <span className="animate-[bounce_1s_ease-in-out_0.4s_infinite]">.</span>
            </span>
          </p>
          <p className="text-sm text-base-content/60">잠시만 기다려주세요</p>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-48 md:w-64 h-1 bg-base-300 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary animate-[loading-progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
