import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";

export async function handleCreateSubmission(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    const { assignmentId, fileUrls, studentNotes } = req.body;

    if (!assignmentId || !fileUrls || !fileUrls.length) {
      return apiError(res, {
        code: "VALIDATION_ERROR",
        message: "assignmentId and fileUrls are required",
        status: 422,
      });
    }

    // Verify assignment exists and is published
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment || (assignment as any).deletedAt) {
      return apiError(res, { code: "NOT_FOUND", message: "Assignment not found", status: 404 });
    }

    if (assignment.status !== "PUBLISHED") {
      return apiError(res, { code: "INVALID_STATE", message: "Cannot submit to unpublished assignment", status: 400 });
    }

    // Check if student already has a submission
    const existing = await prisma.submission.findFirst({
      where: { assignmentId, studentId: userId, deletedAt: null },
    });

    if (existing) {
      return apiError(res, { code: "ALREADY_SUBMITTED", message: "You already submitted this assignment", status: 409 });
    }

    const isEarly = new Date() < new Date(new Date(assignment.dueDate).getTime() - 2 * 24 * 60 * 60 * 1000);

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: userId,
        fileUrls,
        studentNotes,
        status: "SUBMITTED",
      },
      include: {
        assignment: {
          include: { suggestedTool: true },
        },
      },
    });

    // Award XP for submission
    let totalXP = assignment.xpReward || 50;
    if (isEarly) {
      totalXP += assignment.earlyBonus || 25;
    }

    await prisma.xPTransaction.create({
      data: {
        userId,
        amount: totalXP,
        source: isEarly ? "EARLY_SUBMISSION" : "ASSIGNMENT_SUBMIT",
        assignmentId,
      },
    });

    const { createNotification } = await import("../notifications/notifications.service.js");
    const sessionUser = await prisma.user.findUnique({ where: { id: userId } });
    createNotification({
      userId: assignment.creatorId,
      type: "TEACHER_MESSAGE",
      title: "New Submission",
      body: `${sessionUser?.name || "A student"} submitted work for ${assignment.title}.`,
    }).catch(console.error);

    return apiSuccess(res, { ...submission, xpAwarded: totalXP }, 201);
  } catch (err) {
    return apiError(res, { code: "SUBMIT_FAILED", message: (err as Error).message, status: 400 });
  }
}

export async function handleGetSubmission(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, name: true, email: true, image: true } },
        assignment: {
          include: {
            suggestedTool: true,
            class: { select: { id: true, name: true, teacherId: true } },
            creator: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!submission) {
      return apiError(res, { code: "NOT_FOUND", message: "Submission not found", status: 404 });
    }

    return apiSuccess(res, submission);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch submission", status: 500 });
  }
}

export async function handleGetSubmissionHistory(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    const { status } = req.query;

    const submissions = await prisma.submission.findMany({
      where: {
        studentId: userId,
        deletedAt: null,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        assignment: {
          include: { suggestedTool: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return apiSuccess(res, submissions);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch submissions", status: 500 });
  }
}

export async function handleGetUploadPresignedUrl(req: Request, res: Response) {
  // Returns a placeholder for now — real S3/R2 presigned URL in Phase 5
  const { fileName, fileType } = req.query;

  if (!fileName || !fileType) {
    return apiError(res, {
      code: "VALIDATION_ERROR",
      message: "fileName and fileType are required",
      status: 422,
    });
  }

  return apiSuccess(res, {
    uploadUrl: "/api/v1/submissions/upload",
    key: `uploads/${req.userId}/${Date.now()}_${fileName}`,
  });
}

export async function handleListSubmissionsForAssignment(req: Request, res: Response) {
  const { assignmentId } = req.params;

  try {
    const submissions = await prisma.submission.findMany({
      where: { assignmentId, deletedAt: null },
      include: {
        student: { select: { id: true, name: true, email: true, image: true } },
        assignment: { include: { suggestedTool: true, creator: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { submittedAt: "asc" },
    });

    return apiSuccess(res, submissions);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch submissions", status: 500 });
  }
}

export async function handleGradeSubmission(req: Request, res: Response) {
  const { id } = req.params;
  const graderId = req.userId!;

  try {
    const { score, grade, feedback, xpAwarded } = req.body;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: { class: { select: { teacherId: true } } },
        },
      },
    });

    if (!submission) {
      return apiError(res, { code: "NOT_FOUND", message: "Submission not found", status: 404 });
    }

    // Only the class teacher can grade
    if (submission.assignment.class.teacherId !== graderId) {
      return apiError(res, { code: "FORBIDDEN", message: "Only the class teacher can grade this submission", status: 403 });
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        score,
        grade,
        feedback,
        xpAwarded,
        status: "GRADED",
        gradedAt: new Date(),
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    // Award grade XP transaction
    if (xpAwarded && Number(xpAwarded) > 0) {
      await prisma.xPTransaction.create({
        data: {
          userId: submission.studentId,
          amount: Number(xpAwarded),
          source: "ASSIGNMENT_GRADE",
          assignmentId: submission.assignmentId,
        },
      });
    }

    const { createNotification } = await import("../notifications/notifications.service.js");
    
    createNotification({
      userId: submission.studentId,
      type: "GRADE_RECEIVED",
      title: "Grade Received",
      body: `Your submission for "${submission.assignment.title}" has been graded! Score: ${score}`,
    }).catch(console.error);

    return apiSuccess(res, updated);
  } catch (err) {
    return apiError(res, { code: "GRADE_FAILED", message: (err as Error).message, status: 400 });
  }
}
