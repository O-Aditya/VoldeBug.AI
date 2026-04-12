import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";

export async function handleListAssignments(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    // Find the user's classes and get their assignments
    const memberships = await prisma.classMember.findMany({
      where: { userId },
      include: {
        class: {
          include: {
            assignments: {
              where: {
                status: "PUBLISHED",
                deletedAt: null,
              },
              include: {
                suggestedTool: true,
                submissions: {
                  where: { studentId: userId },
                },
              },
              orderBy: { dueDate: "asc" },
            },
          },
        },
      },
    });

    const assignments = memberships.flatMap((m) =>
      m.class.assignments.map((a) => ({
        ...a,
        className: m.class.name,
      })),
    );

    return apiSuccess(res, assignments);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch assignments", status: 500 });
  }
}

export async function handleGetAssignment(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        suggestedTool: true,
        creator: {
          select: { id: true, name: true, email: true, image: true },
        },
        class: {
          select: { id: true, name: true },
        },
        submissions: {
          where: { studentId: userId },
        },
      },
    });

    if (!assignment) {
      return apiError(res, { code: "NOT_FOUND", message: "Assignment not found", status: 404 });
    }

    if ((assignment as any).deletedAt) {
      return apiError(res, { code: "NOT_FOUND", message: "Assignment not found", status: 404 });
    }

    return apiSuccess(res, assignment);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch assignment", status: 500 });
  }
}

export async function handleCreateAssignment(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    const { title, description, classId, suggestedToolId, dueDate, xpReward, earlyBonus, submissionFormats, notifyOnPublish } = req.body;

    if (!title || !description || !classId || !dueDate) {
      return apiError(res, {
        code: "VALIDATION_ERROR",
        message: "title, description, classId, and dueDate are required",
        status: 422,
      });
    }

    const classObj = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classObj || classObj.teacherId !== userId) {
      return apiError(res, { code: "FORBIDDEN", message: "You don't have permission to create assignments for this class", status: 403 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        classId,
        creatorId: userId,
        suggestedToolId,
        dueDate: new Date(dueDate),
        xpReward: xpReward || 50,
        earlyBonus: earlyBonus || 25,
        submissionFormats: submissionFormats || [],
        notifyOnPublish: notifyOnPublish ?? true,
        status: "PUBLISHED",
      },
      include: {
        suggestedTool: true,
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (assignment.notifyOnPublish) {
      const classMembers = await prisma.classMember.findMany({
        where: { classId },
        select: { userId: true },
      });

      const { createNotification } = await import("../notifications/notifications.service.js");

      // Fire and forget notifications
      Promise.all(
        classMembers.map((m) =>
          createNotification({
            userId: m.userId,
            type: "ASSIGNMENT_CREATED",
            title: "New Assignment",
            body: `${classObj.name}: ${title} has been posted.`,
          }).catch(console.error)
        )
      );
    }

    return apiSuccess(res, assignment, 201);
  } catch (err) {
    return apiError(res, { code: "CREATE_FAILED", message: (err as Error).message, status: 400 });
  }
}

export async function handleUpdateAssignment(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
      return apiError(res, { code: "NOT_FOUND", message: "Assignment not found", status: 404 });
    }

    // Only the creator can update
    if (assignment.creatorId !== userId) {
      return apiError(res, { code: "FORBIDDEN", message: "You can only edit your own assignments", status: 403 });
    }

    const { title, description, dueDate, xpReward, earlyBonus, status } = req.body;

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(xpReward !== undefined && { xpReward }),
        ...(earlyBonus !== undefined && { earlyBonus }),
        ...(status && { status }),
      },
    });

    return apiSuccess(res, updated);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to update assignment", status: 500 });
  }
}

export async function handleDeleteAssignment(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
      return apiError(res, { code: "NOT_FOUND", message: "Assignment not found", status: 404 });
    }

    if (assignment.creatorId !== userId) {
      return apiError(res, { code: "FORBIDDEN", message: "You can only delete your own assignments", status: 403 });
    }

    await prisma.assignment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return apiSuccess(res, { message: "Assignment deleted" });
  } catch (err) {
    return apiError(res, { code: "DELETE_FAILED", message: (err as Error).message, status: 400 });
  }
}
