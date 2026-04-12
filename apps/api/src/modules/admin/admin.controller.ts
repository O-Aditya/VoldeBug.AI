import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";

export async function handleGetSchool(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    const school = await prisma.school.findFirst({
      where: { adminId: userId },
      include: {
        _count: { select: { members: true, classes: true } },
      },
    });

    if (!school) {
      return apiError(res, { code: "NOT_FOUND", message: "School not found", status: 404 });
    }

    return apiSuccess(res, school);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch school", status: 500 });
  }
}

export async function handleListUsers(req: Request, res: Response) {
  const { role, page = 1, limit = 20, search } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (search && typeof search === "string") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          gradeLevel: true,
          lastActiveAt: true,
          createdAt: true,
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return apiSuccess(res, { users, total }, 200, {
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to list users", status: 500 });
  }
}

export async function handleGetUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gradeLevel: true,
        studentId: true,
        image: true,
        lastActiveAt: true,
        onboardingStatus: true,
        createdAt: true,
        streak: true,
        _count: {
          select: {
            submissions: true,
            xpTransactions: true,
            badges: true,
          },
        },
      },
    });

    if (!user) {
      return apiError(res, { code: "NOT_FOUND", message: "User not found", status: 404 });
    }

    return apiSuccess(res, user);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch user", status: 500 });
  }
}

export async function handleUpdateUserRole(req: Request, res: Response) {
  const { id } = req.params;
  const { role } = req.body;

  try {
    if (!["STUDENT", "TEACHER", "ADMIN"].includes(role)) {
      return apiError(res, { code: "VALIDATION_ERROR", message: "Invalid role", status: 422 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return apiSuccess(res, user);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to update role", status: 500 });
  }
}

export async function handleListClasses(req: Request, res: Response) {
  const { page = 1, limit = 20, schoolId } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};
    if (schoolId) where.schoolId = schoolId;

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          teacher: { select: { id: true, name: true, email: true } },
          school: { select: { id: true, name: true } },
          _count: { select: { members: true, assignments: true } },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.class.count({ where }),
    ]);

    return apiSuccess(res, { classes, total }, 200, {
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to list classes", status: 500 });
  }
}

export async function handleUpdateClass(req: Request, res: Response) {
  const { id } = req.params;
  const { name, teacherId } = req.body;

  try {
    const data: Record<string, unknown> = {};
    if (name) data.name = name;
    if (teacherId) data.teacherId = teacherId;

    const updated = await prisma.class.update({
      where: { id },
      data,
    });

    return apiSuccess(res, updated);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to update class", status: 500 });
  }
}

export async function handleDeleteClass(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.class.delete({ where: { id } });
    return apiSuccess(res, { success: true });
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to delete class", status: 500 });
  }
}
