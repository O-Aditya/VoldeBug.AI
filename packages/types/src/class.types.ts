export interface Class {
  id: string;
  name: string;
  schoolId: string | null;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassMember {
  id: string;
  classId: string;
  userId: string;
  joinedAt: Date;
}

export interface ClassAnalytics {
  classId: string;
  averageGrade: number | null;
  completionRate: number;
  totalSubmissions: number;
  mostUsedTool: string | null;
  topPerformers: {
    userId: string;
    name: string | null;
    xp: number;
  }[];
  atRiskStudents: {
    userId: string;
    name: string | null;
    lastActive: Date | null;
  }[];
}
