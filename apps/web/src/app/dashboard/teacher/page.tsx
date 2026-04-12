"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTeacherDashboard } from "@web/hooks/use-teacher";
import { GradientMesh } from "@web/components/ui/background";
import {
  GraduationCap,
  Clock,
  Users,
  BarChart3,
  PlusCircle,
  ArrowUpRight,
  FileText,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

// ─── Sophisticated Motion Variants ──────────────────────────────────────

const smoothEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smoothEase },
  },
};

// ─── Premium UI Sub-components ────────────────────────────────────────────

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 lg:p-8 shadow-2xl transition-all duration-500 hover:border-white/10 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] ${className}`}>
      {children}
    </div>
  );
}

function MiniStat({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <GlassCard className="!p-5 flex items-center gap-4 h-full">
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-semibold leading-none">{value}</p>
      </div>
    </GlassCard>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  return `${diffD}d ago`;
}

// ─── Main Page ───────────────────────────────────────────────────────────

export default function TeacherDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "Teacher";
  const { data, isLoading } = useTeacherDashboard();

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const recentSubmissions = data?.recentSubmissions || [];
  const totalPages = Math.max(1, Math.ceil(recentSubmissions.length / itemsPerPage));

  const currentSubmissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return recentSubmissions.slice(start, start + itemsPerPage);
  }, [recentSubmissions, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen relative selection:bg-accent/30">
      <GradientMesh className="opacity-40" />

      <div className="max-w-7xl mx-auto space-y-8 pb-24 lg:pb-12 px-4 md:px-8 pt-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-foreground">
                {getGreeting()}, <span className="text-foreground-muted">{userName.split(" ")[0]}.</span>
              </h1>
              <p className="text-sm md:text-base text-foreground-subtle mt-3 font-medium tracking-wide">
                {isLoading ? "Loading your teaching overview..." : (
                  <>You have <span className="text-foreground">{data?.activeAssignments ?? 0}</span> active assignments and <span className="text-warning">{data?.pendingSubmissions ?? 0}</span> pending submissions.</>
                )}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-surface/30 backdrop-blur-xl border border-white/5 px-5 py-3 rounded-2xl shadow-xl">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
                <GraduationCap className="w-5 h-5 text-accent-light" />
              </div>
              <div>
                <p className="text-xs text-foreground-subtle font-medium uppercase tracking-wider mb-0.5">Faculty Status</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold leading-none text-accent-light">Active</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Bento Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            <MiniStat title="Assignments" value={data?.activeAssignments ?? 0} icon={<FileText className="w-5 h-5 text-accent-light" />} />
            <MiniStat title="To Grade" value={data?.pendingSubmissions ?? 0} icon={<Clock className="w-5 h-5 text-warning" />} />
            <MiniStat title="Students" value={data?.totalStudents ?? 0} icon={<Users className="w-5 h-5 text-info" />} />
            <MiniStat title="Avg Grade" value={data?.averageGrade != null ? `${Math.round(data.averageGrade)}%` : "—"} icon={<BarChart3 className="w-5 h-5 text-success" />} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <GlassCard className="!p-6">
              <h2 className="text-xs font-bold text-foreground-subtle uppercase tracking-widest mb-5 ml-2">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction
                  icon={<PlusCircle className="w-5 h-5" />}
                  label="Create Assignment"
                  href="/dashboard/teacher/create-assignment"
                  primary
                />
                <QuickAction
                  icon={<Eye className="w-5 h-5" />}
                  label="View Classes"
                  href="/dashboard/teacher/classes"
                />
                <QuickAction
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Class Analytics"
                  href="/dashboard/teacher/analytics"
                />
                <QuickAction
                  icon={<Clock className="w-5 h-5" />}
                  label="Pending Grading"
                  href="/dashboard/teacher/grading"
                  badge={data?.pendingSubmissions}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Submissions Queue (With Pagination) */}
            <div className="lg:col-span-2 space-y-6 flex flex-col">
              <motion.div variants={itemVariants} className="flex-1">
                <GlassCard className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-foreground-muted" />
                      <h2 className="text-base font-medium text-foreground tracking-wide">Recent Submissions</h2>
                    </div>
                    {(recentSubmissions.length > 0) && (
                      <a href="/dashboard/teacher/grading" className="text-xs font-medium text-foreground-subtle hover:text-foreground transition-colors flex items-center gap-1">
                        Grade all <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                      ))}
                    </div>
                  ) : recentSubmissions.length === 0 ? (
                    <EmptyState
                      icon={<CheckCircle2 className="w-8 h-8 text-foreground-subtle" />}
                      title="No submissions yet"
                      description="Student submissions will appear here once they turn in work."
                    />
                  ) : (
                    <div className="flex flex-col flex-1 justify-between">
                      <div className="space-y-2 mb-6">
                        <AnimatePresence mode="popLayout">
                          {currentSubmissions.map((sub) => (
                            <SubmissionRow key={sub.id} sub={sub} />
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                          <span className="text-xs text-foreground-subtle font-medium">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, recentSubmissions.length)} of {recentSubmissions.length}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-foreground hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-semibold px-2">{currentPage} / {totalPages}</span>
                            <button
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-foreground hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>

            {/* Right: Class Performance */}
            <div className="space-y-6">
              <motion.div variants={itemVariants} className="h-full">
                <GlassCard className="h-full">
                  <h3 className="text-xs font-bold text-foreground-subtle uppercase tracking-widest mb-6">
                    Class Performance
                  </h3>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 rounded bg-white/5 animate-pulse" />
                      ))}
                    </div>
                  ) : data ? (
                    <div className="space-y-6">
                      <PerformanceMetric
                        label="Completion Rate"
                        value={data.completionRate}
                        suffix="%"
                        color="var(--color-success)"
                      />
                      {data.averageGrade != null && (
                        <PerformanceMetric
                          label="Average Score"
                          value={Math.round(data.averageGrade)}
                          suffix="%"
                          color="var(--color-accent)"
                        />
                      )}

                      <div className="pt-5 border-t border-white/5 space-y-3">
                        <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-2">Your Classes</p>
                        {data.classInfo.length > 0 ? (
                          data.classInfo.map((cls) => (
                            <a
                              key={cls.id}
                              href={`/dashboard/teacher/classes/${cls.id}`}
                              className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/10 transition-all group"
                            >
                              <span className="text-sm font-medium text-foreground group-hover:text-accent-light transition-colors truncate">{cls.name}</span>
                              <span className="text-xs font-semibold text-foreground-muted bg-surface/50 px-2 py-1 rounded-md border border-white/5">
                                {cls._count?.members ?? 0} students
                              </span>
                            </a>
                          ))
                        ) : (
                          <p className="text-xs text-foreground-subtle text-center py-4 bg-white/5 rounded-xl border border-white/5">No classes created yet</p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </GlassCard>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────

function QuickAction({ icon, label, href, primary = false, badge }: { icon: React.ReactNode; label: string; href: string; primary?: boolean; badge?: number; }) {
  return (
    <a
      href={href}
      className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-[1.5rem] border transition-all duration-300 ${primary
          ? "bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
          : "bg-white/[0.02] border-white/5 hover:bg-white/10 hover:border-white/10"
        }`}
    >
      <div className="relative">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${primary ? "bg-accent/20 text-accent-light" : "bg-white/5 text-foreground-muted group-hover:text-foreground"} transition-colors`}>
          {icon}
        </div>
        {badge != null && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning border-2 border-background text-[10px] font-black flex items-center justify-center text-white shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <span className={`text-xs font-semibold text-center leading-tight ${primary ? "text-accent-light" : "text-foreground-subtle group-hover:text-foreground"} transition-colors`}>{label}</span>
    </a>
  );
}

function SubmissionRow({ sub }: { sub: any }) {
  const needsGrading = sub.status === "SUBMITTED";
  return (
    <motion.a
      href={`/dashboard/teacher/grading/${sub.id}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/10 transition-all duration-300 gap-4"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-foreground shadow-inner flex-shrink-0 group-hover:from-accent/20 group-hover:to-accent/5 group-hover:text-accent-light transition-all">
          {sub.studentName[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground group-hover:text-accent-light transition-colors truncate">
            {sub.studentName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] text-foreground-subtle truncate max-w-[200px] sm:max-w-xs">
              {sub.assignmentTitle}
            </p>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <p className="text-[11px] text-foreground-muted font-medium">
              {timeAgo(sub.submittedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${needsGrading ? "bg-warning/10 text-warning border-warning/20" : "bg-white/5 text-foreground-subtle border-white/5"}`}>
          {needsGrading ? "Needs Grading" : sub.status}
        </span>
        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/10 transition-all duration-300">
          <ArrowUpRight className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </motion.a>
  );
}

function PerformanceMetric({ label, value, suffix, color }: { label: string; value: number; suffix: string; color: string; }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-foreground-muted">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value}{suffix}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 1.5, ease: smoothEase }}
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
        >
          <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center h-full">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-foreground-muted">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-foreground-subtle max-w-xs mt-1">{description}</p>
    </div>
  );
}