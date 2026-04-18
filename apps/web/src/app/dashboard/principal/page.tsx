"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useAdminDashboard, useAuditLogs } from "@web/hooks/use-admin";
import { GradientMesh } from "@web/components/ui/background";
import {
  Shield,
  Users,
  GraduationCap,
  Activity,
  AlertOctagon,
  ShieldAlert,
  Eye,
  Clock,
  Bot,
  FileWarning,
  ChevronRight,
  Building2,
  TrendingUp,
  BookOpen,
} from "lucide-react";

// ─── Corporate Motion Variants ──────────────────────────────────────────

const smoothEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

// ─── Premium Corporate Sub-components ───────────────────────────────────

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

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + "…";
}

// ─── Severity Badge ─────────────────────────────────────────────────────

function SeverityBadge({ flagged }: { flagged: boolean }) {
  if (flagged) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20">
        <AlertOctagon className="w-3 h-3" />
        Blocked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
      Safe
    </span>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="bg-surface/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-5 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-2.5 w-16 bg-white/5 rounded" />
        <div className="h-6 w-12 bg-white/5 rounded" />
      </div>
    </div>
  );
}

function AlertSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/5" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-32 bg-white/5 rounded" />
          <div className="h-2.5 w-20 bg-white/5 rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-white/5 rounded" />
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────

export default function PrincipalDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "Principal";

  const { data: overview, isLoading: overviewLoading } = useAdminDashboard();
  const { data: auditData, isLoading: auditLoading } = useAuditLogs({ limit: 10, flagged: true });

  const flaggedAlerts = useMemo(() => auditData?.logs ?? [], [auditData]);

  return (
    <div className="min-h-screen relative selection:bg-[#0D1B2A]/30">
      <GradientMesh />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6 pb-24 lg:pb-8 px-4 md:px-6 lg:px-8"
      >
        {/* ── Hero Header ──────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="pt-6 pb-2">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0D1B2A] border border-[#1B2B40] flex items-center justify-center shadow-lg flex-shrink-0">
              <Shield className="w-7 h-7 text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-foreground-subtle font-medium mb-0.5">
                {getGreeting()}, {userName}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                Principal Command Center
              </h1>
              <p className="text-foreground-subtle text-sm mt-1 max-w-lg">
                School-wide data and CBSE safety compliance —{" "}
                {overview?.school?.name ?? "Loading…"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── KPI Grid ───────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {overviewLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <MiniStat
                title="Total Students"
                value={overview?.totalStudents ?? 0}
                icon={<Users className="w-5 h-5 text-sky-400" />}
              />
              <MiniStat
                title="Active Teachers"
                value={overview?.totalTeachers ?? 0}
                icon={<GraduationCap className="w-5 h-5 text-emerald-400" />}
              />
              <MiniStat
                title="AI Sessions"
                value={overview?.auditLogs?.total ?? 0}
                icon={<Activity className="w-5 h-5 text-violet-400" />}
              />
              <MiniStat
                title="Safety Interventions"
                value={overview?.auditLogs?.flagged ?? 0}
                icon={<ShieldAlert className="w-5 h-5 text-red-400" />}
              />
            </>
          )}
        </motion.div>

        {/* ── Institutional Summary Row ────────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <GlassCard className="!p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#0D1B2A] border border-[#1B2B40] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-xs font-bold text-foreground-subtle uppercase tracking-widest">Assignments</p>
            </div>
            <p className="text-3xl font-bold">{overview?.totalAssignments ?? "—"}</p>
            <p className="text-xs text-foreground-subtle mt-1">
              {overview?.totalSubmissions ?? 0} total submissions
            </p>
          </GlassCard>

          <GlassCard className="!p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#0D1B2A] border border-[#1B2B40] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-foreground-subtle uppercase tracking-widest">Average Score</p>
            </div>
            <p className="text-3xl font-bold">
              {overview?.averageScore != null ? `${overview.averageScore}%` : "—"}
            </p>
            <p className="text-xs text-foreground-subtle mt-1">
              across {overview?.gradedCount ?? 0} graded submissions
            </p>
          </GlassCard>

          <GlassCard className="!p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#0D1B2A] border border-[#1B2B40] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs font-bold text-foreground-subtle uppercase tracking-widest">This Week</p>
            </div>
            <p className="text-3xl font-bold">{overview?.recentSubmissions ?? 0}</p>
            <p className="text-xs text-foreground-subtle mt-1">
              submissions in the last 7 days
            </p>
          </GlassCard>
        </motion.div>

        {/* ── Recent Safety Alerts ──────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <FileWarning className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">Recent Safety Alerts</h2>
                  <p className="text-xs text-foreground-subtle">Blocked inappropriate prompts flagged by AI safety filters</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest">
                {overview?.auditLogs?.flagged ?? 0} Total
              </span>
            </div>

            {auditLoading ? (
              <div className="space-y-3">
                <AlertSkeleton />
                <AlertSkeleton />
                <AlertSkeleton />
              </div>
            ) : flaggedAlerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-foreground-subtle text-sm font-medium">All Clear</p>
                <p className="text-foreground-subtle/60 text-xs mt-1">No safety violations detected</p>
              </div>
            ) : (
              <div className="space-y-2">
                {flaggedAlerts.map((log, idx) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.5, ease: smoothEase }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/15 hover:bg-red-500/[0.03] transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#0D1B2A] border border-[#1B2B40] flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {log.student?.name ?? "Unknown Student"}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-foreground-subtle">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo(log.timestamp)}</span>
                            <span className="text-white/10">|</span>
                            <span className="text-violet-400/80">{log.toolUsed}</span>
                          </div>
                        </div>
                      </div>
                      <SeverityBadge flagged={log.isFlagged} />
                    </div>
                    <div className="pl-11">
                      <p className="text-xs text-foreground-subtle/80 leading-relaxed bg-red-500/[0.04] border border-red-500/10 rounded-lg px-3 py-2">
                        <span className="font-semibold text-red-400/90">Prompt: </span>
                        {truncateText(log.promptText, 180)}
                      </p>
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
