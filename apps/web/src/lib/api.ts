import { getSession } from "next-auth/react";
import { env } from "./env";

export class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL ?? env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  }

  async request<T>(path: string, options?: RequestInit): Promise<T> {
    // 1. Prepare our headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>)
    };

    // 2. Fetch the current session from NextAuth
    // Note: getSession works well on the client side
    const session = await getSession();

    // 3. Extract the token
    // Note: You will need to make sure NextAuth is configured to pass the JWT 
    // to the session object. Usually, this is called 'accessToken' or 'token'.
    const token = (session as any)?.accessToken || (session as any)?.user?.token;

    // 4. If we have a token, attach it to the Authorization header
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 5. Make the request with the updated headers
    const res = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(
        json?.error?.message ?? `Request failed: ${res.statusText}`,
      );
    }
    return json.data as T;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body: Record<string, unknown>) {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: Record<string, unknown>) {
    return this.request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: Record<string, unknown>) {
    return this.request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export const api = new ApiClient();