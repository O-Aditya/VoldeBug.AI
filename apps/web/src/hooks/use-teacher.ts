import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@web/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────

export interface TeacherClass {
  id: string;
  name: string;
  schoolId: string;
  teacherId: string;
  createdAt: string;
  _count?: { assignments: number; members: number };
}

export interface TeacherDashboard {
  activeAssignments: number;
  pendingSubmissions: number;
  totalStudents: number;
  averageGrade: number | null;
  completionRate: number;
  classInfo: TeacherClass[];
  recentSubmissions: PendingSubmission[];
}

export interface PendingSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentImage: string | null;
  assignmentId: string;
  assignmentTitle: string;
  submittedAt: string;
  status: string;
  score: number | null;
  grade: string | null;
  xpAwarded: number | null;
}

export interface ClassDetail {
  id: string;
  name: string;
  assignments: AssignmentSummary[];
  memberStats: StudentStats[];
}

export interface AssignmentSummary {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  xpReward: number;
  _count: { submissions: number };
  suggestedTool: { id: string; name: string } | null;
}

export interface StudentStats {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  gradeLevel: number | null;
  studentId: string | null;
  submissionsCount: number;
  completedCount: number;
  avgScore: number | null;
  totalXPEarned: number;
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  fileUrls: string[];
  studentNotes: string | null;
  status: string;
  score: number | null;
  grade: string | null;
  feedback: string | null;
  xpAwarded: number | null;
  submittedAt: string;
  gradedAt: string | null;
  student: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  assignment: {
    id: string;
    title: string;
    xpReward: number;
    class: { id: string; name: string; teacherId: string };
    suggestedTool: { name: string; logoUrl: string } | null;
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────

export function useTeacherDashboard() {
  return useQuery({
    queryKey: ["teacher", "dashboard"],
    queryFn: () => api.get<TeacherDashboard>("/v1/teacher/dashboard"),
    staleTime: 30_000,
  });
}

export function useTeacherClasses() {
  return useQuery({
    queryKey: ["teacher", "classes"],
    queryFn: () => api.get<TeacherClass[]>("/v1/teacher/classes"),
    staleTime: 60_000,
  });
}

export function useClassDetail(classId: string) {
  return useQuery({
    queryKey: ["teacher", "classes", classId],
    queryFn: () => api.get<ClassDetail>(`/v1/teacher/classes/${classId}`),
    enabled: !!classId,
    staleTime: 30_000,
  });
}

export function useAssignmentSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ["submissions", "assignment", assignmentId],
    queryFn: () => api.get<Submission[]>(`/v1/submissions/assignment/${assignmentId}`),
    enabled: !!assignmentId,
    staleTime: 15_000,
  });
}

export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: ["submissions", submissionId],
    queryFn: () => api.get<Submission>(`/v1/submissions/${submissionId}`),
    enabled: !!submissionId,
  });
}

export function useGradeSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string;
      data: { score: number; grade: string; feedback: string; xpAwarded?: number };
    }) => api.patch(`/v1/submissions/${submissionId}/grade`, data as any),
    onSuccess: (_, { submissionId }) => {
      qc.invalidateQueries({ queryKey: ["submissions", submissionId] });
      qc.invalidateQueries({ queryKey: ["teacher", "dashboard"] });
      qc.invalidateQueries({ queryKey: ["submissions", "assignment"] });
    },
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      classId: string;
      suggestedToolId?: string;
      dueDate: string;
      xpReward: number;
      earlyBonus: number;
    }) => api.post("/v1/assignments", data as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      qc.invalidateQueries({ queryKey: ["teacher", "dashboard"] });
    },
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: string) =>
      api.delete(`/v1/assignments/${assignmentId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      qc.invalidateQueries({ queryKey: ["teacher"] });
    },
  });
}
