"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDashboardStats, useAssignments, useTools } from "@web/hooks/use-dashboard";
import { Progress } from "@web/components/ui/progress";
import { GradientMesh } from "@web/components/ui/background";
import {
  Flame,
  Trophy,
  Award,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  LayoutGrid,
  Activity,
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

// ─── Helpers ─────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDaysUntilDue(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  return Math.max(0, Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

// ─── Main Page ───────────────────────────────────────────────────────────

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || "Student";

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: assignments, isLoading: assignLoading } = useAssignments();
  const { data: tools } = useTools();

  const activeAssignments = useMemo(() => {
    if (!assignments) return [];
    return assignments
      .filter((a) => !a.submissions || a.submissions.length === 0)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [assignments]);

  const recentActivity = useMemo(() => {
    if (!stats) return [];
    return [
      { label: "Earned 50 XP for submission", time: "2h ago", xp: 50 },
      { label: "Completed daily challenge", time: "5h ago", xp: 50 },
      { label: "Streak bonus: 3 days!", time: "1d ago", xp: 15 },
    ];
  }, [stats]);

  const quickTools = useMemo(() => {
    if (!tools) return [];
    return tools.slice(0, 4);
  }, [tools]);

  const levelProgress = useMemo(() => {
    if (!stats) return 0;
    return Math.min(100, stats.xp.total % 100);
  }, [stats]);

  return (
    <div className="min-h-screen relative selection:bg-accent/30">
      {/* Subtle, moody background mesh */}
      <GradientMesh className="opacity-40" />

      <div className="max-w-7xl mx-auto space-y-8 pb-24 lg:pb-12 px-4 md:px-8 pt-8 relative z-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: smoothEase }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-foreground">
              Welcome back, <span className="text-foreground-muted">{userName}.</span>
            </h1>
            <p className="text-sm md:text-base text-foreground-subtle mt-3 font-medium tracking-wide">
              Here is your learning overview for today.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-surface/30 backdrop-blur-xl border border-white/5 px-5 py-3 rounded-2xl shadow-xl">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
              <Sparkles className="w-5 h-5 text-accent-light" />
            </div>
            <div>
              <p className="text-xs text-foreground-subtle font-medium uppercase tracking-wider mb-0.5">Current Level</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold leading-none">{stats?.xp.level ?? 1}</span>
                <span className="text-xs text-accent-light font-medium">({stats?.xp.total ?? 0} XP)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Level Progress - Span 8 */}
          <motion.div variants={itemVariants} className="md:col-span-8">
            <GlassCard className="h-full flex flex-col justify-between">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-foreground-subtle uppercase tracking-wider mb-1">
                    Next Milestone
                  </h3>
                  <p className="text-2xl font-medium text-foreground">
                    Level {stats?.xp.level ? stats.xp.level + 1 : 2}
                  </p>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-surface-hover border border-white/5 text-xs font-medium text-foreground-muted">
                  +{stats?.xp.thisWeek ?? 0} XP this week
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-foreground-muted mb-3">
                  <span>Progress</span>
                  <span>{stats?.xp.toNextLevel ?? 100} XP remaining</span>
                </div>
                {statsLoading ? (
                  <div className="h-2 rounded-full bg-white/5 animate-pulse" />
                ) : (
                  <div className="h-2 bg-surface-hover rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress}%` }}
                      transition={{ duration: 1.5, ease: smoothEase }}
                      className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full relative"
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent" />
                    </motion.div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Daily Challenge - Span 4 */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <GlassCard className="h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-warning" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-warning border border-warning/20 px-2 py-1 rounded-full">
                  Daily
                </span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2 relative z-10">Use an AI Tool</h3>
              <p className="text-sm text-foreground-muted mb-6 relative z-10">Boost your workflow today.</p>

              <div className="flex items-center justify-between mt-auto relative z-10 pt-4 border-t border-white/5">
                <span className="text-sm font-semibold text-accent-light">+50 XP</span>
                <span className="text-xs text-foreground-subtle flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 14h left
                </span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Mini Stats Row */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <MiniStat title="Day Streak" value={stats?.streak.current ?? 0} icon={<Flame className="w-4 h-4 text-warning" />} />
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-4">
            <MiniStat title="Class Rank" value={`#${stats?.classRank ?? "—"}`} icon={<Trophy className="w-4 h-4 text-amber-400" />} />
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-4">
            <MiniStat title="Badges Earned" value={stats?.badges.earned ?? 0} icon={<Award className="w-4 h-4 text-accent" />} />
          </motion.div>

          {/* Active Quests - Span 8 */}
          <motion.div variants={itemVariants} className="md:col-span-8">
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-foreground-muted" />
                  <h2 className="text-base font-medium text-foreground tracking-wide">Active Assignments</h2>
                </div>
                <a href="/dashboard/classroom" className="text-xs font-medium text-foreground-subtle hover:text-foreground transition-colors flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              {assignLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
                </div>
              ) : activeAssignments.length === 0 ? (
                <EmptyState icon={<CheckCircle2 className="w-6 h-6 text-foreground-subtle" />} message="All caught up. No pending assignments." />
              ) : (
                <div className="space-y-2">
                  {activeAssignments.map((a) => (
                    <AssignmentRow key={a.id} assignment={a} daysUntilDue={getDaysUntilDue(a.dueDate)} />
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Tools & Activity Stack - Span 4 */}
          <div className="md:col-span-4 flex flex-col gap-6">

            {/* Quick Tools */}
            <motion.div variants={itemVariants} className="flex-1">
              <GlassCard className="h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-foreground-muted" />
                    <h2 className="text-base font-medium text-foreground tracking-wide">Quick Tools</h2>
                  </div>
                </div>

                {!tools || tools.length === 0 ? (
                  <EmptyState icon={<LayoutGrid className="w-5 h-5 text-foreground-subtle" />} message="No tools accessed yet." />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {quickTools.map((tool) => (
                      <ToolSquare key={tool.id} tool={tool} />
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="flex-1">
              <GlassCard className="h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-foreground-muted" />
                    <h2 className="text-base font-medium text-foreground tracking-wide">Activity</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start justify-between group cursor-default">
                      <div>
                        <p className="text-sm text-foreground-muted group-hover:text-foreground transition-colors duration-300">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-foreground-subtle mt-0.5">{item.time}</p>
                      </div>
                      {item.xp && (
                        <span className="text-xs font-medium text-success/80">+{item.xp}</span>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Refined Sub-components ──────────────────────────────────────────────

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 lg:p-8 shadow-2xl transition-all duration-500 hover:border-white/10 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] ${className}`}>
      {children}
    </div>
  );
}

function MiniStat({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <GlassCard className="!p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-foreground-subtle uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-semibold leading-none">{value}</p>
      </div>
    </GlassCard>
  );
}

function AssignmentRow({ assignment, daysUntilDue }: { assignment: any; daysUntilDue: number }) {
  const isUrgent = daysUntilDue <= 1;

  return (
    <a href={`/dashboard/classroom/${assignment.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 -mx-4 rounded-2xl hover:bg-white/5 transition-colors duration-300 gap-4">
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-foreground group-hover:text-accent-light transition-colors duration-300 truncate mb-1.5">
          {assignment.title}
        </h4>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-foreground-muted">{assignment.className}</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className={`text-[11px] font-medium ${isUrgent ? 'text-error/90' : 'text-foreground-subtle'}`}>
            {daysUntilDue === 0 ? "Due today" : `${daysUntilDue} days left`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <span className="text-xs font-medium text-success/80 bg-success/10 px-2.5 py-1 rounded-md">
          +{assignment.xpReward} XP
        </span>
        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/10 transition-all duration-300">
          <ArrowUpRight className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </a>
  );
}

function ToolSquare({ tool }: { tool: any }) {
  return (
    <a href={`/dashboard/tools/${tool.id}`} className="group aspect-square rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white relative z-10 shadow-lg"
        style={{ backgroundColor: tool.brandColor || "var(--color-accent)" }}
      >
        {tool.name[0]}
      </div>
      <span className="text-xs font-medium text-foreground-subtle group-hover:text-foreground transition-colors relative z-10 w-full text-center px-2 truncate">
        {tool.name}
      </span>
    </a>
  );
}

function EmptyState({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground-subtle">{message}</p>
    </div>
  );
}