import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export { API_URL, ApiError };

export async function apiRequest<TResponse>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    token?: string | null;
  } = {},
): Promise<TResponse> {
  const fallbackToken = useAuthStore.getState().accessToken;

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ?? fallbackToken
        ? { Authorization: `Bearer ${options.token ?? fallbackToken}` }
        : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const errorData = (await response.json()) as
        | { message?: string | string[] }
        | undefined;

      if (Array.isArray(errorData?.message)) {
        message = errorData.message.join(", ");
      } else if (typeof errorData?.message === "string") {
        message = errorData.message;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as TResponse;
}
