interface ApiResponse<T> {
  data: T;
  error: { code: string; message: string } | null;
  meta: { timestamp: string };
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL ?? "";
  }

  private resolvePath(path: string): string {
    // In client components with JWT: hit backend directly
    if (path.startsWith("http")) return path;
    return path.startsWith("/api/")
      ? path
      : `/api/proxy${path}`;
  }

  async request<T>(
    path: string,
    options: RequestInit & { noEnvelope?: boolean } = {},
  ): Promise<T> {
    const { noEnvelope, ...fetchOptions } = options;
    const resolvedPath = this.resolvePath(path);

    const res = await fetch(resolvedPath, {
      headers: { "Content-Type": "application/json" },
      ...fetchOptions,
    });

    const json: ApiResponse<T> = await res.json();

    if (!res.ok) {
      throw new Error(json?.error?.message ?? `Request failed: ${res.statusText}`);
    }

    return json.data as T;
  }

  get<T>(path: string, options?: RequestInit) {
    return this.request<T>(path, { method: "GET", ...options });
  }

  post<T>(path: string, body?: Record<string, unknown>) {
    return this.request<T>(path, {
      method: "POST",
      ...(body && { body: JSON.stringify(body) }),
    });
  }

  patch<T>(path: string, body: Record<string, unknown>) {
    return this.request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient();
