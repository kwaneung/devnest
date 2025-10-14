'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const components: Components = {
    code(props: React.ComponentPropsWithoutRef<'code'>) {
      const { children, ...rest } = props;

      // children에 줄바꿈이 있으면 코드 블록, 없으면 인라인 코드
      const hasLineBreak = String(children).includes('\n');
      const isInline = !hasLineBreak;

      // 인라인 코드는 기본 스타일 사용
      if (isInline) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-base-200" {...rest}>
            {children}
          </code>
        );
      }

      // 코드 블록은 mockup-code 스타일 사용
      const codeContent = String(children).replace(/\n$/, '');
      const lines = codeContent.split('\n');

      return (
        <div className="not-prose mockup-code overflow-x-auto">
          {lines.map((line, index) => (
            <pre key={`line-${index}`} data-prefix={index + 1}>
              <code>{line || ' '}</code>
            </pre>
          ))}
        </div>
      );
    },
  };

  return (
    <article className="not-prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
