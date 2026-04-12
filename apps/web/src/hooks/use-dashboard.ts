import { useQuery } from "@tanstack/react-query";
import { api } from "@web/lib/api";

// ─── Types ──────────────────────────────────────────────────────────────

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string;
  brandColor: string;
  usageCount: number;
  subject: string[];
  useCases: string[];
}

interface AssignmentResponse {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  xpReward: number;
  earlyBonus: number;
  status: string;
  className: string;
  suggestedTool: Tool | null;
  submissions: { id: string }[];
  createdAt: string;
}

interface DashboardStats {
  xp: {
    total: number;
    level: number;
    thisWeek: number;
    toNextLevel: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  classRank: number | null;
  badges: {
    earned: number;
    total: number;
    items?: any[];
  };
  submissionCount: number;
  pendingAssignments: number;
}

// ─── Queries ────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get<DashboardStats>("/v1/dashboard/stats"),
    staleTime: 60_000,
    retry: 2,
  });
}

export function useAssignments() {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: () => api.get<AssignmentResponse[]>("/v1/assignments"),
    staleTime: 30_000,
    retry: 2,
  });
}

export function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: () => api.get<Tool[]>("/v1/tools"),
    staleTime: 5 * 60_000,
    retry: 2,
  });
}
