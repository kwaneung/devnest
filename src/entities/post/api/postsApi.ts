import { getApiUrl } from '@/shared/api';

import type { Post, GetPostsParams } from '../model';

interface PostsResponse {
  success: boolean;
  data: Post[];
}

export const postsApi = {
  getPosts: async (params?: GetPostsParams): Promise<Post[]> => {
    const searchParams = new URLSearchParams();
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const url = getApiUrl(`/api/posts?${searchParams.toString()}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const result: PostsResponse = await response.json();
    return result.data;
  },
};
