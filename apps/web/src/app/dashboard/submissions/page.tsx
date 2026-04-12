"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmissionHistory } from "@web/hooks/use-classroom";
import { GradientMesh } from "@web/components/ui/background";
import {
  History, CheckCircle2, Clock, Star, FileText, ChevronRight,
  Zap, Award, AlertCircle
} from "lucide-react";

// ─── Types & helpers ───────────────────────────────────────────────────────

type StatusFilter = "" | "SUBMITTED" | "GRADED" | "RETURNED";

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "", label: "All" },
  { key: "SUBMITTED", label: "Submitted" },
  { key: "GRADED", label: "Graded" },
  { key: "RETURNED", label: "Returned" },
];

function statusConfig(status: string) {
  switch (status) {
    case "GRADED":
      return { label: "Graded", color: "text-success", bg: "bg-success/10 border-success/20", icon: CheckCircle2 };
    case "RETURNED":
      return { label: "Returned", color: "text-info", bg: "bg-info/10 border-info/20", icon: Star };
    default:
      return { label: "Awaiting grade", color: "text-warning", bg: "bg-warning/10 border-warning/20", icon: Clock };
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────

function SubmissionCard({ sub, index }: { sub: any; index: number }) {
  const { label, color, bg, icon: Icon } = statusConfig(sub.status);
  const toolColor = sub.assignment?.suggestedTool?.brandColor || "#6366f1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="card p-5"
    >
      <div className="flex items-start gap-4">
        {/* Tool icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: toolColor }}
        >
          {sub.assignment?.title?.[0] ?? "?"}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + timestamp */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm truncate">
                {sub.assignment?.title ?? "Assignment"}
              </p>
              <p className="text-xs text-foreground-subtle mt-0.5">{timeAgo(sub.submittedAt)}</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border flex-shrink-0 ${bg} ${color}`}>
              <Icon className="w-3 h-3" />
              {label}
            </span>
          </div>

          {/* Score + XP */}
          <div className="flex items-center gap-4 mt-3">
            {sub.score != null && (
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-semibold">{sub.score}%</span>
                {sub.grade && <span className="text-foreground-subtle">· {sub.grade}</span>}
              </div>
            )}
            {sub.xpAwarded && (
              <div className="flex items-center gap-1 text-xs text-success font-semibold">
                <Zap className="w-3 h-3" />
                +{sub.xpAwarded} XP
              </div>
            )}
            {sub.fileUrls?.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-foreground-subtle">
                <FileText className="w-3 h-3" />
                {sub.fileUrls.length} file{sub.fileUrls.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Feedback */}
          {sub.feedback && (
            <div className="mt-3 pt-3 border-t border-card-border">
              <p className="text-xs font-medium text-foreground-subtle mb-1">Teacher Feedback</p>
              <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                {sub.feedback}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
        <History className="w-8 h-8 text-foreground-subtle opacity-40" />
      </div>
      <p className="font-display text-base font-semibold mb-1">No submissions yet</p>
      <p className="text-sm text-foreground-subtle max-w-xs">
        Submit your first assignment to see your history here.
      </p>
      <a href="/dashboard/classroom" className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent-light hover:underline">
        View assignments <ChevronRight className="w-4 h-4" />
      </a>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────

function StatsBar({ submissions }: { submissions: any[] }) {
  const graded = submissions.filter((s) => s.status === "GRADED");
  const totalXP = submissions.reduce((a, s) => a + (s.xpAwarded ?? 0), 0);
  const avgScore = graded.length > 0
    ? Math.round(graded.reduce((a, s) => a + (s.score ?? 0), 0) / graded.length)
    : null;

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {[
        { label: "Submitted", value: submissions.length, icon: FileText, color: "text-accent-light" },
        { label: "Avg Score", value: avgScore != null ? `${avgScore}%` : "—", icon: Star, color: "text-yellow-400" },
        { label: "XP Earned", value: `${totalXP.toLocaleString()}`, icon: Zap, color: "text-success" },
      ].map((s) => (
        <div key={s.label} className="card p-4 text-center">
          <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
          <p className="stat-number text-xl">{s.value}</p>
          <p className="text-xs text-foreground-subtle mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function SubmissionsPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("");
  const { data: submissions, isLoading } = useSubmissionHistory(activeFilter || undefined);

  return (
    <div className="min-h-screen relative">
      <GradientMesh />

      <div className="max-w-3xl mx-auto pb-24 lg:pb-8 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 pb-4"
        >
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <History className="w-5.5 h-5.5 text-accent-light" />
            Submission History
          </h1>
          <p className="text-sm text-foreground-muted mt-0.5">
            All your past assignment submissions and grades
          </p>
        </motion.div>

        {/* Stats */}
        {!isLoading && submissions && submissions.length > 0 && (
          <StatsBar submissions={submissions} />
        )}

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-5"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === f.key
                  ? "bg-accent text-white"
                  : "bg-surface/40 text-foreground-muted hover:text-foreground border border-card-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-28 animate-pulse" />
            ))}
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {submissions.map((sub, i) => (
              <SubmissionCard key={sub.id} sub={sub} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
