"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssignment, useSubmitAssignment } from "@web/hooks/use-classroom";
import { GradientMesh } from "@web/components/ui/background";
import { FileUpload } from "@web/components/ui/file-upload";
import { Modal } from "@web/components/ui/modal";
import { useToast } from "@web/components/ui/toast-provider";
import {
  ArrowLeft, Clock, User, Calendar, ExternalLink, CheckCircle2,
  Zap, AlertTriangle, Send, FileText, Sparkles
} from "lucide-react";

// ─── Sophisticated Motion Variants ──────────────────────────────────────

const smoothEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
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
    <div className={`bg-surface/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl transition-all duration-500 hover:border-white/10 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] ${className}`}>
      {children}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function getTimeLeft(dueDate: string) {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  if (diff <= 0) return { label: "Overdue", color: "text-error", bg: "bg-error/10 border-error/20" };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days === 0) return { label: `${hours}h left`, color: "text-error", bg: "bg-error/10 border-error/20" };
  if (days <= 2) return { label: `${days}d ${hours}h left`, color: "text-warning", bg: "bg-warning/10 border-warning/20" };
  return { label: `${days} days left`, color: "text-success", bg: "bg-success/10 border-success/20" };
}

// ─── Countdown component ─────────────────────────────────────────────────

function Countdown({ dueDate }: { dueDate: string }) {
  const [info, setInfo] = useState(getTimeLeft(dueDate));
  useEffect(() => {
    const timer = setInterval(() => setInfo(getTimeLeft(dueDate)), 60_000);
    return () => clearInterval(timer);
  }, [dueDate]);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest border ${info.bg} ${info.color}`}>
      <Clock className="w-3.5 h-3.5" />
      {info.label}
    </span>
  );
}

// ─── Submit confirmation modal ────────────────────────────────────────────

function SubmitModal({
  open, onClose, onConfirm, fileCount, xpReward, isLoading,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void; fileCount: number; xpReward: number; isLoading: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Submit Assignment" maxWidth="sm">
      <div className="space-y-6">
        <div className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 space-y-3 shadow-inner">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
              <FileText className="w-4 h-4 text-accent-light" />
            </div>
            <span className="text-foreground font-medium">{fileCount} file{fileCount !== 1 ? "s" : ""} attached</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center border border-success/20">
              <Zap className="w-4 h-4 text-success" />
            </div>
            <span className="text-foreground font-medium">You will earn <span className="font-bold text-success">+{xpReward} XP</span></span>
          </div>
        </div>

        <div className="flex items-start gap-3 text-xs text-warning bg-warning/10 border border-warning/20 rounded-[1rem] p-4">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">Submissions cannot be edited once confirmed. Make sure your files are correct.</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-accent hover:bg-accent-light text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Confirm Submit
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const { data: assignment, isLoading } = useAssignment(params.id);
  const { mutateAsync: submit, isPending } = useSubmitAssignment();
  const toast = useToast();

  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isAlreadySubmitted = assignment?.submissions && assignment.submissions.length > 0;
  const canSubmit = fileUrls.length > 0 && !isAlreadySubmitted && !submitted;

  const handleConfirmSubmit = useCallback(async () => {
    if (!assignment) return;
    try {
      const result = await submit({
        assignmentId: assignment.id,
        fileUrls,
        studentNotes: notes || undefined,
      });
      setShowModal(false);
      setSubmitted(true);
      toast.showXP(result.xpAwarded ?? assignment.xpReward, "Assignment submitted!");
    } catch (err: any) {
      setShowModal(false);
      toast.showError(err?.message ?? "Submission failed. Try again.");
    }
  }, [assignment, fileUrls, notes, submit, toast]);

  return (
    <div className="min-h-screen relative selection:bg-accent/30">
      <GradientMesh className="opacity-40" />

      <div className="max-w-4xl mx-auto pb-24 lg:pb-12 px-4 md:px-8 pt-8 relative z-10">

        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <a href="/dashboard/classroom" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-foreground-subtle hover:text-foreground hover:bg-white/10 transition-all mb-8 shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Quests
          </a>
        </motion.div>

        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 rounded-[2rem] bg-white/5 border border-white/5" />
            <div className="h-40 rounded-[2rem] bg-white/5 border border-white/5" />
          </div>
        )}

        {!isLoading && assignment && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Success banner */}
            <AnimatePresence>
              {(submitted || isAlreadySubmitted) && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  className="overflow-hidden"
                >
                  <GlassCard className="!p-5 border-success/30 bg-success/10 flex items-center gap-4 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center border border-success/30 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-bold text-success text-base">Assignment Submitted Successfully</p>
                      <p className="text-sm font-medium text-success/80 mt-0.5">Your teacher will grade it and provide feedback soon.</p>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header card */}
            <motion.div variants={itemVariants}>
              <GlassCard className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-white/5 pb-8">
                    <div>
                      <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">
                        {assignment.title}
                      </h1>
                      <div className="flex items-center gap-4 text-sm font-medium text-foreground-subtle flex-wrap">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-[10px] text-white">
                            {assignment.creator?.name?.[0] ?? "T"}
                          </div>
                          {assignment.creator?.name ?? "Teacher"}
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <Calendar className="w-4 h-4 opacity-70" />
                          Due {new Date(assignment.dueDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap md:flex-col md:items-end">
                      <Countdown dueDate={assignment.dueDate} />
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-[11px] font-black uppercase tracking-widest text-accent-light shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <Zap className="w-3.5 h-3.5" />
                        {assignment.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="prose prose-sm prose-invert max-w-none">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-4">
                      Instructions
                    </h2>
                    <div className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap font-medium">
                      {assignment.description}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Suggested tool */}
            {assignment.suggestedTool && (
              <motion.div variants={itemVariants}>
                <GlassCard className="!p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-inner border border-white/10"
                      style={{ backgroundColor: assignment.suggestedTool.brandColor || "var(--color-accent)" }}
                    >
                      {assignment.suggestedTool.name[0]}
                    </div>
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-accent-light mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        Suggested AI Tool
                      </h2>
                      <p className="font-semibold text-base text-foreground">{assignment.suggestedTool.name}</p>
                    </div>
                  </div>

                  <a
                    href={`/dashboard/tools/${assignment.suggestedTool.id}`}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all text-foreground"
                  >
                    Open Tool
                    <ExternalLink className="w-4 h-4 text-foreground-subtle group-hover:text-foreground" />
                  </a>
                </GlassCard>
              </motion.div>
            )}

            {/* Submission panel */}
            {!isAlreadySubmitted && !submitted && (
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <Send className="w-4 h-4 text-accent-light ml-0.5" />
                    </div>
                    <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
                      Submit Your Work
                    </h2>
                  </div>

                  {/* File Upload Component Wrapper */}
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-2 mb-6">
                    <FileUpload
                      onFilesChange={setFileUrls}
                      maxFiles={5}
                      maxSizeMB={50}
                    />
                  </div>

                  <div className="space-y-3 mb-8">
                    <label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest text-foreground-subtle ml-2">
                      Note to Teacher <span className="opacity-50">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any context, questions, or notes for your teacher…"
                      rows={3}
                      className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm font-medium text-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-foreground-subtle/50 resize-none shadow-inner"
                    />
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    disabled={!canSubmit}
                    className="w-full py-4 rounded-xl bg-accent text-white font-bold text-base hover:bg-accent-light transition-all shadow-[0_0_30px_rgba(99,102,241,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Assignment
                  </button>

                  {fileUrls.length === 0 && (
                    <p className="text-xs font-medium text-warning text-center mt-4 bg-warning/10 border border-warning/20 py-2 rounded-lg max-w-sm mx-auto">
                      Please upload at least one file to submit
                    </p>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {/* Already submitted: view submission */}
            {(isAlreadySubmitted || submitted) && assignment.submissions[0] && (
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-6 pb-4 border-b border-white/5">
                    Submission Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-xs font-medium text-foreground-muted">Status</span>
                      <span className={`font-semibold text-lg ${assignment.submissions[0].status === "GRADED" ? "text-success" : "text-warning"
                        }`}>
                        {assignment.submissions[0].status === "GRADED" ? "Graded" : "Awaiting Grade"}
                      </span>
                    </div>

                    {assignment.submissions[0].score != null && (
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                        <span className="text-xs font-medium text-foreground-muted">Score</span>
                        <span className="font-bold text-xl text-accent-light">
                          {assignment.submissions[0].score}%
                        </span>
                      </div>
                    )}
                  </div>

                  {assignment.submissions[0].feedback && (
                    <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                      <p className="text-xs font-bold uppercase tracking-widest text-accent-light mb-3">Teacher Feedback</p>
                      <p className="text-sm font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {assignment.submissions[0].feedback}
                      </p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Submit confirmation modal */}
      <SubmitModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmSubmit}
        fileCount={fileUrls.length}
        xpReward={assignment?.xpReward ?? 50}
        isLoading={isPending}
      />
    </div>
  );
}