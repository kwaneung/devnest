import { describe, expect, it } from 'vitest';

import {
  type GetSnippetsParams,
  GetSnippetsParamsSchema,
  SNIPPET_DESCRIPTION_MAX_LENGTH,
  SNIPPET_TITLE_MAX_LENGTH,
  SUPPORTED_LANGUAGES,
  type Snippet,
  type SnippetRow,
  SnippetSchema,
  mapSnippetRowToSnippet,
} from './snippet';

describe('SnippetSchema', () => {
  const validSnippet: SnippetRow = {
    id: 1,
    title: 'React useState Hook',
    description: 'React 함수형 컴포넌트에서 상태를 관리하는 기본 훅',
    code: "import { useState } from 'react';\n\nconst [count, setCount] = useState(0);",
    language: 'typescript',
    author: 'DevNest',
    tags: ['React', 'Hooks', 'State'],
    status: 'Published',
    created_at: '2025-10-31T09:00:00+00:00',
    updated_at: '2025-10-31T09:00:00+00:00',
  };

  describe('유효한 데이터 검증', () => {
    it('유효한 Snippet 데이터를 통과시켜야 한다', () => {
      const result = SnippetSchema.safeParse(validSnippet);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validSnippet);
      }
    });

    it('description이 없어도 허용해야 한다', () => {
      const snippetWithoutDescription = { ...validSnippet, description: undefined };
      const result = SnippetSchema.safeParse(snippetWithoutDescription);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBeUndefined();
      }
    });

    it('tags가 없으면 빈 배열을 기본값으로 설정해야 한다', () => {
      const snippetWithoutTags = { ...validSnippet, tags: undefined };
      const result = SnippetSchema.parse(snippetWithoutTags);

      expect(result.tags).toEqual([]);
    });
  });

  describe('제목 검증', () => {
    it('빈 제목을 거부해야 한다', () => {
      const invalidSnippet = { ...validSnippet, title: '' };
      const result = SnippetSchema.safeParse(invalidSnippet);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('제목은 필수입니다');
      }
    });

    it('200자를 초과하는 제목을 거부해야 한다', () => {
      const longTitle = 'a'.repeat(201);
      const invalidSnippet = { ...validSnippet, title: longTitle };
      const result = SnippetSchema.safeParse(invalidSnippet);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('200자를 초과할 수 없습니다');
      }
    });

    it('정확히 200자인 제목을 허용해야 한다', () => {
      const maxTitle = 'a'.repeat(200);
      const snippetWithMaxTitle = { ...validSnippet, title: maxTitle };
      const result = SnippetSchema.safeParse(snippetWithMaxTitle);

      expect(result.success).toBe(true);
    });
  });

  describe('설명 검증', () => {
    it('500자를 초과하는 설명을 거부해야 한다', () => {
      const longDescription = 'a'.repeat(501);
      const invalidSnippet = { ...validSnippet, description: longDescription };
      const result = SnippetSchema.safeParse(invalidSnippet);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500자를 초과할 수 없습니다');
      }
    });

    it('정확히 500자인 설명을 허용해야 한다', () => {
      const maxDescription = 'a'.repeat(500);
      const snippetWithMaxDescription = { ...validSnippet, description: maxDescription };
      const result = SnippetSchema.safeParse(snippetWithMaxDescription);

      expect(result.success).toBe(true);
    });
  });

  describe('코드 검증', () => {
    it('빈 코드를 거부해야 한다', () => {
      const invalidSnippet = { ...validSnippet, code: '' };
      const result = SnippetSchema.safeParse(invalidSnippet);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('코드는 필수입니다');
      }
    });

    it('유효한 코드를 허용해야 한다', () => {
      const validCodes = [
        'console.log("Hello");',
        'const x = 1;',
        'function foo() {\n  return "bar";\n}',
      ];

      validCodes.forEach((code) => {
        const snippet = { ...validSnippet, code };
        const result = SnippetSchema.safeParse(snippet);

        expect(result.success).toBe(true);
      });
    });
  });

  describe('언어 검증', () => {
    it('빈 언어를 거부해야 한다', () => {
      const invalidSnippet = { ...validSnippet, language: '' };
      const result = SnippetSchema.safeParse(invalidSnippet);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('언어는 필수입니다');
      }
    });

    it('유효한 언어를 허용해야 한다', () => {
      const validLanguages = ['typescript', 'javascript', 'python', 'go', 'rust', 'sql'];

      validLanguages.forEach((language) => {
        const snippet = { ...validSnippet, language };
        const result = SnippetSchema.safeParse(snippet);

        expect(result.success).toBe(true);
      });
    });
  });

  describe('날짜 검증', () => {
    it('유효한 ISO 8601 날짜를 허용해야 한다', () => {
      const validDates = [
        '2025-10-31T09:00:00+00:00',
        '2025-10-31T09:00:00+09:00',
        '2025-10-31T09:00:00.000Z',
      ];

      validDates.forEach((date) => {
        const snippet = { ...validSnippet, created_at: date, updated_at: date };
        const result = SnippetSchema.safeParse(snippet);

        expect(result.success).toBe(true);
      });
    });

    it('잘못된 날짜 형식을 거부해야 한다', () => {
      const invalidDates = ['2025-10-31', '2025/10/31', 'invalid-date'];

      invalidDates.forEach((date) => {
        const snippet = { ...validSnippet, created_at: date };
        const result = SnippetSchema.safeParse(snippet);

        expect(result.success).toBe(false);
      });
    });
  });

  describe('status 검증', () => {
    it('Published 상태를 허용해야 한다', () => {
      const publishedSnippet = { ...validSnippet, status: 'Published' as const };
      const result = SnippetSchema.safeParse(publishedSnippet);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('Published');
      }
    });

    it('Draft 상태를 허용해야 한다', () => {
      const draftSnippet = { ...validSnippet, status: 'Draft' as const };
      const result = SnippetSchema.safeParse(draftSnippet);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('Draft');
      }
    });

    it('Archived 상태를 허용해야 한다', () => {
      const archivedSnippet = { ...validSnippet, status: 'Archived' as const };
      const result = SnippetSchema.safeParse(archivedSnippet);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('Archived');
      }
    });

    it('잘못된 status 값을 거부해야 한다', () => {
      const invalidStatuses = ['published', 'draft', 'archived', 'Pending', 'Active', ''];

      invalidStatuses.forEach((status) => {
        const invalidSnippet = { ...validSnippet, status };
        const result = SnippetSchema.safeParse(invalidSnippet);

        expect(result.success).toBe(false);
      });
    });

    it('status가 없으면 기본값 Published를 설정해야 한다', () => {
      const snippetWithoutStatus = { ...validSnippet, status: undefined };
      const result = SnippetSchema.parse(snippetWithoutStatus);

      expect(result.status).toBe('Published');
    });
  });
});

describe('mapSnippetRowToSnippet', () => {
  it('snake_case를 camelCase로 변환해야 한다', () => {
    const row: SnippetRow = {
      id: 1,
      title: 'useState Hook',
      description: 'React hook',
      code: 'const [state] = useState();',
      language: 'typescript',
      author: 'DevNest',
      tags: ['React'],
      status: 'Published',
      created_at: '2025-10-31T09:00:00+00:00',
      updated_at: '2025-10-31T09:00:00+00:00',
    };

    const expected: Snippet = {
      id: 1,
      title: 'useState Hook',
      description: 'React hook',
      code: 'const [state] = useState();',
      language: 'typescript',
      author: 'DevNest',
      tags: ['React'],
      status: 'Published',
      createdAt: '2025-10-31T09:00:00+00:00',
      updatedAt: '2025-10-31T09:00:00+00:00',
    };

    const result = mapSnippetRowToSnippet(row);

    expect(result).toEqual(expected);
  });

  it('날짜를 ISO 8601 문자열로 유지해야 한다', () => {
    const row: SnippetRow = {
      id: 1,
      title: 'Test',
      code: 'test',
      language: 'typescript',
      author: 'DevNest',
      tags: [],
      status: 'Published',
      created_at: '2025-10-31T09:00:00+09:00',
      updated_at: '2025-10-31T09:00:00+09:00',
    };

    const result = mapSnippetRowToSnippet(row);

    expect(result.createdAt).toBe('2025-10-31T09:00:00+09:00');
    expect(result.updatedAt).toBe('2025-10-31T09:00:00+09:00');
    expect(typeof result.createdAt).toBe('string');
    expect(typeof result.updatedAt).toBe('string');
  });

  it('description이 없어도 변환해야 한다', () => {
    const row: SnippetRow = {
      id: 1,
      title: 'Test',
      description: undefined,
      code: 'test',
      language: 'typescript',
      author: 'DevNest',
      tags: [],
      status: 'Published',
      created_at: '2025-10-31T09:00:00+00:00',
      updated_at: '2025-10-31T09:00:00+00:00',
    };

    const result = mapSnippetRowToSnippet(row);

    expect(result.description).toBeUndefined();
  });
});

describe('GetSnippetsParamsSchema', () => {
  it('유효한 파라미터를 통과시켜야 한다', () => {
    const validParams: GetSnippetsParams = {
      language: 'typescript',
      tag: 'react',
      limit: 10,
    };

    const result = GetSnippetsParamsSchema.safeParse(validParams);

    expect(result.success).toBe(true);
  });

  it('language만 있어도 허용해야 한다', () => {
    const params = { language: 'python' };
    const result = GetSnippetsParamsSchema.safeParse(params);

    expect(result.success).toBe(true);
  });

  it('tag만 있어도 허용해야 한다', () => {
    const params = { tag: 'hooks' };
    const result = GetSnippetsParamsSchema.safeParse(params);

    expect(result.success).toBe(true);
  });

  it('limit만 있어도 허용해야 한다', () => {
    const params = { limit: 20 };
    const result = GetSnippetsParamsSchema.safeParse(params);

    expect(result.success).toBe(true);
  });

  it('파라미터가 undefined여도 허용해야 한다', () => {
    const result = GetSnippetsParamsSchema.safeParse(undefined);

    expect(result.success).toBe(true);
  });

  it('음수 limit을 거부해야 한다', () => {
    const params = { limit: -1 };
    const result = GetSnippetsParamsSchema.safeParse(params);

    expect(result.success).toBe(false);
  });

  it('0 limit을 거부해야 한다', () => {
    const params = { limit: 0 };
    const result = GetSnippetsParamsSchema.safeParse(params);

    expect(result.success).toBe(false);
  });
});

describe('SNIPPET 상수', () => {
  it('SNIPPET_TITLE_MAX_LENGTH는 200이어야 한다', () => {
    expect(SNIPPET_TITLE_MAX_LENGTH).toBe(200);
  });

  it('SNIPPET_DESCRIPTION_MAX_LENGTH는 500이어야 한다', () => {
    expect(SNIPPET_DESCRIPTION_MAX_LENGTH).toBe(500);
  });

  it('SUPPORTED_LANGUAGES는 12개 이상의 언어를 포함해야 한다', () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(12);
  });

  it('SUPPORTED_LANGUAGES는 필수 언어를 포함해야 한다', () => {
    const languages = SUPPORTED_LANGUAGES.map((lang) => lang.value);

    expect(languages).toContain('typescript');
    expect(languages).toContain('javascript');
    expect(languages).toContain('python');
    expect(languages).toContain('go');
    expect(languages).toContain('rust');
  });

  it('각 언어는 value, label, icon을 가져야 한다', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(lang).toHaveProperty('value');
      expect(lang).toHaveProperty('label');
      expect(lang).toHaveProperty('icon');
      expect(typeof lang.value).toBe('string');
      expect(typeof lang.label).toBe('string');
      expect(typeof lang.icon).toBe('string');
    });
  });
});
