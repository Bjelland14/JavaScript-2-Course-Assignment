import { apiRequest } from "./client";
import type { ApiListResponse, Post } from "../types/post.types";

export interface Profile {
  name: string;
  bio?: string;
  avatar?: { url?: string; alt?: string };
}

export function getProfile(name: string): Promise<{ data: Profile; meta: object }> {
  return apiRequest<{ data: Profile; meta: object }>(`/social/profiles/${name}`, {
    method: "GET",
  });
}

export function getProfilePosts(name: string): Promise<ApiListResponse<Post>> {
  return apiRequest<ApiListResponse<Post>>(`/social/profiles/${name}/posts`, {
    method: "GET",
  });
}

export function followProfile(name: string): Promise<{ data: object; meta: object }> {
  return apiRequest<{ data: object; meta: object }>(`/social/profiles/${name}/follow`, {
    method: "PUT",
  });
}

export function unfollowProfile(name: string): Promise<{ data: object; meta: object }> {
  return apiRequest<{ data: object; meta: object }>(`/social/profiles/${name}/unfollow`, {
    method: "PUT",
  });
}
