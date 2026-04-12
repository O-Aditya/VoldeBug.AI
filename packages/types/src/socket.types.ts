export interface XpUpdatedEvent {
  userId: string;
  totalXp: number;
  level: number;
  amount: number;
  source: string;
}

export interface AssignmentGradedEvent {
  submissionId: string;
  studentId: string;
  assignmentId: string;
  score: number;
  grade: string | null;
  feedback: string | null;
  xpAwarded: number;
}

export interface ScoreboardUpdateEvent {
  classId: string;
  entries: {
    userId: string;
    name: string | null;
    xp: number;
    level: number;
    rank: number;
  }[];
}

export interface BadgeEarnedEvent {
  userId: string;
  badgeId: string;
  badgeName: string;
  xpReward: number;
}

export interface NotificationEvent {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  unreadCount?: number;
}
