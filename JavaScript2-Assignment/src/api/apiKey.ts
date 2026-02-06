import { apiRequest } from "./client";

export interface CreateApiKeyResponse {
  data: {
    name: string;
    status: string;
    key: string;
  };
  meta: object;
}

export function createApiKey(): Promise<CreateApiKeyResponse> {
  // Requires Authorization Bearer token :contentReference[oaicite:3]{index=3}
  return apiRequest<CreateApiKeyResponse>("/auth/create-api-key", {
    method: "POST",
    body: { name: "JS2 Social App Key" },
  });
}
