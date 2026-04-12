// Enums
export {
  UserRole,
  OnboardingStatus,
  AssignmentStatus,
  SubmissionStatus,
  XPSource,
  ToolCategory,
  NotificationType,
} from "./enums.js";

export type {
  ApiEnvelope,
  ApiError,
  Meta,
  PaginatedResponse,
  ListQuery,
} from "./api.types.js";

export type {
  AuthSession,
  LoginCredentials,
  RegisterInput,
  RoleSelectionInput,
} from "./auth.types.js";

export type { User, UserProfile, CreateUserInput, UpdateUserInput } from "./user.types.js";

export type {
  XPTransaction,
  Badge,
  UserBadge,
  LeaderboardEntry,
  DailyChallenge,
  StreakInfo,
} from "./gamification.types.js";

export type {
  Tool,
  Assignment,
  Submission,
  CreateAssignmentInput,
  CreateSubmissionInput,
  GradeSubmissionInput,
} from "./assignment.types.js";

export type { Class, ClassMember, ClassAnalytics } from "./class.types.js";

export type {
  XpUpdatedEvent,
  AssignmentGradedEvent,
  ScoreboardUpdateEvent,
  BadgeEarnedEvent,
  NotificationEvent,
} from "./socket.types.js";

// Schemas
export {
  loginSchema,
  registerSchema,
  roleSelectionSchema,
} from "./schemas/auth.schemas.js";

export {
  studentOnboardingSchema,
  teacherOnboardingSchema,
  updateProfileSchema,
} from "./schemas/user.schemas.js";

export {
  createAssignmentSchema,
  updateAssignmentSchema,
  createSubmissionSchema,
  gradeSubmissionSchema,
} from "./schemas/assignment.schemas.js";
