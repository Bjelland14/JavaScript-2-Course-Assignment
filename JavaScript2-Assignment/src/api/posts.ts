import { apiRequest } from "./client";
import type { ApiListResponse, Post } from "../types/post.types";

export function getPosts(): Promise<ApiListResponse<Post>> {
  // You can later add query params like ?limit=20&sort=created&sortOrder=desc
  return apiRequest<ApiListResponse<Post>>("/social/posts", {
    method: "GET",
  });
}
