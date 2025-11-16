'use server';

import { cacheTag } from 'next/cache';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { getCurrentKST } from '@/lib/date';
import type { Snippet, GetSnippetsParams, SnippetsStats } from '@/types/snippet';
import { SnippetSchema, mapSnippetRowToSnippet } from '@/types/snippet';

// ==================== Queries (조회) ====================

/**
 * 스니펫 목록을 가져오는 Server Action
 *
 * @param params - 언어, 태그, 제한 파라미터
 * @returns 스니펫 배열
 */
export async function getSnippets(params?: GetSnippetsParams): Promise<Snippet[]> {
  'use cache';
  cacheTag('snippets');

  console.log(`[getSnippets] 🔥 use cache - DB 호출:`, getCurrentKST(), {
    language: params?.language,
    tag: params?.tag,
    limit: params?.limit,
  });

  const { language, tag, limit } = params || {};

  // Supabase 쿼리 빌더
  let query = supabase.from('snippets').select('*');

  // 언어 필터링
  if (language) {
    query = query.eq('language', language);
  }

  // 태그 필터링 (배열 포함 검색)
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // 최신순 정렬 (기본)
  query = query.order('created_at', { ascending: false });

  // limit 적용
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch snippets: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Zod로 런타임 검증
  const validatedData = z.array(SnippetSchema).parse(data);

  // snake_case -> camelCase 변환
  return validatedData.map(mapSnippetRowToSnippet);
}

/**
 * 특정 스니펫 상세 정보를 가져오는 Server Action
 *
 * @param id - 스니펫 ID
 * @returns 스니펫 상세 정보 또는 null
 */
export async function getSnippetById(id: number): Promise<Snippet | null> {
  'use cache';
  cacheTag('snippets', `snippet-${id}`);

  console.log(`[getSnippetById] 🔥 use cache - DB 호출:`, getCurrentKST(), { id });

  const { data, error } = await supabase.from('snippets').select('*').eq('id', id).single();

  if (error) {
    // PGRST116: Not found
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch snippet: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // Zod로 런타임 검증
  const validatedData = SnippetSchema.parse(data);

  // snake_case -> camelCase 변환
  return mapSnippetRowToSnippet(validatedData);
}

/**
 * 스니펫 통계를 가져오는 Server Action
 * 스니펫 개수와 언어별 분포를 가져옵니다.
 *
 * @returns 스니펫 통계 (개수, 언어별 분포)
 */
export async function getSnippetsStats(): Promise<SnippetsStats> {
  'use cache';
  cacheTag('snippets');

  console.log(`[getSnippetsStats] 🔥 use cache - DB 호출:`, getCurrentKST());

  // 스니펫 개수 조회
  const { count, error: countError } = await supabase
    .from('snippets')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error(`Failed to fetch snippets count: ${countError.message}`);
  }

  // 언어별 분포 조회
  const { data: langData, error: langError } = await supabase.from('snippets').select('language');

  if (langError) {
    throw new Error(`Failed to fetch language distribution: ${langError.message}`);
  }

  // 언어별 개수 집계
  const languageDistribution =
    langData?.reduce(
      (acc, { language }) => {
        acc[language] = (acc[language] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ) ?? {};

  return {
    count: count ?? 0,
    languageDistribution,
  };
}

// ==================== Actions (변경) ====================

// TODO: 필요시 createSnippet, updateSnippet, deleteSnippet 등 추가
