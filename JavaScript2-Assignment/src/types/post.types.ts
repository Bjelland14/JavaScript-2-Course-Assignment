export interface PostAuthor {
  name: string;
}

export interface Post {
  id: string;
  title?: string;
  body?: string;
  media?: {
    url?: string;
    alt?: string;
  };
  created: string;
  updated: string;
  author: PostAuthor;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: object;
}
