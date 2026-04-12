import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";
import {
  completeDailyChallenge,
  getDailyChallenge,
  awardXP,
  evaluateBadges,
  updateStreak,
} from "./gamification.service.js";

export async function handleDailyChallenge(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    const challenge = await getDailyChallenge(userId);
    return apiSuccess(res, challenge);
  } catch {
    return apiError(res, {
      code: "INTERNAL_ERROR",
      message: "Failed to fetch daily challenge",
      status: 500,
    });
  }
}

export async function handleCompleteChallenge(req: Request, res: Response) {
  const userId = req.userId!;
  const { action } = req.body;

  try {
    if (!action) {
      return apiError(res, {
        code: "VALIDATION_ERROR",
        message: "action is required",
        status: 422,
      });
    }

    const result = await completeDailyChallenge(userId, action);

    if (!result) {
      return apiError(res, {
        code: "ALREADY_COMPLETED",
        message: "Challenge already completed or action doesn't match",
        status: 409,
      });
    }

    return apiSuccess(res, result);
  } catch (err) {
    return apiError(res, {
      code: "CHALLENGE_FAILED",
      message: (err as Error).message,
      status: 400,
    });
  }
}

export async function handleGetLeaderboard(req: Request, res: Response) {
  const userId = req.userId!;
  const { classId, period } = req.query;

  try {
    let targetClassId = classId as string;
    if (!targetClassId) {
      const membership = await prisma.classMember.findFirst({
        where: { userId },
        select: { classId: true },
      });
      if (membership) {
        targetClassId = membership.classId;
      } else {
        // Fallback for Teachers
        const teacherClass = await prisma.class.findFirst({
          where: { teacherId: userId },
          select: { id: true },
        });
        if (teacherClass) {
          targetClassId = teacherClass.id;
        } else {
          return apiSuccess(res, { leaderboard: [], userRank: null });
        }
      }
    }

    // Get all members of this class
    const members = await prisma.classMember.findMany({
      where: { classId: targetClassId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Get XP for each member
    const memberIds = members.map((m) => m.userId);

    const xpGroups = await prisma.xPTransaction.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      where: { userId: { in: memberIds } },
    });

    const xpMap = new Map(
      xpGroups.map((g) => [g.userId, g._sum.amount || 0]),
    );

    // Calculate levels
    const leaderboard = members
      .map((m) => {
        const totalXP = xpMap.get(m.userId) || 0;
        const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
        return {
          userId: m.userId,
          name: m.user.name || m.user.email,
          image: m.user.image,
          totalXP,
          level,
        };
      })
      .sort((a, b) => b.totalXP - a.totalXP);

    // Rank with position
    const ranked = leaderboard.map((entry, i) => ({
      ...entry,
      rank: i + 1,
    }));

    // Find user's rank
    const userEntry = ranked.find((e) => e.userId === userId);
    const userRank = userEntry?.rank ?? null;

    return apiSuccess(res, { leaderboard: ranked, userRank, classId: targetClassId });
  } catch {
    return apiError(res, {
      code: "INTERNAL_ERROR",
      message: "Failed to fetch leaderboard",
      status: 500,
    });
  }
}
