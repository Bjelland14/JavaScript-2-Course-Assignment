import { apiRequest } from "./client";
import type { ApiListResponse, Post } from "../types/post.types";

export interface CreatePostRequest {
  title?: string;
  body?: string;
  media?: { url?: string; alt?: string };
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
  media?: { url?: string; alt?: string };
}

export function getPosts(): Promise<ApiListResponse<Post>> {
  return apiRequest<ApiListResponse<Post>>("/social/posts?_author=true", {
    method: "GET",
  });
}

export function getPostById(id: string): Promise<{ data: Post; meta: object }> {
  return apiRequest<{ data: Post; meta: object }>(`/social/posts/${id}?_author=true`, {
    method: "GET",
  });
}

export function createPost(
  payload: CreatePostRequest
): Promise<{ data: Post; meta: object }> {
  return apiRequest<{ data: Post; meta: object }>("/social/posts", {
    method: "POST",
    body: payload as unknown,
  });
}

export function updatePost(
  id: string,
  payload: UpdatePostRequest
): Promise<{ data: Post; meta: object }> {
  return apiRequest<{ data: Post; meta: object }>(`/social/posts/${id}`, {
    method: "PUT",
    body: payload as unknown,
  });
}

export function deletePost(id: string): Promise<{ meta: object }> {
  return apiRequest<{ meta: object }>(`/social/posts/${id}`, {
    method: "DELETE",
  });
}
