import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '소개 | DevNest',
  description: 'DevNest 소개 페이지',
};

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-xl">소개</h1>
          <p className="text-sm">
            이 페이지는 DevNest 블로그의 간단한 소개입니다. 공개용 요약 정보만 제공합니다.
          </p>
          <div className="divider my-2"></div>
          <ul className="list">
            <li className="list-row">
              <span className="font-medium w-28">이름</span>
              <span className="flex items-center gap-3">
                <div className="avatar">
                  <div className="ring-primary ring-offset-base-100 size-10 rounded-full ring-2 ring-offset-2">
                    <Image
                      src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                      alt="김관응"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                김관응
              </span>
            </li>
            <li className="list-row">
              <span className="font-medium w-28">메일</span>
              <a href="mailto:kwaneung.kim@outlook.com" className="link">
                kwaneung.kim@outlook.com
              </a>
            </li>
          </ul>
          <div className="divider my-2"></div>
          <div>
            <h2 className="text-base font-semibold mb-2">기술 스택</h2>
            <div className="flex flex-wrap gap-2">
              <span className="badge">Next.js</span>
              <span className="badge">TypeScript</span>
              <span className="badge">React</span>
              <span className="badge">Tailwind CSS</span>
              <span className="badge">daisyUI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
