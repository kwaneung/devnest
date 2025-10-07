export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  viewCount: number;
}

export interface GetPostsParams {
  sort?: 'latest' | 'popular';
  limit?: number;
}
