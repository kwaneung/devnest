export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string; // Server Actions는 JSON으로 직렬화되므로 string
  tags: string[];
  viewCount: number;
}

export interface GetPostsParams {
  sort?: 'latest' | 'popular';
  limit?: number;
}
