import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";

export async function handleDashboardStats(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    return apiError(res, { code: "UNAUTHORIZED", message: "Authentication required", status: 401 });
  }

  try {
    const [user, xpTransactions, streak, badgesCount, submissions, classMemberships] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, role: true, gradeLevel: true },
        }),
        prisma.xPTransaction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          select: { amount: true, createdAt: true, source: true },
        }),
        prisma.streak.findUnique({ where: { userId } }),
        prisma.userBadge.findMany({ 
          where: { userId },
          include: { badge: true }
        }),
        prisma.submission.count({
          where: { studentId: userId, deletedAt: null },
        }),
        prisma.classMember.findMany({
          where: { userId },
          include: {
            class: {
              include: {
                _count: { select: { assignments: { where: { status: "PUBLISHED", deletedAt: null } } } },
              },
            },
          },
        }),
      ]);

    // Calculate total XP and level
    const totalXP = xpTransactions.reduce((sum, t) => sum + t.amount, 0);
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    const xpToNextLevel = Math.pow(level, 2) * 100 - totalXP + 100;

    // Calculate this week's XP
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekXP = xpTransactions
      .filter((t) => new Date(t.createdAt) >= oneWeekAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate class rank (first class)
    let classRank: number | null = null;
    if (classMemberships.length > 0 && classMemberships[0].class.schoolId) {
      const schoolId = classMemberships[0].class.schoolId;

      // Get all class members from all classes in this school
      const allSchoolClasses = await prisma.class.findMany({
        where: { schoolId },
        select: { id: true, members: { select: { userId: true } } },
      });

      const allUserIds = allSchoolClasses.flatMap((c) =>
        c.members.map((m: { userId: string }) => m.userId),
      );

      const allStudentsXP = await prisma.xPTransaction.groupBy({
        by: ["userId"],
        _sum: { amount: true },
        where: {
          userId: { in: Array.from(new Set(allUserIds)) },
        },
      });

      // Sort by total XP descending and find user's position
      const ranked = allStudentsXP
        .map((s) => ({ userId: s.userId, totalXP: s._sum.amount || 0 }))
        .sort((a, b) => b.totalXP - a.totalXP);

      const userRank = ranked.findIndex((r) => r.userId === userId);
      classRank = userRank >= 0 ? userRank + 1 : null;
    }

    // Count pending assignments
    const pendingAssignments = classMemberships.reduce(
      (sum, m) => sum + m.class._count.assignments,
      0,
    );

    return apiSuccess(res, {
      xp: {
        total: totalXP,
        level,
        thisWeek: thisWeekXP,
        toNextLevel: Math.max(0, xpToNextLevel),
        percentage: Math.min(100, Math.round(((totalXP % 100) / 100) * 100)),
      },
      streak: {
        current: streak?.currentStreak || 0,
        longest: streak?.longestStreak || 0,
      },
      classRank,
      badges: {
        earned: badgesCount.length,
        items: badgesCount.map(ub => ({
          id: ub.badge.id,
          key: ub.badge.conditionKey,
          name: ub.badge.name,
          icon: ub.badge.iconUrl,
          desc: ub.badge.description,
          earnedAt: ub.earnedAt
        }))
      },
      submissionCount: submissions,
      pendingAssignments,
    });
  } catch (err) {
    return apiError(res, {
      code: "INTERNAL_ERROR",
      message: `Failed to fetch dashboard stats: ${(err as Error).message}`,
      status: 500,
    });
  }
}
