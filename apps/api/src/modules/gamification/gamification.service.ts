import { prisma } from "../../utils/prisma.js";
import { getRedis } from "../../utils/redis.js";
import { emitToUser, emitToClass } from "../../config/socket.js";

// ─── Level Calculation ────────────────────────────────────────────────

export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

export function xpNeededForNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  return currentLevel * currentLevel * 100 - totalXP + 100;
}

// ─── XP Awarding ──────────────────────────────────────────────────────

interface AwardXPResult {
  totalXP: number;
  level: number;
  levelUp: boolean;
  newStreak: number | null;
  badgesEarned: string[];
}

export async function awardXP(
  userId: string,
  amount: number,
  source: string,
  assignmentId?: string | null,
): Promise<AwardXPResult> {
  // Get level before
  const transactions = await prisma.xPTransaction.findMany({
    where: { userId },
    select: { amount: true },
  });
  const prevTotalXP = transactions.reduce((sum, t) => sum + t.amount, 0);
  const prevLevel = calculateLevel(prevTotalXP);

  // Create XP transaction
  await prisma.xPTransaction.create({
    data: {
      userId,
      amount,
      source: source as any,
      assignmentId,
    },
  });

  // Get new level
  const newTotalXP = prevTotalXP + amount;
  const newLevel = calculateLevel(newTotalXP);
  const levelUp = newLevel > prevLevel;

  // Update lastActiveAt
  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });

  // Evaluate streak
  const newStreak = await updateStreak(userId);

  // Evaluate badges
  const badgesEarned = await evaluateBadges(userId);

  // Emit socket events
  emitToUser(userId, "xp:updated", {
    totalXP: newTotalXP,
    level: newLevel,
    xpGained: amount,
    source,
    levelUp,
  });

  if (levelUp) {
    emitToUser(userId, "level:up", { level: newLevel });
  }

  return {
    totalXP: newTotalXP,
    level: newLevel,
    levelUp,
    newStreak,
    badgesEarned,
  };
}

// ─── Streak System ────────────────────────────────────────────────────

export async function updateStreak(userId: string): Promise<number> {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const streak = await prisma.streak.findUnique({ where: { userId } });

  if (!streak) {
    // First time — create streak
    const newStreak = await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: now,
      },
    });
    return newStreak.currentStreak;
  }

  const lastDate = streak.lastActiveDate.toISOString().split("T")[0];

  // Already active today
  if (lastDate === today) {
    return streak.currentStreak;
  }

  // Check if within 48 hours (streak maintained)
  const hoursSinceLastActive =
    (now.getTime() - streak.lastActiveDate.getTime()) / (1000 * 60 * 60);

  if (hoursSinceLastActive <= 48) {
    // Streak continues
    const newStreak = streak.currentStreak + 1;
    const updated = await prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(streak.longestStreak, newStreak),
        lastActiveDate: now,
      },
    });
    return updated.currentStreak;
  }

  // Streak broken — reset to 1
  const updated = await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: 1,
      lastActiveDate: now,
    },
  });
  return updated.currentStreak;
}

// ─── Badge Evaluation ─────────────────────────────────────────────────

export async function evaluateBadges(userId: string): Promise<string[]> {
  const earned: string[] = [];

  // Get user stats
  const xpTransactions = await prisma.xPTransaction.findMany({
    where: { userId },
    select: { amount: true },
  });
  const totalXP = xpTransactions.reduce((sum, t) => sum + t.amount, 0);

  const submissionCount = await prisma.submission.count({
    where: { studentId: userId, deletedAt: null },
  });

  const streak = await prisma.streak.findUnique({ where: { userId } });

  // Get all active badge definitions
  const badges = await prisma.badge.findMany({
    where: { isActive: true },
    select: { id: true, name: true, conditionKey: true, requiredCount: true, xpReward: true },
    orderBy: { xpReward: "asc" },
  });

  // Get already earned badges
  const existingBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedIds = new Set(existingBadges.map((b) => b.badgeId));

  for (const badge of badges) {
    if (earnedIds.has(badge.id)) continue;

    let meetsCondition = false;

    switch (badge.conditionKey) {
      case "first_submission":
        meetsCondition = submissionCount >= 1;
        break;
      case "ten_submissions":
        meetsCondition = submissionCount >= 10;
        break;
      case "first_tool_use":
        meetsCondition = false;
        break;
      case "seven_day_streak":
        meetsCondition = (streak?.currentStreak || 0) >= 7;
        break;
      case "xp_milestone_500":
        meetsCondition = totalXP >= 500;
        break;
      case "xp_milestone_1000":
        meetsCondition = totalXP >= 1000;
        break;
    }

    if (meetsCondition) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
          progressCount: badge.requiredCount,
        },
      });
      earned.push(badge.name);
      emitToUser(userId, "badge:earned", { badgeId: badge.id, name: badge.name });
    }
  }

  return earned;
}

// ─── Daily Challenge ──────────────────────────────────────────────────

interface DailyChallengeResult {
  id: string;
  date: string;
  action: string;
  completed: boolean;
  xpAwarded: number | null;
}

const CHALLENGES = [
  "Use an AI Tool today",
  "Submit an assignment",
  "Achieve 90%+ on a graded assignment",
  "Earn a streak bonus",
  "Check the scoreboard rankings",
];

export function generateChallenge(userId: string, date: string): string {
  // Deterministic: same user sees same challenge for the same date
  const seed = `${userId}-${date}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return CHALLENGES[Math.abs(hash) % CHALLENGES.length];
}

export async function getDailyChallenge(userId: string): Promise<DailyChallengeResult> {
  const today = new Date().toISOString().split("T")[0];

  // Try to fetch existing challenge
  const existing = await prisma.dailyChallenge.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (existing) {
    return {
      id: existing.id,
      date: existing.date,
      action: existing.action,
      completed: existing.completed,
      xpAwarded: existing.xpAwarded,
    };
  }

  // Generate new challenge
  const action = generateChallenge(userId, today);
  const created = await prisma.dailyChallenge.create({
    data: {
      userId,
      date: today,
      action,
    },
  });

  return {
    id: created.id,
    date: created.date,
    action: created.action,
    completed: created.completed,
    xpAwarded: created.xpAwarded,
  };
}

export async function completeDailyChallenge(
  userId: string,
  action: string,
): Promise<DailyChallengeResult | null> {
  const today = new Date().toISOString().split("T")[0];

  const challenge = await prisma.dailyChallenge.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (!challenge || challenge.completed) return null;

  // Verify the action matches
  if (challenge.action !== action) {
    return null;
  }

  const xpAmount = 50;

  const updated = await prisma.dailyChallenge.update({
    where: { id: challenge.id },
    data: {
      completed: true,
      completedAt: new Date(),
      xpAwarded: xpAmount,
    },
  });

  // Award XP
  await prisma.xPTransaction.create({
    data: {
      userId,
      amount: xpAmount,
      source: "DAILY_CHALLENGE",
    },
  });

  emitToUser(userId, "xp:updated", {
    totalXP: undefined, // client will refetch
    xpGained: xpAmount,
    source: "DAILY_CHALLENGE",
  });

  return {
    id: updated.id,
    date: updated.date,
    action: updated.action,
    completed: updated.completed,
    xpAwarded: updated.xpAwarded,
  };
}
