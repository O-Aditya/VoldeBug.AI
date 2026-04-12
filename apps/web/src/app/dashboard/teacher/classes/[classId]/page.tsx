"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useClassDetail } from "@web/hooks/use-teacher";
import { GradientMesh } from "@web/components/ui/background";
import { Users, BookOpen, AlertCircle, TrendingUp, CheckCircle2, Copy, Sparkles, ChevronLeft, Calendar, FileText } from "lucide-react";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;
  const { data: cls, isLoading, error } = useClassDetail(classId);

  const [activeTab, setActiveTab] = useState<"STUDENTS" | "ASSIGNMENTS">("STUDENTS");
  const [copied, setCopied] = useState(false);

  // Invite code logic (Mocked for now since the backend doesn't have an invite code table yet)
  // In a real app we'd fetch or generate an invite code for this classId.
  const inviteCode = cls?.id.slice(0, 6).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative p-6 space-y-6">
        <div className="h-8 w-48 bg-surface animate-pulse rounded-xl" />
        <div className="h-40 bg-surface animate-pulse rounded-xl" />
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-surface animate-pulse rounded-xl" />
          <div className="h-10 w-32 bg-surface animate-pulse rounded-xl" />
        </div>
        <div className="h-96 bg-surface animate-pulse rounded-xl" />
      </div>
    );
  }

  if (error || !cls) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-error mx-auto opacity-80" />
          <h2 className="font-display text-xl font-bold">Class not found</h2>
          <p className="text-foreground-muted text-sm">This class may have been deleted or you don't have access.</p>
          <button onClick={() => router.back()} className="text-sm font-medium text-accent hover:text-accent-light">Go Back</button>
        </div>
      </div>
    );
  }

  const totalAssignments = cls.assignments.length;
  // Calculate class average from member stats
  const classAvgScore = cls.memberStats.length > 0
    ? Math.round(cls.memberStats.reduce((acc, m) => acc + (m.avgScore || 0), 0) / cls.memberStats.length)
    : 0;

  return (
    <div className="min-h-screen relative">
      <GradientMesh />
      <div className="max-w-6xl mx-auto space-y-6 pb-24 lg:pb-8 px-4 md:px-6 lg:px-8 pt-8">
        
        {/* Header & Overview */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 bg-accent/5 blur-[100px] rounded-full w-64 h-64 pointer-events-none" />
            
            <div className="space-y-2 z-10">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{cls.name}</h1>
              <p className="text-foreground-muted text-sm flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {cls.memberStats.length} Students</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {totalAssignments} Assignments</span>
              </p>
            </div>

            <div className="flex items-center gap-4 z-10 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="bg-surface/50 border border-card-border p-4 rounded-xl min-w-[120px]">
                <p className="text-xs text-foreground-subtle font-medium uppercase tracking-wider mb-1">Avg Score</p>
                <p className="text-2xl font-bold text-success flex items-baseline gap-1">
                  {classAvgScore}%
                  <TrendingUp className="w-4 h-4 text-success/70" />
                </p>
              </div>
              <div className="bg-surface/50 border border-card-border p-4 rounded-xl min-w-[200px]">
                <p className="text-xs text-foreground-subtle font-medium uppercase tracking-wider mb-1">Invite Code</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold font-mono tracking-widest text-accent-light">{inviteCode}</p>
                  <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-foreground-muted group-hover:text-foreground" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex pb-2 border-b border-card-border gap-6">
          <button
            onClick={() => setActiveTab("STUDENTS")}
            className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === "STUDENTS" ? "text-accent-light" : "text-foreground-muted hover:text-foreground"}`}
          >
            Students
            {activeTab === "STUDENTS" && <motion.div layoutId="clstab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-light rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab("ASSIGNMENTS")}
            className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === "ASSIGNMENTS" ? "text-accent-light" : "text-foreground-muted hover:text-foreground"}`}
          >
            Assignments
            {activeTab === "ASSIGNMENTS" && <motion.div layoutId="clstab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-light rounded-t-full" />}
          </button>
        </motion.div>

        {/* Tab Content */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {activeTab === "STUDENTS" && (
            <div className="card overflow-hidden">
              {cls.memberStats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="w-12 h-12 text-foreground-subtle mb-4 opacity-50" />
                  <h3 className="font-display text-lg font-semibold">No students enrolled</h3>
                  <p className="text-sm text-foreground-muted mt-1 max-w-sm mb-6">
                    Share the invite code <strong className="text-foreground">{inviteCode}</strong> with your students so they can join this class.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-card-border bg-surface/30">
                        <th className="px-6 py-4 font-medium text-foreground-subtle">Student</th>
                        <th className="px-6 py-4 font-medium text-foreground-subtle">Grade Lvl</th>
                        <th className="px-6 py-4 font-medium text-foreground-subtle">Completed Subs</th>
                        <th className="px-6 py-4 font-medium text-foreground-subtle">Avg Score</th>
                        <th className="px-6 py-4 font-medium text-foreground-subtle">Total XP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {cls.memberStats.map(student => (
                        <tr key={student.id} className="hover:bg-surface/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-surface border border-card-border flex items-center justify-center font-bold text-xs">
                                {student.name?.[0] || "?"}
                              </div>
                              <div>
                                <p className="font-medium">{student.name || "Unknown"}</p>
                                <p className="text-xs text-foreground-subtle">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground-muted">{student.gradeLevel ? `Grade ${student.gradeLevel}` : "—"}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-card-border font-medium text-xs">
                              <FileText className="w-3.5 h-3.5 text-foreground-subtle" />
                              {student.completedCount} / {totalAssignments}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground">{student.avgScore !== null ? `${student.avgScore}%` : "—"}</td>
                          <td className="px-6 py-4 font-semibold text-accent-light flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-yellow-400" />{student.totalXPEarned} XP</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "ASSIGNMENTS" && (
            <div className="grid grid-cols-1 gap-4">
              {cls.assignments.length === 0 ? (
                <div className="card flex flex-col items-center justify-center py-16 text-center">
                  <BookOpen className="w-12 h-12 text-foreground-subtle mb-4 opacity-50" />
                  <h3 className="font-display text-lg font-semibold">No assignments created</h3>
                  <p className="text-sm text-foreground-muted mt-1 max-w-sm mb-6">
                    Create an AI-powered assignment to get your class started.
                  </p>
                  <button onClick={() => router.push('/dashboard/teacher/create-assignment')} className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-light transition-colors">
                    Create Assignment
                  </button>
                </div>
              ) : (
                cls.assignments.map(assignment => (
                  <div key={assignment.id} className="card p-5 flex flex-col sm:flex-row cursor-default sm:items-center justify-between gap-4 group">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{assignment.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-foreground-subtle">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        {assignment.suggestedTool && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-card-border" />
                            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> {assignment.suggestedTool.name}</span>
                          </>
                        )}
                        <span className="w-1 h-1 rounded-full bg-card-border" />
                        <span className="font-medium text-accent-light">+{assignment.xpReward} XP</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col items-center sm:items-end">
                         <span className="text-sm font-bold">{assignment._count.submissions} / {cls.memberStats.length}</span>
                         <span className="text-[10px] text-foreground-subtle uppercase tracking-wider font-medium">Submissions</span>
                       </div>
                       {/* This could link to grading filtered by this assignment */}
                       <button onClick={() => router.push(`/dashboard/teacher/grading`)} className="px-4 py-2 text-sm font-medium bg-surface hover:bg-surface-hover border border-card-border rounded-lg transition-colors">
                         View
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
