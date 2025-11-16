import Link from 'next/link';

import type { Snippet } from '@/types/snippet';
import { SUPPORTED_LANGUAGES } from '@/types/snippet';

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const formattedDate = new Date(snippet.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 언어 아이콘 찾기
  const languageInfo = SUPPORTED_LANGUAGES.find((lang) => lang.value === snippet.language);
  const languageIcon = languageInfo?.icon || '📄';
  const languageLabel = languageInfo?.label || snippet.language;

  // 코드 미리보기 (첫 3줄)
  const codePreview = snippet.code.split('\n').slice(0, 3).join('\n');

  return (
    <Link href={`/snippets/${snippet.id}`} className="group">
      <article className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-base-content/5 hover:border-primary/20 overflow-hidden">
        {/* 상단 색상 바 - 언어별 색상 */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>

        <div className="card-body gap-4">
          {/* 제목 & 언어 */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="card-title text-lg line-clamp-2 group-hover:text-primary transition-colors flex-1">
              {snippet.title}
            </h2>
            <div className="flex items-center gap-1.5 text-sm font-medium text-base-content/70 shrink-0">
              <span className="text-xl">{languageIcon}</span>
              <span className="hidden sm:inline">{languageLabel}</span>
            </div>
          </div>

          {/* 설명 */}
          {snippet.description && (
            <p className="text-sm text-base-content/70 line-clamp-2 leading-relaxed">
              {snippet.description}
            </p>
          )}

          {/* 코드 미리보기 */}
          <div className="bg-base-200 rounded-lg p-3 overflow-hidden">
            <pre className="text-xs font-mono text-base-content/80 line-clamp-3 overflow-hidden">
              {codePreview}
            </pre>
          </div>

          {/* 태그 */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {snippet.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="badge badge-sm badge-ghost hover:badge-primary transition-colors"
                >
                  {tag}
                </span>
              ))}
              {snippet.tags.length > 3 && (
                <span className="badge badge-sm badge-ghost">+{snippet.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* 하단 메타 정보 */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-base-content/5">
            <div className="flex items-center gap-3 text-xs text-base-content/60">
              {/* 저자 */}
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">{snippet.author}</span>
              </div>

              {/* 날짜 */}
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* 언어 (모바일) */}
            <div className="flex items-center gap-1 text-xs text-base-content/60 sm:hidden">
              <span className="font-medium">{languageLabel}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
