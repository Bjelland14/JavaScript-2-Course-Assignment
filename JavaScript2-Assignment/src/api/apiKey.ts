import { apiRequest } from "./client";

export interface CreateApiKeyResponse {
  data: {
    name: string;
    status: string;
    key: string;
  };
  meta: object;
}

export function createApiKey(name: string): Promise<CreateApiKeyResponse> {
  return apiRequest<CreateApiKeyResponse>("/auth/create-api-key", {
    method: "POST",
    body: { name },
  });
}
