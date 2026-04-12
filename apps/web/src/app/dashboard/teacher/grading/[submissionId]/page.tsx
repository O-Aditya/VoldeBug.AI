"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GradientMesh } from "@web/components/ui/background";
import { useSubmission, useGradeSubmission } from "@web/hooks/use-teacher";
import {
  ChevronLeft, Star, FileText, MessageSquare,
  CheckCircle2, Zap, AlertCircle, ExternalLink,
  User, Calendar, Award
} from "lucide-react";

// ─── Grade options ────────────────────────────────────────────────────────

const LETTER_GRADES = [
  { label: "A+", min: 97, color: "#22c55e" },
  { label: "A",  min: 93, color: "#22c55e" },
  { label: "A-", min: 90, color: "#22c55e" },
  { label: "B+", min: 87, color: "#6366f1" },
  { label: "B",  min: 83, color: "#6366f1" },
  { label: "B-", min: 80, color: "#6366f1" },
  { label: "C+", min: 77, color: "#f59e0b" },
  { label: "C",  min: 73, color: "#f59e0b" },
  { label: "C-", min: 70, color: "#f59e0b" },
  { label: "D",  min: 60, color: "#ef4444" },
  { label: "F",  min: 0,  color: "#7f1d1d" },
];

function scoreToGrade(score: number): string {
  return LETTER_GRADES.find(g => score >= g.min)?.label ?? "F";
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function GradeSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.submissionId as string;

  const { data: sub, isLoading } = useSubmission(submissionId);
  const gradeMutation = useGradeSubmission();

  const [score, setScore] = useState<number>(0);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [xpOverride, setXpOverride] = useState<number | "">("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>();

  // Auto-sync grade from score
  const handleScoreChange = (v: number) => {
    const clamped = Math.max(0, Math.min(100, v));
    setScore(clamped);
    setGrade(scoreToGrade(clamped));
  };

  const handleSubmit = useCallback(async () => {
    if (!feedback.trim()) { setError("Please leave feedback for the student."); return; }
    setError(undefined);
    try {
      await gradeMutation.mutateAsync({
        submissionId,
        data: {
          score,
          grade,
          feedback,
          xpAwarded: xpOverride === "" ? undefined : Number(xpOverride),
        },
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/teacher/grading"), 1200);
    } catch (e: any) {
      setError(e.message ?? "Failed to submit grade.");
    }
  }, [submissionId, score, grade, feedback, xpOverride, gradeMutation, router]);

  const currentGradeConfig = LETTER_GRADES.find(g => g.label === grade) ?? LETTER_GRADES[LETTER_GRADES.length - 1];

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <GradientMesh />
        <div className="max-w-3xl mx-auto pt-8 px-4 space-y-4">
          <div className="h-8 w-48 bg-surface animate-pulse rounded-xl" />
          <div className="card h-64 animate-pulse" />
          <div className="card h-48 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-lg">Submission not found</p>
          <button onClick={() => router.back()} className="text-accent-light text-sm mt-2 hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="font-display text-xl font-bold">Grade Submitted!</h2>
          <p className="text-foreground-muted text-sm">The student has been notified. Redirecting…</p>
        </motion.div>
      </div>
    );
  }

  const isAlreadyGraded = sub.status === "GRADED" || sub.status === "RETURNED";

  return (
    <div className="min-h-screen relative">
      <GradientMesh />
      <div className="max-w-3xl mx-auto pb-24 lg:pb-8 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pt-6 pb-4">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" />Back to Grading
          </button>
          <h1 className="font-display text-2xl font-bold">Grade Submission</h1>
          <p className="text-sm text-foreground-muted mt-1">{sub.assignment.title}</p>
        </motion.div>

        <div className="space-y-5">
          {/* Student info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-lg font-bold text-accent-light">
                {sub.student.name?.[0] ?? "?"}
              </div>
              <div>
                <p className="font-display text-base font-semibold">{sub.student.name ?? "Unknown"}</p>
                <p className="text-sm text-foreground-muted">{sub.student.email}</p>
              </div>
              <div className="ml-auto flex items-center gap-3 text-xs text-foreground-subtle">
                <Calendar className="w-3.5 h-3.5" />
                Submitted {new Date(sub.submittedAt).toLocaleDateString()}
              </div>
            </div>
          </motion.div>

          {/* Submission content */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
            <h2 className="font-display text-base font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-accent-light" />
              Submitted Files ({sub.fileUrls?.length ?? 0})
            </h2>
            {sub.fileUrls?.length > 0 ? (
              <div className="space-y-2">
                {sub.fileUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 rounded-xl border border-card-border hover:border-card-border-hover hover:bg-surface/40 transition-all text-sm">
                    <FileText className="w-4 h-4 text-foreground-subtle" />
                    <span className="flex-1 truncate">{url.split("/").pop() || `File ${i + 1}`}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-foreground-subtle" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground-subtle">No files attached.</p>
            )}

            {sub.studentNotes && (
              <div className="mt-4 pt-4 border-t border-card-border">
                <p className="text-xs font-medium text-foreground-subtle mb-1.5 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />Student Notes
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">{sub.studentNotes}</p>
              </div>
            )}
          </motion.div>

          {/* Already graded banner */}
          {isAlreadyGraded && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-warning/20 bg-warning/8 text-warning text-sm">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
              This submission is already graded (Score: {sub.score}, Grade: {sub.grade}). You can update the grade below.
            </div>
          )}

          {/* Grading form */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5 space-y-5">
            <h2 className="font-display text-base font-semibold flex items-center gap-2">
              <Star className="w-4.5 h-4.5 text-yellow-400" />
              Grade
            </h2>

            {/* Score slider + number */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Score</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} max={100} value={score}
                    onChange={e => handleScoreChange(Number(e.target.value))}
                    className="input-base w-20 text-center text-lg font-bold"
                  />
                  <span className="text-foreground-subtle text-sm">/ 100</span>
                </div>
              </div>
              <input
                type="range" min={0} max={100} value={score}
                onChange={e => handleScoreChange(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              {/* Grade pill */}
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: currentGradeConfig.color }}
                >
                  {grade || "—"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {LETTER_GRADES.map(g => (
                    <button
                      key={g.label}
                      onClick={() => { setGrade(g.label); setScore(g.min); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        grade === g.label ? "text-white shadow-md" : "bg-surface text-foreground-muted hover:text-foreground"
                      }`}
                      style={grade === g.label ? { backgroundColor: g.color } : {}}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* XP override */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent-light" />
                XP Override
                <span className="text-foreground-subtle text-xs font-normal ml-1">(optional — defaults to assignment XP)</span>
              </label>
              <input
                type="number" min={0} max={1000} value={xpOverride}
                onChange={e => setXpOverride(e.target.value === "" ? "" : Number(e.target.value))}
                className="input-base w-32"
                placeholder={`${sub.assignment.xpReward}`}
              />
            </div>

            {/* Feedback */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-foreground-subtle" />
                Feedback <span className="text-error">*</span>
              </label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={5}
                className="input-base resize-none"
                placeholder="Write constructive feedback for the student. This will be visible to them after grading."
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-error/8 border border-error/20 text-error text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={gradeMutation.isPending || !feedback.trim() || !grade}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm shadow-xl shadow-accent/20 hover:bg-accent-light transition-all disabled:opacity-60"
            >
              {gradeMutation.isPending ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting grade…</>
              ) : (
                <><Award className="w-4.5 h-4.5" />Submit Grade & Notify Student</>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
