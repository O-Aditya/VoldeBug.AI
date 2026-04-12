import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@web/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  xpReward: number;
  earlyBonus: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  submissionFormats: string[];
  className: string;
  classId: string;
  creatorId: string;
  creator: { id: string; name: string | null; email: string | null; image: string | null };
  suggestedTool: { id: string; name: string; logoUrl: string; brandColor: string } | null;
  submissions: Submission[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrls: string[];
  studentNotes: string | null;
  status: "SUBMITTED" | "GRADED" | "RETURNED";
  submittedAt: string;
  gradedAt: string | null;
  score: number | null;
  grade: string | null;
  feedback: string | null;
  xpAwarded: number | null;
  assignment?: {
    id: string;
    title: string;
    xpReward: number;
    suggestedTool: { id: string; name: string; logoUrl: string; brandColor: string } | null;
  };
}

export interface CreateSubmissionPayload {
  assignmentId: string;
  fileUrls: string[];
  studentNotes?: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────

export function useAssignmentList(filter?: "active" | "completed" | "overdue") {
  return useQuery({
    queryKey: ["assignments", filter],
    queryFn: () => api.get<Assignment[]>("/v1/assignments"),
    select: (data) => {
      if (!filter) return data;
      const now = new Date();
      return data.filter((a) => {
        const due = new Date(a.dueDate);
        const hasSubmission = a.submissions && a.submissions.length > 0;
        if (filter === "active") return !hasSubmission && due >= now;
        if (filter === "completed") return hasSubmission;
        if (filter === "overdue") return !hasSubmission && due < now;
        return true;
      });
    },
    staleTime: 60_000,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: () => api.get<Assignment>(`/v1/assignments/${id}`),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useSubmitAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubmissionPayload) =>
      api.post<Submission & { xpAwarded: number }>("/v1/submissions", payload as unknown as Record<string, unknown>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      qc.invalidateQueries({ queryKey: ["submissions"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useSubmissionHistory(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["submissions", status],
    queryFn: () => api.get<Submission[]>(`/v1/submissions${qs}`),
    staleTime: 60_000,
  });
}
