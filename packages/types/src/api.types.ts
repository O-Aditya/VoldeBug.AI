export interface ApiError {
  code: string;
  message: string;
}

export interface Meta {
  timestamp: string;
  requestId?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiEnvelope<T> {
  data: T | null;
  error: ApiError | null;
  meta: Meta;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface ListQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}
