'use client';

import { useEffect, useEffectEvent, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  const updateYear = useEffectEvent(() => {
    setYear(new Date().getFullYear());
  });

  useEffect(() => {
    updateYear();
  }, []);

  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-10 mt-auto">
      <aside>
        <p className="font-bold text-lg">DevNest</p>
        <p className="text-sm max-w-md">
          프론트엔드 개발과 아키텍처에 대한 인사이트를 공유하는 개발 블로그입니다.
        </p>
        <p className="text-sm">© {year ?? '2025'} DevNest by 김관응. All rights reserved.</p>
      </aside>
    </footer>
  );
}
