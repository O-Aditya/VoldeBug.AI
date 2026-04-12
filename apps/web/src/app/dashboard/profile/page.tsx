"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDashboardStats } from "@web/hooks/use-dashboard";
import { useTeacherDashboard } from "@web/hooks/use-teacher";
import { useSubmissionHistory } from "@web/hooks/use-classroom";
import { GradientMesh } from "@web/components/ui/background";
import {
  Zap, Trophy, Award, Flame, Star,
  BookOpen, TrendingUp, Edit3, Camera, Users, FileText
} from "lucide-react";

// ─── Motion Variants ──────────────────────────────────────────────────────
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

// ─── XP Level calculation ────────────────────────────────────────────────
function getLevel(totalXP: number) {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

function xpForLevel(level: number) {
  return (level - 1) ** 2 * 100;
}

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
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-medium leading-none">{value}</p>
      </div>
    </GlassCard>
  );
}

// ─── Teacher Profile ──────────────────────────────────────────────────────
function TeacherProfile({ name, email }: { name: string; email: string }) {
  const { data: stats } = useTeacherDashboard();

  return (
    <div className="max-w-5xl mx-auto pb-24 lg:pb-12 px-4 md:px-8 pt-8 relative z-10">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

        {/* Profile Hero */}
        <motion.div variants={itemVariants}>
          <GlassCard className="relative overflow-hidden">
            {/* Subtle glow behind avatar */}
            <div className="absolute top-0 left-8 w-48 h-48 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-medium text-4xl shadow-2xl border border-white/10">
                  {name[0]?.toUpperCase() ?? "T"}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface border border-white/10 text-foreground flex items-center justify-center shadow-xl hover:bg-white/10 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">{name}</h1>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-light border border-accent/20 bg-accent/10 px-2.5 py-1 rounded-full">
                    Faculty
                  </span>
                </div>
                {email && <p className="text-sm font-medium text-foreground-subtle">{email}</p>}
              </div>

              <button className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm font-medium hover:bg-white/10 transition-colors">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Academic Overview */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xs font-bold text-foreground-subtle uppercase tracking-widest mb-4 ml-2">Academic Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <MiniStat title="Active Classes" value={stats?.classInfo?.length ?? 0} icon={<BookOpen className="w-5 h-5 text-indigo-400" />} />
            <MiniStat title="Total Students" value={stats?.totalStudents ?? 0} icon={<Users className="w-5 h-5 text-amber-400" />} />
            <MiniStat title="Assignments" value={stats?.activeAssignments ?? 0} icon={<FileText className="w-5 h-5 text-emerald-400" />} />
            <MiniStat title="Avg Completion" value={stats?.completionRate != null ? `${stats?.completionRate}%` : "—"} icon={<TrendingUp className="w-5 h-5 text-cyan-400" />} />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

// ─── Student Profile ──────────────────────────────────────────────────────
function StudentProfile({ name, email }: { name: string; email: string }) {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: submissions } = useSubmissionHistory();

  const totalXP = stats?.xp.total ?? 0;
  const level = getLevel(totalXP);
  const xpStart = xpForLevel(level);
  const xpEnd = xpForLevel(level + 1);
  const progress = totalXP > 0 ? Math.round(((totalXP - xpStart) / (xpEnd - xpStart)) * 100) : 0;

  const submissionStats = useMemo(() => {
    if (!submissions) return { total: 0, graded: 0, avgScore: null as number | null };
    const graded = submissions.filter((s: any) => s.status === "GRADED");
    const avgScore = graded.length > 0
      ? Math.round(graded.reduce((acc: number, s: any) => acc + (s.score ?? 0), 0) / graded.length)
      : null;
    return { total: submissions.length, graded: graded.length, avgScore };
  }, [submissions]);

  return (
    <div className="max-w-5xl mx-auto pb-24 lg:pb-12 px-4 md:px-8 pt-8 relative z-10">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

        {/* Profile Hero & Level Progress */}
        <motion.div variants={itemVariants}>
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 left-8 w-48 h-48 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-medium text-4xl shadow-2xl border border-white/10">
                  {name[0]?.toUpperCase() ?? "S"}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface border border-white/10 text-foreground flex items-center justify-center shadow-xl hover:bg-white/10 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="font-display text-3xl font-medium tracking-tight text-foreground mb-1">{name}</h1>
                {email && <p className="text-sm font-medium text-foreground-subtle mb-4">{email}</p>}

                {/* Level Progress */}
                <div className="max-w-md">
                  <div className="flex items-center justify-between text-xs font-medium text-foreground-muted mb-2">
                    <span>Level {level}</span>
                    <span>{(xpEnd - totalXP).toLocaleString()} XP to Level {level + 1}</span>
                  </div>
                  {statsLoading ? (
                    <div className="h-2 rounded-full bg-white/5 animate-pulse" />
                  ) : (
                    <div className="h-2 bg-surface-hover rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: smoothEase }}
                        className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full relative"
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent" />
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm font-medium hover:bg-white/10 transition-colors">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xs font-bold text-foreground-subtle uppercase tracking-widest mb-4 ml-2">Learning Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <MiniStat title="Assignments" value={submissionStats.total} icon={<BookOpen className="w-5 h-5 text-indigo-400" />} />
            <MiniStat title="Avg Score" value={submissionStats.avgScore != null ? `${submissionStats.avgScore}%` : "—"} icon={<Star className="w-5 h-5 text-amber-400" />} />
            <MiniStat title="Day Streak" value={stats?.streak.current ?? 0} icon={<Flame className="w-5 h-5 text-orange-400" />} />
            <MiniStat title="Total XP" value={(stats?.xp.total ?? 0).toLocaleString()} icon={<Zap className="w-5 h-5 text-emerald-400" />} />
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-yellow-400" />
                <h2 className="text-base font-medium text-foreground tracking-wide">Earned Badges</h2>
              </div>
              <span className="text-xs font-medium text-foreground-subtle bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {stats?.badges?.earned ?? 0} Total
              </span>
            </div>

            {!stats?.badges?.items || stats.badges.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-foreground-subtle" />
                </div>
                <p className="text-sm font-medium text-foreground-subtle">Complete your first assignment to earn a badge!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.badges.items.map((badge: any, i: number) => (
                  <motion.div
                    key={badge.key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: smoothEase }}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all text-center group"
                  >
                    <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent group-hover:border-white/20 transition-all shadow-lg">
                      {badge.icon.startsWith('/') ? <img src={badge.icon} alt={badge.name} className="w-8 h-8 object-contain" /> : badge.icon || '🏅'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-0.5">{badge.name}</p>
                      <p className="text-[10px] text-foreground-subtle leading-tight px-2">{badge.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const name = user?.name ?? (user?.role === "TEACHER" ? "Teacher" : "Student");
  const email = user?.email ?? "";

  return (
    <div className="min-h-screen relative selection:bg-accent/30">
      <GradientMesh className="opacity-40" />
      {user?.role === "TEACHER" ? (
        <TeacherProfile name={name} email={email} />
      ) : (
        <StudentProfile name={name} email={email} />
      )}
    </div>
  );
}