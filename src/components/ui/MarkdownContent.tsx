'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  const components: Components = {
    // 제목 스타일링
    h1(props: React.ComponentPropsWithoutRef<'h1'>) {
      const { children, className: h1ClassName, ...rest } = props;
      return (
        <h1
          className={cn(
            'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
            'mt-8 mb-4',
            h1ClassName,
          )}
          {...rest}
        >
          {children}
        </h1>
      );
    },
    h2(props: React.ComponentPropsWithoutRef<'h2'>) {
      const { children, className: h2ClassName, ...rest } = props;
      return (
        <h2
          className={cn(
            'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight',
            'mt-10 mb-4 first:mt-0',
            h2ClassName,
          )}
          {...rest}
        >
          {children}
        </h2>
      );
    },
    h3(props: React.ComponentPropsWithoutRef<'h3'>) {
      const { children, className: h3ClassName, ...rest } = props;
      return (
        <h3
          className={cn(
            'scroll-m-20 text-2xl font-semibold tracking-tight',
            'mt-8 mb-4',
            h3ClassName,
          )}
          {...rest}
        >
          {children}
        </h3>
      );
    },
    h4(props: React.ComponentPropsWithoutRef<'h4'>) {
      const { children, className: h4ClassName, ...rest } = props;
      return (
        <h4
          className={cn(
            'scroll-m-20 text-xl font-semibold tracking-tight',
            'mt-6 mb-2',
            h4ClassName,
          )}
          {...rest}
        >
          {children}
        </h4>
      );
    },
    // 문단
    p(props: React.ComponentPropsWithoutRef<'p'>) {
      const { children, className: pClassName, ...rest } = props;
      return (
        <p className={cn('leading-7 [&:not(:first-child)]:mt-6', pClassName)} {...rest}>
          {children}
        </p>
      );
    },
    // 리스트
    ul(props: React.ComponentPropsWithoutRef<'ul'>) {
      const { children, className: ulClassName, ...rest } = props;
      return (
        <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', ulClassName)} {...rest}>
          {children}
        </ul>
      );
    },
    ol(props: React.ComponentPropsWithoutRef<'ol'>) {
      const { children, className: olClassName, ...rest } = props;
      return (
        <ol className={cn('my-6 ml-6 list-decimal [&>li]:mt-2', olClassName)} {...rest}>
          {children}
        </ol>
      );
    },
    li(props: React.ComponentPropsWithoutRef<'li'>) {
      const { children, className: liClassName, ...rest } = props;
      return (
        <li className={cn('leading-7', liClassName)} {...rest}>
          {children}
        </li>
      );
    },
    // 코드
    pre(props: React.ComponentPropsWithoutRef<'pre'>) {
      const { children, className: preClassName, ...rest } = props;
      return (
        <pre
          className={cn(
            'overflow-x-auto rounded-lg border bg-muted/50 p-4 my-6',
            'font-mono text-sm',
            'not-prose',
            preClassName,
          )}
          {...rest}
        >
          {children}
        </pre>
      );
    },
    code(props: React.ComponentPropsWithoutRef<'code'>) {
      const { children, className: codeClassName, ...rest } = props;

      // className으로 언어 정보가 있으면 코드 블록, 없으면 인라인 코드
      const isCodeBlock = codeClassName?.startsWith('language-');

      // 인라인 코드
      if (!isCodeBlock) {
        return (
          <code
            className={cn(
              'relative rounded bg-muted px-[0.3rem] py-[0.2rem]',
              'font-mono text-sm',
              codeClassName,
            )}
            {...rest}
          >
            {children}
          </code>
        );
      }

      // 코드 블록 (pre > code)
      return (
        <code className={cn('font-mono text-sm leading-relaxed', codeClassName)} {...rest}>
          {children}
        </code>
      );
    },
    // 링크 스타일링
    a(props: React.ComponentPropsWithoutRef<'a'>) {
      const { children, className: linkClassName, ...rest } = props;
      return (
        <a
          className={cn(
            'font-medium text-primary underline underline-offset-4',
            'hover:text-primary/80 transition-colors',
            linkClassName,
          )}
          {...rest}
        >
          {children}
        </a>
      );
    },
    // 인용구 스타일링
    blockquote(props: React.ComponentPropsWithoutRef<'blockquote'>) {
      const { children, className: blockquoteClassName, ...rest } = props;
      return (
        <blockquote
          className={cn(
            'mt-6 border-l-4 border-primary/40 pl-6 italic',
            'text-muted-foreground',
            blockquoteClassName,
          )}
          {...rest}
        >
          {children}
        </blockquote>
      );
    },
    // 수평선
    hr(props: React.ComponentPropsWithoutRef<'hr'>) {
      const { className: hrClassName, ...rest } = props;
      return <hr className={cn('my-8 border-border', hrClassName)} {...rest} />;
    },
    // 강조
    strong(props: React.ComponentPropsWithoutRef<'strong'>) {
      const { children, className: strongClassName, ...rest } = props;
      return (
        <strong className={cn('font-bold', strongClassName)} {...rest}>
          {children}
        </strong>
      );
    },
    // 테이블 스타일링
    table(props: React.ComponentPropsWithoutRef<'table'>) {
      const { children, className: tableClassName, ...rest } = props;
      return (
        <div className="my-8 w-full overflow-x-auto">
          <table
            className={cn('w-full border-collapse border border-border', 'text-sm', tableClassName)}
            {...rest}
          >
            {children}
          </table>
        </div>
      );
    },
    th(props: React.ComponentPropsWithoutRef<'th'>) {
      const { children, className: thClassName, ...rest } = props;
      return (
        <th
          className={cn(
            'border border-border bg-muted px-4 py-3',
            'text-left font-semibold',
            thClassName,
          )}
          {...rest}
        >
          {children}
        </th>
      );
    },
    td(props: React.ComponentPropsWithoutRef<'td'>) {
      const { children, className: tdClassName, ...rest } = props;
      return (
        <td className={cn('border border-border px-4 py-3', tdClassName)} {...rest}>
          {children}
        </td>
      );
    },
  };

  return (
    <div
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        // prose 기본 스타일 재정의
        'prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-p:text-foreground prose-p:leading-7',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-code:text-foreground prose-code:bg-muted prose-code:rounded',
        'prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border',
        'prose-blockquote:text-muted-foreground prose-blockquote:border-primary/40',
        'prose-li:text-foreground',
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
