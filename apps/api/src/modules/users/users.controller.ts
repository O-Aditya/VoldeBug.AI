import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";

export async function handleStudentOnboarding(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    return apiError(res, { code: "UNAUTHORIZED", message: "Authentication required", status: 401 });
  }

  try {
    const { gradeLevel, studentId } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        gradeLevel: gradeLevel ? Number(gradeLevel) : undefined,
        studentId,
        onboardingStatus: "COMPLETED",
      },
      select: { id: true, name: true, email: true, role: true, onboardingStatus: true },
    });

    return apiSuccess(res, user);
  } catch (err) {
    return apiError(res, { code: "ONBOARDING_FAILED", message: (err as Error).message, status: 400 });
  }
}

export async function handleTeacherOnboarding(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    return apiError(res, { code: "UNAUTHORIZED", message: "Authentication required", status: 401 });
  }

  try {
    const { schoolName, className } = req.body;

    let schoolId: string;

    // Find or create school
    let school = await prisma.school.findFirst({ where: { name: schoolName } });
    if (!school) {
      school = await prisma.school.create({ data: { name: schoolName } });
    }
    schoolId = school.id;

    // Create class
    await prisma.class.create({
      data: {
        name: className,
        teacherId: userId,
        schoolId,
      },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        schoolId,
        onboardingStatus: "COMPLETED",
      },
      select: { id: true, name: true, email: true, role: true, onboardingStatus: true },
    });

    return apiSuccess(res, user);
  } catch (err) {
    return apiError(res, { code: "ONBOARDING_FAILED", message: (err as Error).message, status: 400 });
  }
}
