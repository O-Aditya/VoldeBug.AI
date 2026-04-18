import { useQuery } from "@tanstack/react-query";
import { api } from "@web/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────

export interface SchoolOverview {
  school: { id: string; name: string };
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalAssignments: number;
  totalSubmissions: number;
  recentSubmissions: number;
  averageScore: number | null;
  gradedCount: number;
  auditLogs: {
    total: number;
    flagged: number;
  };
}

export interface AuditLogEntry {
  id: string;
  studentId: string;
  promptText: string;
  aiResponse: string;
  toolUsed: string;
  isFlagged: boolean;
  timestamp: string;
  createdAt: string;
  student: {
    id: string;
    name: string | null;
    email: string | null;
    gradeLevel: number | null;
  };
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
}

// ─── Hooks ────────────────────────────────────────────────────────────────

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => api.get<SchoolOverview>("/v1/admin/overview"),
    staleTime: 30_000,
    retry: 2,
  });
}

export function useAuditLogs(options?: {
  limit?: number;
  offset?: number;
  flagged?: boolean;
}) {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));
  if (options?.flagged !== undefined) params.set("flagged", String(options.flagged));

  const qs = params.toString();
  const path = `/v1/admin/audit-logs${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["admin", "audit-logs", options],
    queryFn: () => api.get<AuditLogsResponse>(path),
    staleTime: 15_000,
    retry: 2,
  });
}
