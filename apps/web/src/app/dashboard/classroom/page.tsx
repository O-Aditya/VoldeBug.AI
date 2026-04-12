"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssignmentList } from "@web/hooks/use-classroom";
import { GradientMesh } from "@web/components/ui/background";
import {
  BookOpen, Clock, CheckCircle2, AlertTriangle, ChevronRight,
  ExternalLink, Zap, Calendar, Filter, ArrowUpRight
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────

type Tab = "all" | "active" | "completed" | "overdue";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
];

// ─── Sophisticated Motion Variants ──────────────────────────────────────

const smoothEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: smoothEase },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.3, ease: smoothEase },
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────

function getDaysLeft(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function dueBadgeStyle(days: number, isCompleted: boolean) {
  if (isCompleted) return "bg-success/10 border-success/20 text-success";
  if (days < 0) return "bg-error/10 border-error/20 text-error";
  if (days === 0) return "bg-error/10 border-error/20 text-error";
  if (days <= 2) return "bg-warning/10 border-warning/20 text-warning";
  return "bg-white/5 border-white/10 text-foreground-subtle";
}

function dueBadgeLabel(days: number, isCompleted: boolean) {
  if (isCompleted) return "Completed";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days} days left`;
}

// ─── Premium UI Sub-components ────────────────────────────────────────────

function EmptyState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, { title: string; desc: string; icon: React.ElementType }> = {
    all: { title: "No assignments yet", desc: "Your teacher hasn't posted any assignments. Check back soon!", icon: BookOpen },
    active: { title: "All caught up!", desc: "You have no active assignments right now. Great work!", icon: CheckCircle2 },
    completed: { title: "No submissions yet", desc: "Complete your first assignment to see it here.", icon: Zap },
    overdue: { title: "No overdue assignments", desc: "You're on top of everything. Keep it up!", icon: CheckCircle2 },
  };
  const { title, desc, icon: Icon } = messages[tab];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="flex flex-col items-center justify-center py-20 text-center bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-xl mt-4"
    >
      <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center mb-5 shadow-inner">
        <Icon className="w-10 h-10 text-foreground-subtle opacity-50" />
      </div>
      <p className="font-display text-xl font-medium tracking-tight text-foreground mb-2">{title}</p>
      <p className="text-sm font-medium text-foreground-subtle max-w-sm">{desc}</p>
    </motion.div>
  );
}

function AssignmentCard({ assignment }: { assignment: any }) {
  const isCompleted = assignment.submissions && assignment.submissions.length > 0;
  const days = getDaysLeft(assignment.dueDate);
  const badgeStyle = dueBadgeStyle(days, isCompleted);
  const badgeLabel = dueBadgeLabel(days, isCompleted);
  const toolColor = assignment.suggestedTool?.brandColor || "var(--color-accent)";

  return (
    <motion.a
      variants={itemVariants}
      layout
      href={`/dashboard/classroom/${assignment.id}`}
      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 rounded-[1.5rem] border border-white/5 bg-surface/40 backdrop-blur-xl hover:bg-white/10 hover:border-white/10 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.3)] transition-all duration-500 gap-4 relative overflow-hidden"
    >
      <div className="flex items-start sm:items-center gap-4 md:gap-5 flex-1 min-w-0 z-10">
        {/* Tool badge / Icon */}
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-[1.25rem] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-inner border border-black/10 transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundColor: toolColor }}
        >
          {assignment.suggestedTool?.name?.[0] ?? "?"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col mb-2">
            <h3 className="text-base md:text-lg font-medium text-foreground group-hover:text-accent-light transition-colors duration-300 truncate">
              {assignment.title}
            </h3>
            <p className="text-xs font-medium text-foreground-subtle mt-0.5 truncate">
              {assignment.className}
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 mt-2">
            {/* Due Date Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${badgeStyle}`}>
              {badgeLabel}
            </span>

            {/* Suggested Tool Badge */}
            {assignment.suggestedTool && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm"
                style={{ backgroundColor: `${toolColor}15`, color: toolColor, border: `1px solid ${toolColor}25` }}
              >
                {assignment.suggestedTool.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: XP & Status */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0 z-10 w-full sm:w-auto">
        <span className="text-sm font-black text-success bg-success/10 px-3 py-1 rounded-xl border border-success/20 whitespace-nowrap">
          +{assignment.xpReward} XP
        </span>

        {isCompleted ? (
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-success mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Submitted
            {assignment.submissions[0]?.score != null && (
              <span className="text-foreground-muted ml-1 lowercase tracking-normal">
                ({assignment.submissions[0].score}%)
              </span>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/10 transition-all duration-300 mt-1 hidden sm:flex">
            <ArrowUpRight className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground transition-colors" />
          </div>
        )}
      </div>
    </motion.a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function ClassroomPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const { data: assignments, isLoading } = useAssignmentList();

  const filtered = useMemo(() => {
    if (!assignments) return [];
    const now = new Date();
    switch (activeTab) {
      case "active":
        return assignments.filter((a) => {
          const due = new Date(a.dueDate);
          return (!a.submissions || a.submissions.length === 0) && due >= now;
        });
      case "completed":
        return assignments.filter((a) => a.submissions && a.submissions.length > 0);
      case "overdue":
        return assignments.filter((a) => {
          const due = new Date(a.dueDate);
          return (!a.submissions || a.submissions.length === 0) && due < now;
        });
      default:
        return assignments;
    }
  }, [assignments, activeTab]);

  const counts = useMemo(() => {
    if (!assignments) return { all: 0, active: 0, completed: 0, overdue: 0 };
    const now = new Date();
    return {
      all: assignments.length,
      active: assignments.filter((a) => (!a.submissions || !a.submissions.length) && new Date(a.dueDate) >= now).length,
      completed: assignments.filter((a) => a.submissions && a.submissions.length > 0).length,
      overdue: assignments.filter((a) => (!a.submissions || !a.submissions.length) && new Date(a.dueDate) < now).length,
    };
  }, [assignments]);

  return (
    <div className="min-h-screen relative selection:bg-accent/30">
      <GradientMesh className="opacity-40" />

      <div className="max-w-5xl mx-auto pb-24 lg:pb-12 px-4 md:px-8 pt-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-accent/20 to-purple-500/10 border border-accent/20 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <BookOpen className="w-8 h-8 text-accent-light" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-medium tracking-tight text-foreground">
                Classroom
              </h1>
              <p className="text-sm font-medium text-foreground-subtle mt-1 tracking-wide">
                <span className="text-foreground">{counts.active}</span> active quests · <span className="text-success">{counts.completed}</span> completed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Segmented Glass Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
          className="inline-flex p-1.5 bg-surface/30 backdrop-blur-xl rounded-[1.25rem] border border-white/5 mb-8 shadow-lg overflow-x-auto max-w-full hide-scrollbar"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center justify-center py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${activeTab === tab.key
                  ? "text-white"
                  : "text-foreground-subtle hover:text-foreground hover:bg-white/5"
                }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-accent rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {counts[tab.key] > 0 && (
                <span
                  className={`relative z-10 ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-black ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/10 text-foreground-muted"
                    }`}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-[1.5rem] bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <AnimatePresence mode="wait">
              <EmptyState key="empty" tab={activeTab} />
            </AnimatePresence>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              key={activeTab} // Forces re-animation when switching tabs
              className="space-y-4"
            >
              {filtered.map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}