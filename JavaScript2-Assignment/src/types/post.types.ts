export interface ApiListResponse<T> {
  data: T[];
  meta: object;
}

export interface Post {
  id: string;
  title?: string;
  body?: string;
  media?: { url?: string; alt?: string };
  author?: { name?: string };
}

