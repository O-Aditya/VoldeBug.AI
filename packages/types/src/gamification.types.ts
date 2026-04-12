import { type XPSource } from "./enums.js";

export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  source: XPSource;
  assignmentId: string | null;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  conditionKey: string;
  requiredCount: number;
  xpReward: number;
  isActive: boolean;
  createdAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  progressCount: number;
}

export interface LeaderboardEntry {
  userId: string;
  name: string | null;
  image: string | null;
  rank: number;
  level: number;
  xp: number;
  xpThisWeek?: number;
}

export interface DailyChallenge {
  id: string;
  userId: string;
  date: string;
  action: string;
  toolId: string | null;
  completed: boolean;
  completedAt: Date | null;
  xpAwarded: number | null;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  bonusXP: number;
  lastActiveDate: Date;
}
