import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  // 코드 줄 수 계산
  const lines = code.split('\n');

  return (
    <div className="relative rounded-lg overflow-hidden border border-base-content/10">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-base-200 px-4 py-3 border-b border-base-content/10">
        <div className="flex items-center gap-3">
          {/* 언어 뱃지 */}
          <span className="badge badge-sm badge-primary">{language}</span>
          {title && <span className="text-sm font-medium text-base-content/80">{title}</span>}
        </div>

        {/* 복사 버튼 */}
        <CopyButton code={code} />
      </div>

      {/* 코드 영역 */}
      <div className="relative bg-base-300 overflow-x-auto">
        <pre className="p-4">
          <code className="text-sm font-mono text-base-content leading-relaxed block">
            {lines.map((line, index) => (
              <div key={`line-${index}-${line.substring(0, 10)}`} className="table-row">
                {/* 라인 넘버 */}
                <span className="table-cell pr-4 text-right select-none text-base-content/40 font-mono text-xs">
                  {index + 1}
                </span>
                {/* 코드 */}
                <span className="table-cell">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
