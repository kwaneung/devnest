import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-base-100 via-base-200 to-base-100 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative avatar">
                <div className="w-32 h-32 rounded-full ring-4 ring-base-100 shadow-2xl">
                  <Image
                    src="/dev-jeans-kt.png"
                    alt="김관응"
                    width={128}
                    height={128}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                김관응
              </h1>
              <p className="text-xl md:text-2xl text-base-content/80 font-medium">
                Frontend Developer
              </p>
              <p className="text-base text-base-content/60 max-w-2xl mx-auto leading-relaxed">
                프론트엔드 개발과 아키텍처에 관심이 많은 개발자입니다.
                <br />
                배운 것을 기록하고 공유하며 함께 성장하는 것을 좋아합니다.
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="mailto:kwaneung.kim@outlook.com" className="btn btn-primary gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary gap-2"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent gap-2"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Stats */}
        <section className="stats stats-vertical lg:stats-horizontal shadow-lg w-full">
          <div className="stat place-items-center">
            <div className="stat-title">작성한 글</div>
            <div className="stat-value">5</div>
            <div className="stat-desc">지속적으로 기록 중</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">총 조회수</div>
            <div className="stat-value">3.6K</div>
            <div className="stat-desc">감사합니다</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">기술 스택</div>
            <div className="stat-value">5+</div>
            <div className="stat-desc">계속 학습 중</div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">기술 스택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frontend */}
            <div className="card bg-base-100 shadow-xl border border-base-content/5">
              <div className="card-body">
                <h3 className="card-title">Frontend</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="badge badge-lg badge-primary">Next.js</span>
                  <span className="badge badge-lg badge-primary">React</span>
                  <span className="badge badge-lg badge-primary">TypeScript</span>
                  <span className="badge badge-lg badge-primary">Tanstack Query</span>
                  <span className="badge badge-lg badge-secondary">Tailwind CSS</span>
                  <span className="badge badge-lg badge-secondary">daisyUI</span>
                  <span className="badge badge-lg badge-secondary">Shadcn</span>
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="card bg-base-100 shadow-xl border border-base-content/5">
              <div className="card-body">
                <h3 className="card-title">Tools & Others</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="badge badge-lg badge-accent">Git</span>
                  <span className="badge badge-lg badge-accent">Cursor</span>
                  <span className="badge badge-lg badge-accent">Claude Code</span>
                  <span className="badge badge-lg badge-accent">Figma</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border border-base-content/5">
          <div className="card-body space-y-6">
            <h2 className="card-title text-3xl">About Me</h2>
            <div className="space-y-4 text-base-content/80 leading-relaxed">
              <p>안녕하세요, 프론트엔드 개발자 김관응입니다.</p>
              <p>
                사용자 경험을 개선하고 아름다운 인터페이스를 만드는 것에 관심이 많습니다. 최신 기술
                트렌드를 학습하고 이를 실제 프로젝트에 적용하는 것을 즐깁니다.
              </p>
              <p>
                이 블로그는 개발하면서 배운 것들을 정리하고, 다른 개발자들과 지식을 공유하기 위해
                만들었습니다.
              </p>
            </div>

            <div className="divider"></div>

            <div className="flex flex-wrap gap-3">
              <Link href="/posts" className="btn btn-primary">
                글 보러가기
              </Link>
              <a href="mailto:kwaneung.kim@outlook.com" className="btn btn-secondary">
                문의하기
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
