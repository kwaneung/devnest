'use server';

import { cacheTag } from 'next/cache';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { getCurrentKST } from '@/lib/date';
import type { Post, GetPostsParams, PostsStats } from '@/types/post';
import { PostSchema, mapPostRowToPost } from '@/types/post';

// ==================== Queries (조회) ====================

/**
 * 포스트 목록을 가져오는 Server Action
 *
 * @param params - 정렬 및 제한 파라미터
 * @returns 포스트 배열
 */
export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  'use cache';
  cacheTag('posts');

  console.log(`[getPosts] 🔥 use cache - DB 호출:`, getCurrentKST(), {
    sort: params?.sort,
    limit: params?.limit,
  });

  const sort = params?.sort || 'latest';
  const limit = params?.limit;

  // Supabase 쿼리 빌더
  let query = supabase.from('posts').select('*');

  // 정렬
  if (sort === 'popular') {
    query = query.order('view_count', { ascending: false });
  } else {
    // 최신순 (기본)
    query = query.order('published_at', { ascending: false });
  }

  // limit 적용
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Zod로 런타임 검증
  const validatedData = z.array(PostSchema).parse(data);

  // snake_case -> camelCase 변환
  return validatedData.map(mapPostRowToPost);
}

/**
 * 특정 포스트 상세 정보를 가져오는 Server Action
 *
 * @param id - 포스트 ID
 * @returns 포스트 상세 정보 또는 null
 */
export async function getPostById(id: number): Promise<Post | null> {
  'use cache';
  cacheTag('posts', `post-${id}`);

  console.log(`[getPostById] 🔥 use cache - DB 호출:`, getCurrentKST(), { id });

  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

  if (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // Zod로 런타임 검증
  const validatedData = PostSchema.parse(data);

  // snake_case -> camelCase 변환
  return mapPostRowToPost(validatedData);
}

/**
 * 포스트 통계를 가져오는 Server Action
 * 포스트 개수와 총 조회수를 한 번의 쿼리로 가져옵니다.
 *
 * @returns 포스트 통계 (개수, 총 조회수)
 */
export async function getPostsStats(): Promise<PostsStats> {
  'use cache';
  cacheTag('posts');

  console.log(`[getPostsStats] 🔥 use cache - DB 호출:`, getCurrentKST());

  // 포스트 개수 조회
  const { count, error: countError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error(`Failed to fetch posts count: ${countError.message}`);
  }

  // 총 조회수 조회
  const { data: viewData, error: viewError } = await supabase.from('posts').select('view_count');

  if (viewError) {
    throw new Error(`Failed to fetch total views: ${viewError.message}`);
  }

  const totalViews = viewData?.reduce((sum, post) => sum + (post.view_count || 0), 0) ?? 0;

  return {
    count: count ?? 0,
    totalViews,
  };
}

// ==================== Actions (변경) ====================

// TODO: 필요시 createPost, updatePost, deletePost 등 추가
