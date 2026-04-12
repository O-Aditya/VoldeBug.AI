import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";

export async function handleTeacherDashboard(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    // Get teacher's classes
    const classes = await prisma.class.findMany({
      where: { teacherId: userId },
      include: {
        _count: { select: { assignments: true, members: true } },
      },
    });

    const classIds = classes.map((c) => c.id);

    // Get assignment IDs
    const assignments = await prisma.assignment.findMany({
      where: { classId: { in: classIds }, status: "PUBLISHED", deletedAt: null },
      select: { id: true },
    });
    const assignmentIds = assignments.map((a) => a.id);

    // Active assignments count
    const activeAssignments = assignments.length;

    // Pending submissions (ungraded)
    const pendingSubmissionsList = await prisma.submission.findMany({
      where: { assignmentId: { in: assignmentIds }, status: "SUBMITTED", deletedAt: null },
      include: {
        student: { select: { id: true, name: true, image: true } },
        assignment: { select: { title: true } },
      },
      orderBy: { submittedAt: "desc" },
      take: 10,
    });

    const recentSubmissions = pendingSubmissionsList.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      studentName: s.student.name || s.student.id,
      studentImage: s.student.image,
      assignmentId: s.assignmentId,
      assignmentTitle: s.assignment.title,
      submittedAt: s.submittedAt.toISOString(),
      status: s.status,
      score: s.score,
      grade: s.grade,
      xpAwarded: s.xpAwarded,
    }));

    // Total students
    const totalStudents = classes.reduce((sum, c) => sum + c._count.members, 0);

    // Graded submissions for stats
    const gradedSubmissions = await prisma.submission.findMany({
      where: { assignmentId: { in: assignmentIds }, status: { in: ["GRADED", "RETURNED"] }, deletedAt: null },
      select: { score: true },
    });

    const averageGrade =
      gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length
        : null;

    const submissionCount = gradedSubmissions.length + pendingSubmissionsList.length;
    const completionRate =
      assignmentIds.length > 0
        ? Math.round((gradedSubmissions.length / assignmentIds.length) * 100)
        : 0;

    return apiSuccess(res, {
      activeAssignments,
      pendingSubmissions: pendingSubmissionsList.length,
      totalStudents,
      averageGrade,
      completionRate,
      classInfo: classes,
      recentSubmissions,
    });
  } catch (err) {
    return apiError(res, {
      code: "INTERNAL_ERROR",
      message: `Failed to fetch teacher dashboard: ${(err as Error).message}`,
      status: 500,
    });
  }
}

export async function handleTeacherClasses(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    const classes = await prisma.class.findMany({
      where: { teacherId: userId },
      include: {
        _count: {
          select: { assignments: true, members: true },
        },
      },
    });

    return apiSuccess(res, classes);
  } catch {
    return apiError(res, {
      code: "INTERNAL_ERROR",
      message: "Failed to fetch classes",
      status: 500,
    });
  }
}

export async function handleTeacherClassDetail(req: Request, res: Response) {
  const userId = req.userId!;
  const { classId } = req.params;

  try {
    const cls = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                gradeLevel: true,
                studentId: true,
              },
            },
          },
        },
        assignments: {
          where: { deletedAt: null },
          orderBy: { dueDate: "asc" },
          include: {
            suggestedTool: { select: { id: true, name: true } },
            _count: { select: { submissions: true } },
          },
        },
      },
    });

    if (!cls || cls.teacherId !== userId) {
      return apiError(res, { code: "NOT_FOUND", message: "Class not found", status: 404 });
    }

    // Compute per-student completion stats
    const assignmentIds = cls.assignments.map((a) => a.id);
    const submissions = await prisma.submission.findMany({
      where: { assignmentId: { in: assignmentIds }, deletedAt: null },
      select: { studentId: true, assignmentId: true, status: true, score: true, xpAwarded: true },
    });

    const studentStats = cls.members.map((m) => {
      const studentSubs = submissions.filter((s) => s.studentId === m.userId);
      const completed = studentSubs.filter((s) => s.status === "GRADED" || s.status === "RETURNED").length;
      const avgScore = studentSubs.length > 0
        ? Math.round(studentSubs.reduce((acc, s) => acc + (s.score ?? 0), 0) / studentSubs.length)
        : null;
      return {
        ...m.user,
        submissionsCount: studentSubs.length,
        completedCount: completed,
        avgScore,
        totalXPEarned: studentSubs.reduce((acc, s) => acc + (s.xpAwarded ?? 0), 0),
      };
    });

    return apiSuccess(res, {
      ...cls,
      memberStats: studentStats,
    });
  } catch (err) {
    return apiError(res, {
      code: "INTERNAL_ERROR",
      message: `Failed to fetch class detail: ${(err as Error).message}`,
      status: 500,
    });
  }
}